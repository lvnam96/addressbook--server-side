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
  return {
    id,
    uname: username,
    passwd: password,
    fbId: facebook_id,
    email,
    nicename,
    birth,
    phone,
    createdOn: new Date(created_on), // because it is a timestamp, not a DATE type
    salt,
    meta: {
      lastActivatedCbookId: last_activated_cbook_id,
      lastLogin: new Date(last_login),
      isActive: is_active,
    },
    cbooks,
  };
};

const mapCbookData = (data) => {
  return {
    ...data,
    contacts: [],
    accId: data.acc_id,
  };
};

const mapContactData = (data) => {
  return {
    ...data,
    accId: data.acc_id,
    cbookId: data.cbook_id,
    labels: JSON.parse(data.labels),
    avatarURL: data.avatar_url,
  };
};

const mapUserMetaData = (data) => {
  return {
    ...data,
    accId: data.acc_id,
    lastActivatedCbookId: data.last_activated_cbook_id,
    lastLogin: data.last_login,
    isActive: data.is_active,
  };
};

const mapUserCbookRela = (data) => {
  return {
    ...data,
    accId: data.acc_id,
    cbookId: data.cbook_id,
  };
};

const formatIdsList = (ids, isResultString = false) => {
  const formattedArr = ids.map((id) => "'" + id + "'");
  return isResultString ? formattedArr.join(',') : formattedArr;
};

module.exports = {
  mapUserData,
  mapCbookData,
  mapContactData,
  mapUserMetaData,
  mapUserCbookRela,
  formatIdsList,
};
