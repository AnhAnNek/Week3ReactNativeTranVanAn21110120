import Realm from 'realm';

const LOGIN_RESPONSE_SCHEMA = 'LoginResponse';

const LoginResponseSchema = {
  name: LOGIN_RESPONSE_SCHEMA,
  properties: {
    tokenStr: 'string',
  },
};

const realm = new Realm({ schema: [LoginResponseSchema] });

export const isLoggedIn = () => {
  const loginResponse = realm.objects(LOGIN_RESPONSE_SCHEMA);
  console.log(`isLoggedIn() method: ${loginResponse.length > 0}`);
  return loginResponse.length > 0;
};

export const saveLoginResponse = (loginResponse) => {
  realm.write(() => {
    const existingResponse = realm.objects(LOGIN_RESPONSE_SCHEMA);
    realm.delete(existingResponse);
    realm.create(LOGIN_RESPONSE_SCHEMA, {
      tokenStr: loginResponse.tokenStr,
    });
  });
};

export const removeLoginResponse = () => {
  realm.write(() => {
    const loginResponse = realm.objects(LOGIN_RESPONSE_SCHEMA);
    realm.delete(loginResponse);
  });
};

export const getToken = () => {
  if (!isLoggedIn()) {
    return null;
  }

  const loginResponse = realm.objects(LOGIN_RESPONSE_SCHEMA)[0];
  return loginResponse ? loginResponse.tokenStr : null;
};
