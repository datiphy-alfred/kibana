import _ from 'lodash';

import management from 'ui/management';
import uiRoutes   from 'ui/routes';
import uiModules  from 'ui/modules';

import 'plugins/kibana/my_management/sections/settings/advanced_row';
import indexTemplate    from 'plugins/kibana/my_management/sections/settings/index.html';
import toEditableConfig from 'plugins/kibana/my_management/sections/settings/lib/to_editable_config';


uiRoutes
.when('/my_management/kibana/settings', {
  template: indexTemplate
});

uiModules.get('apps/my_management')
.directive('myKbnManagementAdvanced', function (config, Notifier, Private, $rootScope) {
  return {
    restrict: 'E',
    link: function ($scope) {
      // react to changes of the config values
      config.watchAll(changed, $scope);

      // initial config setup
      changed();

      function changed(values) {
        const all = config.getAll();
        const editable = _(all)
          .map((def, name) => toEditableConfig({
            def,
            name,
            value: def.userValue,
            isCustom: config.isCustom(name)
          }))
          .value();
        const writable = _.reject(editable, 'readonly');
        $scope.configs = writable;
      }
    }
  };
});

// alfredt: unique register
management.getSection('kibana').register('my_management_settings', {
  display: '(My_Management) Advanced Settings',
  order: 120,
  url: '#/my_management/kibana/settings'
});
