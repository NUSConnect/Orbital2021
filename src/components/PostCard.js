import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from 'react-native-vector-icons';

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from '../styles/FeedStyles';

import ProgressiveImage from './ProgressiveImage';

import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as firebase from 'firebase';

const PostCard = ({route, item, onViewProfile, onDelete, onPress, onReport}) => {
  const currentUserId = firebase.auth().currentUser.uid;
  const [userData, setUserData] = useState(null);
  const [userLiked, setUserLiked] = useState(null);
  const [likeNumber, setLikeNumber] = useState(null);

  var commentText;

  if (item.likes == 1) {
    likeText = '1 Like';
  } else if (item.likes > 1) {
    likeText = item.likes + ' Likes';
  } else {
    likeText = 'Like';
  }

  if (item.commentCount == 1) {
    commentText = '1 Comment';
  } else if (item.commentCount > 1) {
    commentText = item.commentCount + ' Comments';
  } else {
    commentText = 'Comment';
  }

  const getUser = async () => {
    await firebase.firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  const checkLiked = async() => {
    await firebase.firestore()
        .collection('posts')
        .doc(item.postId)
        .collection('likes')
        .doc(currentUserId)
        .onSnapshot((snapshot) => {
            if (snapshot.exists) {
                setUserLiked(true);
            } else {
                setUserLiked(false);
            }
        })
  }

  const likePost = async () => {
    console.log('Post ID: ' + item.postId);
    if (userLiked) {
        item.likeCount = item.likeCount - 1;
        firebase.firestore().collection('posts').doc(item.postId).collection('likes').doc(currentUserId).delete();
        firebase.firestore().collection('posts').doc(item.postId).update({ likeCount: item.likeCount });
        console.log('Dislike')
        setLikeNumber(item.likeCount);
        setUserLiked(false);
    } else {
        item.likeCount = item.likeCount + 1;
        firebase.firestore().collection('posts').doc(item.postId).collection('likes').doc(currentUserId).set({});
        firebase.firestore().collection('posts').doc(item.postId).update({ likeCount: item.likeCount });
        console.log('Like')
        setLikeNumber(item.likeCount);
        setUserLiked(true);
    }
  }

  useEffect(() => {
    getUser();
    checkLiked();
    setLikeNumber(item.likeCount);
  }, []);

  return (
    <Card key={item.id}>
      <UserInfo>
        <UserImg
          source={{
            uri: userData
              ? userData.userImg ||
                'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
              : 'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460',
          }}
        />
        <UserInfoText>
          <TouchableOpacity onPress={onViewProfile}>
            <UserName>
              {userData ? userData.name || 'Anonymous User' : 'Anonymous User'}
            </UserName>
          </TouchableOpacity>
          <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
        </UserInfoText>
      </UserInfo>
      <PostText>{item.post}</PostText>
      {/* {item.postImg != null ? <PostImg source={{uri: item.postImg}} /> : <Divider />} */}
      {item.postImg != null ? (
        <ProgressiveImage
          defaultImageSource={require('../assets/default-img.jpg')}
          source={{uri: item.postImg}}
          style={{width: '100%', height: 350}}
          resizeMode="contain"
        />
      ) : (
        <Divider />
      )}

      <InteractionWrapper>
        <Interaction onPress={likePost}>
          <Ionicons
            name={userLiked ? 'heart' : 'heart-outline'}
            size={25}
            color={userLiked ? '#dc143c' : '#333'} />
          <InteractionText>
            {(likeNumber === 0) ? 'Like' : (likeNumber === 1) ? '1 Like' : likeNumber + ' Likes'}
          </InteractionText>
        </Interaction>
        <Interaction onPress={onPress}>
          <Ionicons name="md-chatbubble-outline" size={25} />
          <InteractionText>
            {commentText}
          </InteractionText>
        </Interaction>
        {currentUserId == item.userId ? (
          <Interaction onPress={() => onDelete(item.id)}>
            <Ionicons name="md-trash-bin" size={25} />
          </Interaction>
        ) : (
          <Interaction onPress={() => onReport(item.id)}>
            <MaterialIcons name="report-problem" size={25} />
          </Interaction>
        )}
      </InteractionWrapper>
    </Card>
  );
};

export default PostCard;
