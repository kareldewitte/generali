/**
 * Created by kdewitte on 14/10/14.
 *
 * - utility library for usage with Magnolia rest api as it is
 * TODO:
 * - Should be generalized to be used for generic forms, multiple images.
 * - Support update and delete for nodes.
 * - Support for basic auth
 * ----------------------------------------------------------------------
 *
 *
 */

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function shortUUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function createResourceProp(name,type,multiple,values){
    var emptyResourceProps = {
        name: name,
        type: type,
        multiple: multiple,
        values: []
    }
  emptyResourceProps.values.push(values);
  return emptyResourceProps;
}





function _(data){

    var emptyNode = {
        name: "nodeName",
        type: "mgnl:content",
        path: "/",
        properties: []
    }


    var status = {
        created: false
    }

    var resourceNode = clone(emptyNode);
    resourceNode.name = "photo";
    resourceNode.type = "mgnl:resource";
    resourceNode.properties = [];

    this.contentNode = clone(emptyNode);
    this.resourceNode = clone(resourceNode);
    this.status = clone(status);

    if (data) {

        if (window === this) {
            return new _(data);
        }
        // We're in the correct object scope:
        // Init our element object and return the object
        this.mgnlFormData = data.serializeObject();
        this.status.created = false;
        return this;
    } else {

        return this;
    }

}

_.prototype = {

    /**
     * Creates the correct properties puts everything in the correct form
     * @returns {_}
     */
    encodeForm:function(){

        this.contentNode.name = this.mgnlFormData['name']+"_"+shortUUID();
        this.contentNode.path = "/"+this.contentNode.name;


        this.contentNode.properties.push(createResourceProp("name","String",false,this.mgnlFormData.name));
        this.contentNode.properties.push(createResourceProp("company","String",false,this.mgnlFormData.company));
        this.contentNode.properties.push(createResourceProp("email","String",false,this.mgnlFormData.email));
        this.contentNode.properties.push(createResourceProp("favCMS","String",false,this.mgnlFormData.favoriteCMS));

        this.status.created  = true;
        return this;
    },
    addPicture:function(image, onImageLoaded) {
        this.resourceNode.path = this.contentNode.path + "/photo";
        // only one
       var file = image[0];
       var context = this;
       this.mgnlImage = file;
       this.resourceNode.properties.push(createResourceProp("size","Long",false,file.size));
       this.resourceNode.properties.push(createResourceProp("extension","String",false,file.type.replace("image/","")));
       this.resourceNode.properties.push(createResourceProp("jcr:mimeType","String",false,file.type));
       this.resourceNode.properties.push(createResourceProp("fileName","String",false,file.name));
       this.mgnlMimeType = file.type;
       console.log(file);

        var reader = new FileReader();
        reader.onload = (function(file) {
            var image = new Image();
            image.src = file.target.result;
            image.onload = function() {
                // access image size here
                console.log(this.width);
                console.log(parent.status.created);
                onImageLoaded(this,context);
            };
        });
        reader.readAsDataURL(file);
        this.reader = reader;
        return this;
    }}

 function createNodesWithImagePublish(url,image,context,progressBarId){
       if(context.status.created){
           console.log("Creating node "+url);

           $.ajax({
                url: url,
                type: 'PUT',
                data:  JSON.stringify(context.contentNode),
                   headers: {
                       Accept : "application/json",
                       "Content-Type": "application/json"
                   },

                cache: false,
                processData:false,
                success: function(data, textStatus, jqXHR){
                    //do the other calls
                    console.log("creating image:"+textStatus);
                    // get extension
                    var base64Img = image.src.replace("data:"+context.mgnlMimeType+";base64,","");
                    context.resourceNode.properties.push(createResourceProp("jcr:data","Binary",false,base64Img));
                    context.resourceNode.properties.push(createResourceProp("width","Long",false,image.width));
                    context.resourceNode.properties.push(createResourceProp("height","Long",false,image.height));


                    $.ajax({
                            url: url+"/"+context.contentNode.name,
                            type: 'PUT',
                            data:  JSON.stringify(context.resourceNode),
                            headers: {
                                Accept : "application/json",
                                "Content-Type": "application/json"
                            },

                            cache: false,
                            processData:true,
                            xhr: function() {
                                var xhr = new window.XMLHttpRequest();
                                xhr.upload.addEventListener("progress", function(evt) {
                                    if (evt.lengthComputable) {
                                        var percentComplete = evt.loaded / evt.total;
                                        console.log(percentComplete);
                                        if($(progressBarId)){
                                            console.log($(progressBarId).attr("class"));
                                            $(progressBarId).attr("aria-valuenow",percentComplete*100);
                                        }
                                    }

                                }, false);

                                return xhr;
                            },

                            success: function(data, textStatus, jqXHR){
                                //do the other calls
                                console.log(textStatus);
                                //alert("Selfie loaded !");
                                // do the activation
                                $.ajax({
                                    url: '/mgnlAuthor/.rest/commands/v1/workflow/activate',
                                    type: 'POST',
                                    data:'{"repository": "selfies", "path": "/'+context.contentNode.name+'","recursive": "false"}',
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json"
                                    },

                                    cache: false,
                                    processData: false,
                                    success: function (data, textStatus, jqXHR) {
                                        $( "#main" ).empty();
                                        $( "#main" ).append( "<div class='form-success'><h3>Thank you</h3><p>When approved your entry will be displayed here: <a href='/magnoliaPublic/selfie-demo/list.html'>List of selfies</a></p></div>" );
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        console.log(jqXHR);
                                        $( "#main" ).empty();
                                        $( "#main" ).append( "<div class='form-error'><h3>Error</h3><p>Some problem occured with automatic workflow assignment!</p><p>Please try it again.</p></div>" );
                                    }
                                });
                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                $( "#main" ).empty();
                                $( "#main" ).append( "<div class='form-error'><h3>Error</h3><p>Please try it again.</p></div>" );
                            }

                        }

                    );;

                },
                error: function(jqXHR, textStatus, errorThrown){
                    $( "#main" ).empty();
                    $( "#main" ).append( "<div class='form-error'><h3>Error</h3><p>"+textStatus+"</p><p>Please try it again.</p></div>" );
                    console.log("Some error occured "+textStatus);
                }

               }

           );



       }else{
           console.log("Please encodeForm first");
       }

}

function rateImage(url,imageId,rate){
     //curl http://localhost:8080/.rest/selfies/v0/putprop/selfies/content -H  "Content-Type: application/json" --data '{"selfieId": "hello_2", "reqType": "rate","prop": "3.0"}' -v -X PUT
     //check

         var rateObject =
         {
             "selfieId": imageId,
             "reqType": "rate",
             "prop": rate
         }
         console.log(JSON.stringify(rateObject));


         $.ajax({
                 url: url,
                 type: 'PUT',
                 data: JSON.stringify(rateObject),
                 headers: {
                     Accept: "application/json",
                     "Content-Type": "application/json"
                 },

                 cache: false,
                 processData: true,
                 success: function (data, textStatus, jqXHR) {
                     console.log("rating performed");
                 },
                 error: function (jqXHR, textStatus, errorThrown) {
                     console.log("something did not work with the rating");
                 }

             }
         );

}

var docCookies = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};


