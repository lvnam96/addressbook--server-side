/* eslint-disable camelcase */
// map data from account table in database
// to obj with right props which class User needs
const mapUserData = ({
  id,
  username,
  password,
  email,
  facebook_id,
  birth,
  phone,
  nicename,
  created_on,
  salt,
  cbooks,
  last_activated_cbook_id,
  last_login,
  is_active,
}) => {
  // const {
  //   id,
  //   username,
  //   password,
  //   email,
  //   facebook_id,
  //   birth,
  //   phone,
  //   nicename,
  //   created_on,
  //   salt,
  //   cbooks,
  //   last_activated_cbook_id,
  //   last_login,
  //   is_active,
  // } = userDataFromDB;
  return {
    id,
    uname: username,
    passwd: password,
    fbId: facebook_id,
    email,
    nicename,
    birth,
    phone,
    createdOn: created_on,
    salt,
    meta: {
      lastActivatedCbookId: last_activated_cbook_id,
      lastLogin: last_login,
      isActive: is_active,
    },
    cbooks,
  };
};

const formatIdsList = (ids, isResultString = false) => {
  const formattedArr = ids.map((id) => "'" + id + "'");
  return isResultString ? formattedArr.join(',') : formattedArr;
};

module.exports = {
  mapUserData,
  formatIdsList,
};
