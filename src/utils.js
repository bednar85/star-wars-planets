/**
 * Search for substring in string.
 *
 * @param {string} substr - the substring that you are trying to find a match for
 * @param {string} str - the full string that you are searching
 * @return {boolean} true if the substring is a full or partial match
 */
export const search = (substr, str) => {
  return str.toLowerCase().includes(substr.toLowerCase());
};

/**
 * Search to see if any of the items of array are in the haystack array.
 *
 * @param {string} needles - the array which has the items you are searching for
 * @param {string} haystack - the array that you are searching in
 * @return {boolean} true any of the items in arr are in the haystack
 */
export const includesAny = (needles, haystack) =>
  needles.some(needle => haystack.includes(needle));

/**
 * Search to see if all of the items of array are in the haystack array.
 *
 * @param {string} needles - the array which has the items you are searching for
 * @param {string} haystack - the array that you are searching in
 * @return {boolean} true all of the items in arr are in the haystack
 */
export const includesOnly = (needles, haystack) =>
  needles.every(needle => haystack.includes(needle));
