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

const { emailNormalizer } = require('./helpers/normalizers');

/* eslint-disable camelcase */

// Maps legacy user_data field names (from configs saved before a schema/view
// rename) to their current equivalents so older action settings keep working.
const LEGACY_USER_DATA_FIELD_MAP = Object.freeze({
  country: 'countryCode'
});

const migrateLegacyUserData = (userData) => {
  if (!userData) {
    return userData;
  }

  const migrated = { ...userData };
  Object.entries(LEGACY_USER_DATA_FIELD_MAP).forEach(
    ([legacyKey, currentKey]) => {
      if (Object.prototype.hasOwnProperty.call(migrated, legacyKey)) {
        if (!Object.prototype.hasOwnProperty.call(migrated, currentKey)) {
          migrated[currentKey] = migrated[legacyKey];
        }
        delete migrated[legacyKey];
      }
    }
  );
  return migrated;
};

const buildFetchObject = async ({
  settings: { event, user_identification, user_data },
  authentication: { accessToken },
  version,
  method
}) => {
  const normalizers = [['sha256_email', emailNormalizer]];

  for await (const [field, normalizer] of normalizers) {
    if (user_identification[field]) {
      user_identification[field] = await normalizer(user_identification[field]);
    }
  }

  event.user = {};
  event.user.userIds = Object.keys(user_identification).map((k) => ({
    idType: k.toUpperCase(),
    idValue: user_identification[k]
  }));
  event.user.userInfo = migrateLegacyUserData(user_data);

  if (Number(event.conversion) > 0) {
    event.conversion = `urn:lla:llaPartnerConversion:${event.conversion}`;
  }

  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      'LinkedIn-Version': version,
      'X-Restli-Protocol-Version': '2.0.0',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(event)
  };
};

module.exports = async ({ utils }) => {
  const { getExtensionSettings, getSettings, fetch } = utils;
  const extensionSettings = getExtensionSettings() || {};
  let authentication = extensionSettings.authentication || {};
  const { authentication: settingsAuth, ...settings } = getSettings() || {};
  if (settingsAuth) {
    authentication = settingsAuth;
  }

  if (!authentication.accessToken) {
    throw new Error(
      'LinkedIn access token is required. Create an access token by configuring a Secret ' +
        'in Event Forwarding with the LinkedIn OAuth 2 type, then reference it in the ' +
        'extension or action settings.'
    );
  }

  if (!settings.user_identification || !settings.event) {
    throw new Error(
      'LinkedIn conversion settings are missing required fields. Configure at least one ' +
        'user identifier and the conversion event details in the action settings.'
    );
  }

  const url = 'https://api.linkedin.com/rest/conversionEvents';
  const method = 'POST';
  const version = '202605';

  return fetch(
    url,
    await buildFetchObject({
      method,
      settings,
      authentication,
      version
    })
  );
};
