// map data from account table in database
// to obj with right props which class User needs
const mapUserData = (userDataFromDB) => {
  const {
    id,
    username,
    password,
    email,
    facebook_id,
    birth,
    phone,
    nicename,
    created_on,
    last_login,
    salt,
  } = userDataFromDB;
  return {
    id,
    uname: username,
    username,
    passwd: password,
    password,
    fbid: facebook_id,
    facebookId: facebook_id,
    email,
    nicename,
    birth,
    phone,
    created_on,
    createdOn: created_on,
    last_login,
    lastLogin: last_login,
    salt,
  };
};

module.exports = {
  mapUserData,
};
