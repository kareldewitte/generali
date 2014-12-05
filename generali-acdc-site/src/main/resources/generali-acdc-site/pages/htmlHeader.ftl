[#-- Assigns: Page's model & definition, based on the rendering hierarchy and not the node hierarchy  --]
[#assign pageModel = model.root!]
[#assign pageDef = pageModel.definition!]
[#assign homeName = stkfn.homeName(content)!]
[#assign homeTitle = stkfn.homeTitle(content)!]
[#assign siteTitle = stkfn.siteTitle(content)!homeTitle!homeName!]
[#assign contentPageTitle = content.windowTitle!content.title!content.@name]

<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="keywords" content="${content.keywords!content.title!content.@name}" />
<meta name="description" content="${content.description!content.abstract!}" />
<meta name="robots" content="all" />
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="${pageModel.badgeWithoutTags!}" />
<title>${siteTitle} - ${contentPageTitle}</title>

[#list stkfn.theme(pageModel.site).cssFiles as cssFile]
    [#if cssFile.conditionalComment?has_content]
    <!--[if ${cssFile.conditionalComment}]>
    [/#if]
    <link rel="stylesheet" type="text/css" href="${cssFile.link}" media="${cssFile.media}" />
    [#if cssFile.conditionalComment?has_content]
    <![endif]-->
    [/#if]
[/#list]


[#list stkfn.theme(pageModel.site).jsFiles as jsFile]
    <script src="${jsFile.link}" type="text/javascript"></script>
[/#list]

[#list pageModel.site.jsFiles as jsFile]
    <script src="${jsFile.link}" type="text/javascript"></script>
[/#list]

[#list pageDef.jsFiles as jsFile]
    <script src="${jsFile.link}" type="text/javascript"></script>
[/#list]

<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->