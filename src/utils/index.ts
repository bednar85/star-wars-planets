export const unique = (array: (string | number)[]): (string | number)[] =>
  Array.from(new Set(array));

/**
 * Search to see if any of the items of array1 are in array2.
 *
 * @param {array} needles - the array which has the items you are searching for
 * @param {array} haystack - the array that you are searching in
 * @return {boolean} true any of the items in array are in the haystack
 */
export const overlap = (
  needles: (string | number)[],
  haystack: (string | number)[]
): boolean => needles.some(needle => haystack.includes(needle));

/**
 * Search for substring in string.
 *
 * @param {string} substring - the substring that you are trying to find a match for
 * @param {string} string - the full string that you are searching
 * @return {boolean} true if the substring is a full or partial match
 */
export const search = (substring: string, string: string): boolean => {
  return string.toLowerCase().includes(substring.toLowerCase());
};

export const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const delayedMockFetch = (ms: number, value: any): Promise<any> => {
  return new Promise(resolve => setTimeout(resolve, ms, value));
};

export const fetchData = async (
  setDataCallback: (data: any) => void,
  mockData: any
): Promise<void> => {
  // simulate a delay in loading of the data
  const delay = getRandomIntInclusive(1000, 3000);
  const data = await delayedMockFetch(delay, mockData);

  setDataCallback(data);
};

export const toKebabCase = (string: string): string =>
  string
    .toLowerCase()
    .replace(/[^a-zA-Z']/gi, ' ')
    .trim()
    .replace(/\s+/g, '-');
