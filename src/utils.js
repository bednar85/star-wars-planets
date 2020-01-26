/**
 * A performant way to check if string includes substring. Via StackOverflow.
 *
 * @param {string} str - the full string that you are searching
 * @param {string} substr - the substring that you are trying to find a match for
 * @return {boolean} true if the substring is a full or partial match
 */
export const search = (str, substr) => {
  return str.toLowerCase().indexOf(substr.toLowerCase()) >= 0;
};

export const findAny = (arr, haystack) =>
  arr.some(v => haystack.indexOf(v) >= 0);
