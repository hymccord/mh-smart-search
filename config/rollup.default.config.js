import css from 'rollup-plugin-import-css';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {resolve} from 'path';

/** @type {import('rollup').MergedRollupOptions} */
export default {
  input: 'src/main.js',
  output: [
    {
      file: resolve('dist/main.js'),
      format: 'es',
      name: 'myModule'
    }
  ],
  plugins: [
    css(),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    }),
  ]
};
