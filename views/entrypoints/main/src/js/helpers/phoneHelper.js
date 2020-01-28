export const extractCallingCode = (callingCode) => {
  const callingCodeArr = callingCode.split('-');
  return {
    countryCode: callingCodeArr[0],
    numb: callingCodeArr[1]
  };
};
