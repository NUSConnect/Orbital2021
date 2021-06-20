/**
SendPushNotification to users via their pushToken (if available - logic should be handled before calling this function
*/
export const textChecker = (text) => {
  console.log(text)
  return text != null ? (text !== '' && text.trim() !== '') : false
}
