import _ from 'lodash';
import {resolve} from 'path';
import baseConfig from './base.config.js';

/** @type {import('rollup').MergedRollupOptions} */
let config = {
  output: [
    {
      file: resolve('dist/mh-smart-search.user.js'),
      format: 'es',
      name: 'mh-smart-search.user.js'
    }
  ],
};

config = _.merge(baseConfig, config);

export default config;
