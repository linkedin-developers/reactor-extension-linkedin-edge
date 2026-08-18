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

const userDataComboboxFields = require('../userDataComboboxFields').default;

describe('userDataComboboxFields', () => {
  test('maps the "Country Code" display name to the countryCode id', () => {
    expect(userDataComboboxFields.getUserDataId('Country Code')).toBe(
      'countryCode'
    );
  });

  test('aliases the legacy "country" raw JSON key to countryCode', () => {
    expect(userDataComboboxFields.getUserDataId('country')).toBe('countryCode');
  });

  test('leaves unrelated keys unchanged', () => {
    expect(userDataComboboxFields.getUserDataId('firstName')).toBe('firstName');
    expect(userDataComboboxFields.getUserDataId('customField')).toBe(
      'customField'
    );
  });

  test('maps the countryCode id back to the "Country Code" display name', () => {
    expect(userDataComboboxFields.getUserDataName('countryCode')).toBe(
      'Country Code'
    );
  });
});
