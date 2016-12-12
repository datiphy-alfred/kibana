import _ from 'lodash';
import $ from 'jquery';
import uiModules from 'ui/modules';
import noResultsTemplate from '../partials/no_results.html';

uiModules
.get('apps/my_discover')
.directive('myDiscoverNoResults', function () {
  return {
    restrict: 'E',
    template: noResultsTemplate
  };
});
