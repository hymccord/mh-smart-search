
/**
 * @param {unknown[]} args
 */
export function log(...args) {
  console.log('%c[my-userscript]:', 'color: green; font-weight: bold', ...args);
}
