import _ from 'lodash';
import {resolve} from 'path';
import baseConfig from './base.config.js';

/** @type {import('rollup').MergedRollupOptions} */
let config = {
  output: [
    {
      file: resolve('dist/main.js'),
      format: 'es',
    }
  ],
};

config = _.merge(baseConfig, config);

export default config;
