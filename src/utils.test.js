import { includesAny, includesOnly, search } from 'utils';

const testArray = [1, 2, 3, 4, 5];
const testString = 'A long time ago in a galaxy far, far away....';

it('includesAny works correctly', () => {
  // works for a single item
  expect(includesAny([1], testArray)).toBeTruthy();
  expect(includesAny([6], testArray)).toBeFalsy();

  // works for a multiple items
  expect(includesAny([1, 2, 3], testArray)).toBeTruthy();
  expect(includesAny([6, 7, 8], testArray)).toBeFalsy();

  // works when one item is the haystack and another isn't
  expect(includesAny([1, 6], testArray)).toBeTruthy();
});

it('includesOnly works correctly', () => {
  // works for a single item
  expect(includesOnly([1], testArray)).toBeTruthy();
  expect(includesOnly([6], testArray)).toBeFalsy();

  // works for a multiple items
  expect(includesOnly([1, 2, 3], testArray)).toBeTruthy();
  expect(includesOnly([6, 7, 8], testArray)).toBeFalsy();

  // works when one item is the haystack and another isn't
  expect(includesOnly([1, 6], testArray)).toBeFalsy();
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
