import _ from 'lodash';

import UrlProvider from 'ui/url';
import uiRoutes from 'ui/routes';
import uiModules from 'ui/modules';
import IngestProvider from 'ui/ingest';

import 'plugins/kibana/my_management/sections/indices/_indexed_fields';
import 'plugins/kibana/my_management/sections/indices/_scripted_fields';
import 'plugins/kibana/my_management/sections/indices/_index_header';

import RefreshKibanaIndex        from 'plugins/kibana/my_management/sections/indices/_refresh_kibana_index';
import editTemplate              from 'plugins/kibana/my_management/sections/indices/_edit.html';
import IndicesFieldTypesProvider from 'plugins/kibana/my_management/sections/indices/_field_types';

uiRoutes
.when('/my_management/kibana/indices/:indexPatternId', {
  template: editTemplate,
  resolve: {

    indexPattern: function ($route, courier) {

      return courier.indexPatterns
        .get($route.current.params.indexPatternId)
        .catch(courier.redirectWhenMissing('/my_management/kibana/index'));
    }
  }
});

uiRoutes
.when('/my_management/kibana/indices', {
  resolve: {
    redirect: function ($location, config) {

      const defaultIndex = config.get('defaultIndex');
      let path = '/my_management/kibana/index';

      if (defaultIndex) {
        path = `/my_management/kibana/indices/${defaultIndex}`;
      }

      $location.path(path).replace();
    }
  }
});

uiModules.get('apps/my_management')
.controller('myManagementIndicesEdit', function ($scope, $location, $route, config, courier, Notifier, Private, AppState, docTitle) {

  const notify = new Notifier();
  const $state = $scope.state = new AppState();
  const refreshKibanaIndex = Private(RefreshKibanaIndex);
  const ingest = Private(IngestProvider);

  $scope.kbnUrl = Private(UrlProvider);
  $scope.indexPattern = $route.current.locals.indexPattern;
  docTitle.change($scope.indexPattern.id);
  const otherIds = _.without($route.current.locals.indexPatternIds, $scope.indexPattern.id);

  const fieldTypes = Private(IndicesFieldTypesProvider);
  $scope.$watch('indexPattern.fields', function () {
    $scope.fieldTypes = fieldTypes($scope.indexPattern);
  });

  $scope.changeTab = function (obj) {
    $state.tab = obj.index;
    $state.save();
  };

  $scope.$watch('state.tab', function (tab) {
    if (!tab) $scope.changeTab($scope.fieldTypes[0]);
  });

  $scope.$watchCollection('indexPattern.fields', function () {
    $scope.conflictFields = _.filter($scope.indexPattern.fields, {type: 'conflict'});
  });

  $scope.refreshFields = function () {
    $scope.indexPattern.refreshFields();
  };

  $scope.removePattern = function () {
    if ($scope.indexPattern.id === config.get('defaultIndex')) {
      config.remove('defaultIndex');
      if (otherIds.length) {
        config.set('defaultIndex', otherIds[0]);
      }
    }

    courier.indexPatterns.delete($scope.indexPattern)
    .then(refreshKibanaIndex)
    .then(function () {
      $location.url('/my_management/kibana/index');
    })
    .catch(notify.fatal);
  };

  $scope.setDefaultPattern = function () {
    config.set('defaultIndex', $scope.indexPattern.id);
  };

  $scope.setIndexPatternsTimeField = function (field) {
    if (field.type !== 'date') {
      notify.error('That field is a ' + field.type + ' not a date.');
      return;
    }
    $scope.indexPattern.timeFieldName = field.name;
    return $scope.indexPattern.save();
  };
});
