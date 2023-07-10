import './comment';
import style from './style.css';
import { log } from './util/logging';
import { addStyles, onAjaxRequest, onPageChange } from './util/mouseplace';
import fuzzysort from 'fuzzysort';

log('loaded!');

addStyle();
// onAjaxRequest(monitorGetTrapComponents)

onPageChange({
  blueprint: {
    show: () => addSmartSearchBar() ,
  }
});

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

function addSmartSearchBar() {
  const $container = $('.campPage-trap-itemBrowser-itemContainer');

  if ($('#mh-smart-search-input', $container).length > 0) {
    return;
  }

  $container.prepend(`
  <div class="mh-smart-search-filter"><input id="mh-smart-search-input" type="text" placeholder="${'Smart Search: '}" >
  `);

  $('#mh-smart-search-input').on('keyup', () => {
    log('keyup');
  });
}
