import management from 'ui/management';
import uiRoutes   from 'ui/routes';
import uiModules  from 'ui/modules';

import indexTemplate from 'plugins/kibana/my_management/sections/indices/index.html';
import 'plugins/kibana/my_management/sections/indices/_create';
import 'plugins/kibana/my_management/sections/indices/_edit';
import 'plugins/kibana/my_management/sections/indices/_field_editor';

// alfredt: function print_aac(assocArray){for(var key in assocArray) console.log("key: "+key+" value: "+assocArray[key]);}

const indexPatternsResolutions = {
  indexPatternIds: function (courier) {
    var cIds = courier.indexPatterns.getIds();
    return cIds;
  }
};

// add a dependency to all of the subsection routes
uiRoutes.defaults(/management\/kibana\/indices/,    { resolve: indexPatternsResolutions });
uiRoutes.defaults(/management\/kibana\/index/,      { resolve: indexPatternsResolutions });
uiRoutes.defaults(/my_management\/kibana\/indices/, { resolve: indexPatternsResolutions });
uiRoutes.defaults(/my_management\/kibana\/index/,   { resolve: indexPatternsResolutions });

// wrapper directive, which sets some global stuff up like the left nav
uiModules.get('apps/my_management')
.directive('myKbnManagementIndices', function ($route, config, kbnUrl) {
  return {
    restrict: 'E',
    transclude: true,
    template: indexTemplate,
    //
    scope: {
      debug: true
    },
    //
    link: function ($scope) {

      $scope.debug = true;

      $scope.editingId = $route.current.params.indexPatternId;
      config.bindToScope($scope, 'defaultIndex');

      $scope.$watch('defaultIndex', function () {
        const ids = $route.current.locals.indexPatternIds;
        $scope.indexPatternList = ids.map(function (id) {
          return {
            id: id,
            url: kbnUrl.eval('#/my_management/kibana/indices/{{id}}', {id: id}),
            class: 'sidebar-item-title ' + ($scope.editingId === id ? 'active' : ''),
            default: $scope.defaultIndex === id
          };
        });
      });

      $scope.$emit('application.load');
    }
  };
});

// alfredt: unique register
management.getSection('kibana').register('my_management_indices', {
  display: '(MyManagement) Index Patterns',
  order: 100,
  url: '#/my_management/kibana/indices/'
});