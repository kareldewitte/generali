[#if model.navigation.showHorizontalNavigation]
    [#assign navigation = model.navigation.horizontalNavigation/]
    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
    [@renderNavigation navigation=navigation/]
    </div>
    <!-- /.navbar-collapse -->
[/#if]

[#macro renderNavigation navigation]
    [#if navigation.items?has_content]
        <ul class="nav navbar-nav navbar-right">
            [#list navigation.items as item]
                  [#if item.items?has_content]
                      <li class="dropdown">
                          <a href="#" class="dropdown-toggle" data-toggle="dropdown">${item.navigationTitle} <b class="caret"></b></a>
                  [#elseif item.selected]
                      <li class="active">
                          <a href="${item.href}">${item.navigationTitle}</a>
                  [#else]
                      <li>
                          <a href="${item.href}">${item.navigationTitle}</a>
                  [/#if]
                  [#if item.items?has_content]
                      [@renderDropdown navigation=item /]
                  [/#if]
                   </li>
            [/#list]
        </ul>
    [/#if]
[/#macro]

[#macro renderDropdown navigation]
    [#if navigation.items?has_content]
        <ul class="dropdown-menu">
            [#list navigation.items as item]

                [#if item.selected]
                      <li class="active"><a href="${item.href}">${item.navigationTitle}</a></li>
                 [#else]
                      <li><a href="${item.href}">${item.navigationTitle}</a></li>
                 [/#if]
            [/#list]
        </ul>
    [/#if]
[/#macro]



                