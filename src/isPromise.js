/**
 * Check if the given object is a Promise.
 *
 * @param  {Object}  obj Object to be checked.
 * @return {Boolean}
 */
export default function isPromise (obj) {
  return !!obj && typeof obj === 'object' && typeof obj.then === 'function'
}
