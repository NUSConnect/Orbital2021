/**
SendPushNotification to users via their pushToken (if available - logic should be handled before calling this function
*/
export const sendPushNotification = (pushToken, sender, message) => {
  const response = fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: pushToken,
      sound: 'default',
      title: 'Portal.io: ' + sender,
      body: message
    })
  })
}
