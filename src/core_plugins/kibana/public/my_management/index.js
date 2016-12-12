import _ from 'lodash';

import chrome     from 'ui/chrome/chrome';
import management from 'ui/management';
import uiRoutes   from 'ui/routes';
import uiModules  from 'ui/modules';
import 'ui/kbn_top_nav';
import 'ui/directives/bread_crumbs';
import 'ui/filters/start_from';
import 'ui/field_editor';

import appTemplate     from 'plugins/kibana/my_management/app.html';
import landingTemplate from 'plugins/kibana/my_management/landing.html';
import 'plugins/kibana/my_management/sections';
import 'plugins/kibana/my_management/styles/main.less';
import 'plugins/kibana/my_management/sections/indices/_indexed_fields';
import 'plugins/kibana/my_management/sections/indices/_scripted_fields';


uiRoutes.when('/my_management', { template: landingTemplate });

require('ui/index_patterns/route_setup/load_default')({
  whenMissingRedirectTo: '/my_management/kibana/index'
});

uiModules
.get('apps/my_management')
.directive('myKbnManagementApp', function (Private, $route, $location, timefilter, buildNum, buildSha) {


  return {
    restrict: 'E',
    template: appTemplate,
    transclude: true,
    scope: {
      sectionName: '@section'
      // alfredt: , debug: true (this doesn't  actually work)
    },
    link: function ($scope) {
      timefilter.enabled = false;
      $scope.sections = management.items.inOrder;
      $scope.section  = management.getSection($scope.sectionName) || management;
      // alfredt: debug = true (this doesn't  actually work)

      if ($scope.section) {
        $scope.section.items.forEach(item => {
          item.active = `#${$location.path()}`.indexOf(item.url) > -1;
        });
      }
      management.getSection('kibana').info = `Build ${buildNum}, Commit SHA ${buildSha.substr(0, 8)}`;
    }

  };
});

uiModules
.get('apps/my_management')
.directive('myKbnManagementLanding', function (kbnVersion) {
  return {
    restrict: 'E',
    link: function ($scope) {
      $scope.sections = management.items.inOrder;
      $scope.kbnVersion = kbnVersion;
    }
  };
});
