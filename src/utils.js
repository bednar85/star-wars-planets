/**
 * Search to see if any of the items of array are in the haystack array.
 *
 * @param {array} needles - the array which has the items you are searching for
 * @param {array} haystack - the array that you are searching in
 * @return {boolean} true any of the items in arr are in the haystack
 */
export const includesAny = (needles, haystack) =>
  needles.some(needle => haystack.includes(needle));

/**
 * Search for substring in string.
 *
 * @param {string} substring - the substring that you are trying to find a match for
 * @param {string} string - the full string that you are searching
 * @return {boolean} true if the substring is a full or partial match
 */
export const search = (substring, string) => {
  return string.toLowerCase().includes(substring.toLowerCase());
};
