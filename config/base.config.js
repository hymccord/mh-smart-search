import css from 'rollup-plugin-import-css';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('rollup').MergedRollupOptions} */
export default {
  input: 'src/main.js',
  plugins: [
    css(),
    nodeResolve(),
    commonjs(),
  ]
};
