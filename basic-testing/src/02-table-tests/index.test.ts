// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 1, action: Action.Subtract, expected: 1 },
  { a: 2, b: 2, action: Action.Multiply, expected: 4 },
  { a: 4, b: 2, action: Action.Divide, expected: 2 },
  { a: 3, b: 3, action: Action.Exponentiate, expected: 27 },
  { a: 2, b: 1, action: 'not action', expected: null },
  { a: 2, b: '1', action: Action.Exponentiate, expected: null },
];

describe('simpleCalculator', () => {
  // This test case is just to run this test suite, remove it when you write your own tests
  
  test.each(testCases)('should blah-blah', (val) => {
    expect(simpleCalculator(val)).toBe(val.expected);
  });

});
