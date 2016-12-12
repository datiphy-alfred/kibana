import 'ace';
import management from 'ui/management';
import uiModules  from 'ui/modules';
import 'ui/directives/confirm_click';

import 'plugins/kibana/my_management/sections/objects/_view';
import 'plugins/kibana/my_management/sections/objects/_objects';


// add the module deps to this module
uiModules.get('apps/my_management');

// alfredt: unique register
management.getSection('kibana').register('my_management_objects', {
  display: '(MyManagement) Saved Objects',
  order: 110,
  url: '#/my_management/kibana/objects'
});
