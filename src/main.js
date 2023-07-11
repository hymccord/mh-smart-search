import { formatItem } from './Pages/CampPage.js';
import './comment';
import style from './style.css';
import { log } from './util/logging.js';
import { addStyles, onAjaxRequest } from './util/mouseplace.js';
import fuzzysort from 'fuzzysort';

const fuzzyOptions = {
  limit: 100,
  threshold: -10000,
};
let _currentClassification;
log('loaded!');

addStyle();
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
  const logFunction = {
    apply: async function(target, thisArg, argArray) {
      addSmartSearchBar(argArray[0]);
      // log(target, thisArg, argArray);
      return Reflect.apply(target, thisArg, argArray);
    }
  };

  app.pages.CampPage.toggleItemBrowser = new Proxy(app.pages.CampPage.toggleItemBrowser, logFunction);

  // app.pages.CampPage.toggleItemBrowser = smartSearchToggleItemBroswer(app.pages.CampPage.toggleItemBrowser);
}

function addSmartSearchBar(itemClassification) {
  const $container = $('.campPage-trap-itemBrowser-itemContainer');

  _currentClassification = itemClassification;
  if ($('#mh-smart-search-input', $container).length > 0) {
    return;
  }

  $container.prepend(`
  <div class="mh-smart-search-filter"><input id="mh-smart-search-input" type="text" placeholder="${'Smart Search: '}" >
  `);

  $('#mh-smart-search-input').on('input', function() {
    let results = fuzzysort.go(this.value, componentsByClassification[_currentClassification], {
      ...fuzzyOptions,
      keys: ['name']
    });

    renderItemListing(this.value, results);
  });
}

/**
 * @param {Fuzzysort.KeysResults<any>} results
 */
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
