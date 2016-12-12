import IndexPatternsFieldProvider from 'ui/index_patterns/_field';
import UrlProvider from 'ui/url';
import uiRoutes from 'ui/routes';
import 'ui/field_editor';

import fieldEditorTemplate from 'plugins/kibana/my_management/sections/indices/_field_editor.html';
import 'plugins/kibana/my_management/sections/indices/_index_header';

uiRoutes
//.when('/management/kibana/indices/:indexPatternId/create-field/',       { mode: 'create' })
//.when('/management/kibana/indices/:indexPatternId/field/:fieldName',    { mode: 'edit' })
.when('/my_management/kibana/indices/:indexPatternId/field/:fieldName', { mode: 'edit' })
.when('/my_management/kibana/indices/:indexPatternId/create-field/',    { mode: 'create' })
.defaults(/my_management\/kibana\/indices\/[^\/]+\/(field|create-field)(\/|$)/, {
//.defaults(/management\/kibana\/indices\/[^\/]+\/(field|create-field)(\/|$)/, {
  template: fieldEditorTemplate,

  resolve: {
    indexPattern: function ($route, courier) {
      var ipi   = $route.current.params.indexPatternId;
      var cGet = courier.indexPatterns.get(ipi);

      return cGet.catch(courier.redirectWhenMissing('/my_management/kibana/indices'));
    }
  },

  controllerAs: 'myFieldSettings',
  controller: function MyFieldEditorPageController($route, Private, Notifier, docTitle) {

    const Field  = Private(IndexPatternsFieldProvider);
    const notify = new Notifier({ location: 'Field Editor' });
    const kbnUrl = Private(UrlProvider);

    this.mode = $route.current.mode;
    this.indexPattern = $route.current.locals.indexPattern;


    if (this.mode === 'edit') {
      const fieldName = $route.current.params.fieldName;
      this.field = this.indexPattern.fields.byName[fieldName];

      if (!this.field) {
        notify.error(this.indexPattern + ' does not have a "' + fieldName + '" field.');
        kbnUrl.redirectToRoute(this.indexPattern, 'edit');
        return;
      }

    }
    else if (this.mode === 'create') {
      this.field = new Field(this.indexPattern, {
        scripted: true,
        type: 'number'
      });
    }
    else {
      throw new Error('unknown fieldSettings mode ' + this.mode);
    }

    docTitle.change([this.field.name || 'New Scripted Field', this.indexPattern.id]);
    this.goBack = function () {
      kbnUrl.changeToRoute(this.indexPattern, 'edit');
    };
  }
});
