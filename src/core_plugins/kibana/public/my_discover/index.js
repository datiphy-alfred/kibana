import 'plugins/kibana/my_discover/saved_searches/saved_searches';
import 'plugins/kibana/my_discover/directives/no_results';
import 'plugins/kibana/my_discover/directives/timechart';
import 'ui/collapsible_sidebar';
import 'plugins/kibana/my_discover/components/field_chooser/field_chooser';
import 'plugins/kibana/my_discover/controllers/discover';
import 'plugins/kibana/my_discover/styles/main.less';
import 'ui/doc_table/components/table_row';
import savedObjectRegistry from 'ui/saved_objects/saved_object_registry';

// preload

savedObjectRegistry.register(require('plugins/kibana/my_discover/saved_searches/saved_search_register'));
