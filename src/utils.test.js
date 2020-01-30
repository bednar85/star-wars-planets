import { includesAny, includesOnly, search } from 'utils';

const testArray = [1, 2, 3, 4, 5];
const testString = 'A long time ago in a galaxy far, far away....';

it('includesAny works correctly', () => {
  expect(includesAny([1], testArray)).toBeTruthy();
  expect(includesAny([1, 2, 3], testArray)).toBeTruthy();
  expect(includesAny([1, 6], testArray)).toBeTruthy();
  expect(includesAny([6], testArray)).toBeFalsy();
  expect(includesAny([6, 7, 8], testArray)).toBeFalsy();
});

it('includesOnly works correctly', () => {
  expect(includesOnly([1], testArray)).toBeTruthy();
  expect(includesOnly([1, 2, 3], testArray)).toBeTruthy();
  expect(includesOnly([1, 6], testArray)).toBeFalsy();
  expect(includesOnly([6], testArray)).toBeFalsy();
  expect(includesOnly([6, 7, 8], testArray)).toBeFalsy();
});

it('search works correctly', () => {
  expect(search('galaxy', testString)).toBeTruthy();
  expect(search('planet', testString)).toBeFalsy();
});
