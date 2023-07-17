import './comment';
import style from './style.css';
import { formatItem } from './Pages/CampPage.js';
import { fuzzyMatch } from './fts_fuzzy_match.js';
import { log } from './util/logging.js';
import { addStyles, onAjaxRequest, onEvent } from './util/mouseplace.js';

/** @type {Object | null} */
let _originalTemplateData;
/** @type {string} */
let _currentClassification;
let _latestResults;
log('loaded!');

addStyle();
onEvent('camp_page_toggle_blueprint', focusSearchBar);
addInterceptors();
onAjaxRequest(monitorGetTrapComponents, 'managers/ajax/users/gettrapcomponents.php');

// onPageChange({
//   blueprint: {
//     show: () => addSmartSearchBar() ,
//   }
// });

// /**
//  * @param {any} params
//  */
// function itemBrowserOpened(params) {
//   if (!(typeof params === 'string') && params === app.pages.CampPage.BluePrintTypeItemBrowser) {
//     return;
//   }


//   log('item browser opened');
// }

function addStyle() {
  addStyles(style, 'mh-smart-search', true);
}

function addInterceptors() {
  /** @type {ProxyHandler<(arg0: string, arg1: boolean) => Promise<boolean>>} */
  const interceptToggleItemBrowser = {
    apply: async function(target, thisArg, argArray) {
      _originalTemplateData = null;
      addSmartSearchBar(argArray[0]);
      // log(target, thisArg, argArray);
      return Reflect.apply(target, thisArg, argArray);
    }
  };

  /** @type {ProxyHandler<() => void>} */
  const interceptHideItemBrowser = {
    apply: function(target, thisArg) {
      _originalTemplateData = null;
      return Reflect.apply(target, thisArg, []);
    }
  };

  /** @type {ProxyHandler<(templateGroupSource: string, templateType: string, templateData: Object) => void>} */
  const interceptRenderFromFile = {
    apply: function(target, thisArg, [templateGroupSource, templateType, templateData]) {
      // cache template data on blueprint show
      if (_originalTemplateData == null && templateGroupSource === 'CampPage' && templateType === 'tag_groups') {
        _originalTemplateData = templateData;
      }
      return Reflect.apply(target, thisArg, [templateGroupSource, templateType, templateData]);
    }
  };

  app.pages.CampPage.toggleItemBrowser = new Proxy(app.pages.CampPage.toggleItemBrowser, interceptToggleItemBrowser);
  app.pages.CampPage.hideItemBrowser = new Proxy(app.pages.CampPage.hideItemBrowser, interceptHideItemBrowser);
  hg.utils.TemplateUtil.renderFromFile = new Proxy(hg.utils.TemplateUtil.renderFromFile, interceptRenderFromFile);

  $.fn.select2.defaults.matcher = function(term, text) {
    return fuzzyMatch(term, text)[0];
  };

  $.fn.select2.defaults.sortResults = function(results, container, query) {
    const term = query.term;

    if (!Array.isArray(results)) {
      return results;
    }

    if (results.length == 0 || !(results[0].text == null)) {
      return results;
    }

    return fuzzyMatchOn(term, results, (item) => item.text );
  };

  // app.pages.CampPage.toggleItemBrowser = smartSearchToggleItemBroswer(app.pages.CampPage.toggleItemBrowser);
}

function focusSearchBar(eventParams) {
  if (eventParams === 'item_browser') {
    $('#mh-smart-search-input').trigger('focus');
  }
}

/**
 * @param {string} itemClassification
 */
function addSmartSearchBar(itemClassification) {
  const $container = $('.campPage-trap-itemBrowser-itemContainer');

  _currentClassification = itemClassification;
  const $input = $('#mh-smart-search-input', $container);
  // $input.show();
  $input.trigger('focus');
  if ($input.length > 0) {
    $input.val('');
    return;
  }

  $container.prepend(`
  <div class="mh-smart-search-filter"><input id="mh-smart-search-input" type="text" placeholder="${'Smart Search: '}">
  `);

  $('#mh-smart-search-input').on('input', function() {
    const value = this.value;

    // User erased all input, return to original
    if (value === '') {
      doRenderItemBrowserItems(_originalTemplateData);
      return;
    }

    let results = Object.values(componentsByClassification[_currentClassification])
      .reduce((a, item) => {
        const result = fuzzyMatch(value, item.name);
        if (result[0]) {
          a.push([result[1], item]);
        }
        return a;
      }, [])
      .sort((a, b) => b[0] - a[0])
      .reduce((a, resultArr) => {
        a.push({obj: resultArr[1]});
        return a;
      }, []);

    // let results = fuzzysort.go(value, componentsByClassification[_currentClassification], {
    //   ...fuzzyOptions,
    //   keys: ['name']
    // });
    renderItemListing(value, results);
  }).on('keypress', function(e) {
    if (e.which == 13) {
      if ($('.campPage-trap-itemBrowser-item-armButton').length > 0) {
        app.pages.CampPage.armItem($('.campPage-trap-itemBrowser-item-armButton ')[0]);
      }
    }
  });
}


function renderItemListing(searchValue, results) {

  const tagGroups = [results.reduce(function(agg, result) {
    agg.item_ids.push(result.obj.item_id);
    agg.items.push(formatItem(result.obj));
    return agg;
  }, {
    item_ids: [],
    items: [],
    label: `Searching for "${searchValue}"`,
    type: 'search_match'
  })];

  var templateData = {
    tag_groups: tagGroups
  };
  $('.campPage-trap-itemBrowser').prop(
    'className',
    'campPage-trap-itemBrowser ' + _currentClassification
  );
  doRenderItemBrowserItems(templateData);
}

function doRenderItemBrowserItems(templateData) {
  var scrollContainer = $('.campPage-trap-itemBrowser-items');
  scrollContainer.scrollTop(0);
  var tagGroupContainer = $('.campPage-trap-itemBrowser-tagGroupContainer');
  tagGroupContainer.html(
    hg.utils.TemplateUtil.renderFromFile('CampPage', 'tag_groups', templateData)
  );
}

/**
 *
 * @param {User & {components: Component[]}} response
 */
function monitorGetTrapComponents(response) {
  if (!response.components) {
    return;
  }

  const classification = response.components[0].classification;
  componentsByClassification[classification] = response.components;
}

const componentsByClassification = {
  bait: [],
  trinket: [],
  weapon: [],
  base: [],
  skin: [],
};

/**
 * @param {string} pattern
 * @param {any[]} items
 * @param {(arg: any) => string} selector
 */
function fuzzyMatchOn(pattern, items, selector) {
  return items.reduce((a, item) => {
    const result = fuzzyMatch(pattern, selector(item));
    if (result[0]) {
      a.push([result[1], item]);
    }
    return a;
  }, [])
    .sort((/** @type {[Number, any]} */ a, /** @type {[number, any]} */ b) => b[0] - a[0])
    .reduce((/** @type {{ obj: any; }[]} */ a, /** @type {any[]} */ resultArr) => {
      a.push(resultArr[1]);
      return a;
    }, []);
}
