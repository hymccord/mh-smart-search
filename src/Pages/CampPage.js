
export function formatItem(item) {
  var item = JSON.parse(JSON.stringify(item));
  if (item.classification == 'weapon') {
    item.name = item.name.replace(' Trap', '');
  }
  item.can_arm = app.pages.CampPage.canArmItem(item) ? true : null;
  item.can_disarm = app.pages.CampPage.canDisarmItem(item) ? true : null;
  item.can_buy = app.pages.CampPage.canBuyItem(item) ? true : null;
  item.is_armed = app.pages.CampPage.isArmed(item.item_id) ? true : null;
  item.is_favourite = app.pages.CampPage.isFavoriteItem(item.item_id) ? true : null;
  if (item.classification == 'bait' || item.classification == 'trinket') {
    item.quantity_formatted = numberFormat(item.quantity);
  }
  if (
    (item.classification == 'bait' || item.classification == 'trinket') &&
    item.quantity >= 10000
  ) {
    item.has_large_quantity = true;
  }
  if (item.cheese_effect) {
    item.cheese_effect = item.cheese_effect.replace('Extremely', 'Extrmly.');
    item.cheese_effect = item.cheese_effect.replace('Ultimately', 'Ultim.');
    item.cheese_effect = item.cheese_effect.replace('No Effect', '-');
  }
  switch (item.classification) {
  case 'base':
    item.subtitle = stringTruncate(stripTagsPreserveContent(item.description), 170);
    break;
  case 'weapon':
    item.subtitle = '<b>' + item.power_type_name + ' Type Weapon</b><br />' + stringTruncate(stripTagsPreserveContent(item.description), 140);
    break;
  case 'bait':
    item.short_description = stringTruncate(stripTagsPreserveContent(item.description), 130);
    item.subtitle = stringTruncate(stripTagsPreserveContent(item.description), 40);
    break;
  case 'trinket':
    item.subtitle = stringTruncate(stripTagsPreserveContent(item.description), 40);
    break;
  case 'skin':
    item.short_description = stringTruncate(stripTagsPreserveContent(item.marketing_text), 170);
    item.subtitle = stringTruncate(stripTagsPreserveContent(item.marketing_text), 40);
    break;
  }
  if (
    item.power ||
    item.power_bonus ||
    item.luck ||
    item.attraction_bonus ||
    (item.cheese_effect != '-' && item.cheese_effect)
  ) {
    // var armedItem = getArmedItem(item.classification);
    item.stats = [];
    item.stats.push({
      name: 'Power',
      type: 'power',
      value: item.power ? item.power_formatted : null,
      is_better: null,// item.power > armedItem.power ? true : null,
      is_worse: null,// item.power < armedItem.power ? true : null,
    });
    item.stats.push({
      name: 'Power Bonus',
      type: 'powerBonus',
      value: item.power_bonus ? item.power_bonus_formatted : null,
      is_better: null,// item.power_bonus > armedItem.power_bonus ? true : null,
      is_worse: null,// item.power_bonus < armedItem.power_bonus ? true : null,
    });
    item.stats.push({
      name: 'Luck',
      type: 'luck',
      value: item.luck ? item.luck_formatted : null,
      is_better: null,// item.luck > armedItem.luck ? true : null,
      is_worse: null,// item.luck < armedItem.luck ? true : null,
    });
    item.stats.push({
      name: 'Attraction Bonus',
      type: 'attraction_bonus',
      value: item.attraction_bonus ? item.attraction_bonus_formatted : null,
      is_better: null,// item.attraction_bonus > armedItem.attraction_bonus ? true : null,
      is_worse: null,// item.attraction_bonus < armedItem.attraction_bonus ? true : null,
    });
    var itemCheeseEffectValue = getCheeseEffectValue(item.cheese_effect);
    // var armedCheeseEffectValue = getCheeseEffectValue(armedItem.cheese_effect);
    item.stats.push({
      name: 'Cheese Effect',
      type: 'cheese_effect',
      value: itemCheeseEffectValue != 7 ? item.cheese_effect : 'None',
      is_better: null,// itemCheeseEffectValue > armedCheeseEffectValue ? true : null,
      is_worse: null,// itemCheeseEffectValue < armedCheeseEffectValue ? true : null,
    });
  } else {
    item.has_stats = null;
  }
  return item;
}

function numberFormat(number, decimals, dec_point, thousands_sep) {
  var n = number;
  var c = isNaN((decimals = Math.abs(decimals))) ? 0 : decimals;
  var d = dec_point == undefined ? '.' : dec_point;
  var t = thousands_sep == undefined ? ',' : thousands_sep,
    s = n < 0 ? '-' : '';
  var i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + '',
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  );
}

function stringTruncate(str, length, end) {
  if (!str) return '';
  if (!length) length = 50;
  if (!end) end = '...';
  return str.length > length
    ? $.trim(str.substr(0, length - end.length)) + end
    : str;
}

function stripTagsPreserveContent(string) {
  return string ? string.replace(/<[^>]*>/g, '') : '';
}

function getCheeseEffectValue(textValue) {
  var data = {
    'Uber Fresh': 13,
    'Ultim. Fresh': 12,
    'Insanely Fresh': 11,
    'Extrmly. Fresh': 10,
    'Very Fresh': 9,
    'Fresh': 8,
    'No Effect': 7,
    'Stale': 6,
    'Very Stale': 5,
    'Extrmly. Stale': 4,
    'Insanely Stale': 3,
    'Ultim. Stale': 2,
    'Uber Stale': 1,
  };
  return data[textValue];
}
