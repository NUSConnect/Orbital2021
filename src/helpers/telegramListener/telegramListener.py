import configparser
import json
import time
from telethon.errors import SessionPasswordNeededError
from telethon import TelegramClient, events, sync
from telethon.tl.functions.messages import (GetHistoryRequest)
from telethon.tl.types import (
PeerChannel
)
import firebase_admin
from firebase_admin import credentials, firestore

# Firebase setup
cred = credentials.Certificate("../../../keys/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Telegram Auth
telegramKeys = open("../../../keys/telegramKeys.json")
data = json.load(telegramKeys)

api_id = data['api_id']
api_hash = data['api_hash']

# Here you define the target channel that you want to listen to:
user_input_channel = data['input_channel']

# Not sure if 'anon' is the correct here
client = TelegramClient('anon', api_id, api_hash)

# Listen to messages from target channel
@client.on(events.NewMessage(chats=user_input_channel))
async def newMessageListener(event):
    # Get message text
    newMessage = event.message.message

    print(newMessage)

    postID = 'NUSSUOfficialChannel' + str(int(time.time() * 1000))
    db.collection('posts').document('NUSSUOfficialChannel').collection('userPosts').document(postID).set({
        'userId': 'NUSSUOfficialChannel',
        'postId': postID,
        'post': newMessage,
        'postImg': None,
        'postTime': firestore.SERVER_TIMESTAMP,
        'likeCount': 0,
        'commentCount': 0
    })
#     await client.forward_messages(entity='me', messages=event.message)

with client:
    client.run_until_disconnected()