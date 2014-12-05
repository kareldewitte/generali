<!DOCTYPE html>
<html xml:lang="${cmsfn.language()}" lang="${cmsfn.language()}">
<head>
    [@cms.init /]
    [@cms.area name="htmlHeader"/]
</head>

[#if def.bodyID?has_content]
    [#assign bodyID = 'id="${def.bodyID}"']
[#else]
    [#assign bodyID = '']
[/#if]
<body ${bodyID}>
[@cms.area name="bodyBeginScripts"/]


<!-- Navigation -->
<nav class="navbar navbar-inverse" role="navigation">
    <div class="container">
    [@cms.area name="branding"/]
            [#include def.navigation.horizontal.template]
    </div>
    <!-- /.container -->
</nav>
<!-- stage will be styled by css -->
[@cms.area name="stage"/]

<!-- Page Content -->
<div class="container" role="main">
[@cms.area name="main"/]

        [@cms.area name="footer"/]

</div>
<!-- /.container -->


[@cms.area name="bodyEndScripts"/]
</body>
</html>