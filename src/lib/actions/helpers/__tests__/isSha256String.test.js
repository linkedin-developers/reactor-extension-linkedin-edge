/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const isSha256String = require('../isSha256String');

describe('isSha256String', () => {
  test('returns true for a valid 64-character lowercase hex string', () => {
    expect(isSha256String('a'.repeat(64))).toBe(true);
  });

  test('returns true for a valid 64-character mixed-case hex string', () => {
    expect(isSha256String(`${'A1b2'.repeat(16)}`)).toBe(true);
  });

  test('returns false for a 64-character string containing non-hex letters', () => {
    expect(isSha256String('g'.repeat(64))).toBe(false);
  });

  test('returns false for strings of the wrong length', () => {
    expect(isSha256String('a'.repeat(63))).toBe(false);
    expect(isSha256String('a'.repeat(65))).toBe(false);
  });

  test('returns false for non-string input', () => {
    expect(isSha256String(null)).toBe(false);
    expect(isSha256String(undefined)).toBe(false);
    expect(isSha256String(12345)).toBe(false);
  });
});
