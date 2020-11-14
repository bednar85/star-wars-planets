import { overlap, search } from 'utils';

const testArray = [1, 2, 3, 4, 5];
const testString = 'A long time ago in a galaxy far, far away....';

it('overlap works correctly', () => {
  // works for a single item
  expect(overlap([1], testArray)).toBeTruthy();
  expect(overlap([6], testArray)).toBeFalsy();

  // works for a multiple items
  expect(overlap([1, 2, 3], testArray)).toBeTruthy();
  expect(overlap([6, 7, 8], testArray)).toBeFalsy();

  // works when one item is the haystack and another isn't
  expect(overlap([1, 6], testArray)).toBeTruthy();
});

it('search works correctly', () => {
  // Lower Case
  expect(search('galaxy', testString)).toBeTruthy();
  expect(search('planet', testString)).toBeFalsy();

  // Title Case
  expect(search('Galaxy', testString)).toBeTruthy();
  expect(search('Planet', testString)).toBeFalsy();

  // Upper Case
  expect(search('GALAXY', testString)).toBeTruthy();
  expect(search('PLANET', testString)).toBeFalsy();

  // Studly Caps
  expect(search('GaLaXy', testString)).toBeTruthy();
  expect(search('PlAnEt', testString)).toBeFalsy();
});
