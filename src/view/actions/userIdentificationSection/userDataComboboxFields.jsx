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

const userAttributes = [
  { id: 'firstName', name: 'First Name' },
  { id: 'lastName', name: 'Last Name' },
  { id: 'companyName', name: 'Company Name' },
  { id: 'title', name: 'Title' },
  { id: 'countryCode', name: 'Country Code' }
];

// Maps legacy user-data ids (from configs saved before a schema/view rename)
// to their current equivalents, so old raw JSON keys normalize correctly
// when the view builds settings and looks up field metadata.
const LEGACY_ID_ALIASES = Object.freeze({
  country: 'countryCode'
});

const userDataIdsMap = userAttributes.reduce((previousValue, currentValue) => {
  previousValue[currentValue.id] = currentValue.name;
  return previousValue;
}, {});

const userDataNamesMap = userAttributes.reduce(
  (previousValue, currentValue) => {
    previousValue[currentValue.name] = currentValue.id;
    return previousValue;
  },
  {}
);
export default {
  getUserDataId: (name) =>
    userDataNamesMap[name] || LEGACY_ID_ALIASES[name] || name,
  getUserDataName: (id) => userDataIdsMap[id] || id,
  getUserDataNames: () =>
    userAttributes.map((userAttribute) => userAttribute.name)
};
