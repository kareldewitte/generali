[#assign pageModel = model.root!]
[#assign inhContent = cmsfn.inherit(content)!]
[#assign homeName = stkfn.homeName(content)!]
[#assign homeTitle = stkfn.homeTitle(content)!homeName!]
[#assign siteTitle = stkfn.siteTitle(content)!homeTitle!]
[#assign logoImageLink = pageModel.logoImageLink!]

<!-- Brand and toggle get grouped for better mobile display -->
<div class="navbar-header">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
    </button>
    <div id='logo'>
        [#if logoImageLink?has_content]<img src="${logoImageLink}"  />[/#if]
    </div>
    <a class="navbar-brand" href="${stkfn.homeLink(content)}">Generali Home</a>
</div>