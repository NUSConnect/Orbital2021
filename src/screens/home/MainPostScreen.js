import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TitleWithBack from '../../components/TitleWithBack';
import HomePostsScreen from './HomePostsScreen';
import moment from 'moment';

import {
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostImg,
  Divider
} from '../../styles/FeedStyles';

import * as firebase from 'firebase';

const MainPostScreen = ({navigation, route, onPress}) => {
    const userId = firebase.auth().currentUser.uid;
    const [userData, setUserData] = useState(null);
    const [userLiked, setUserLiked] = useState(null);

    const {item} = route.params;

//    var likeIcon = item.liked ? 'heart' : 'heart-outline';
//    var likeIconColor = item.liked ? '#dc143c' : '#333';
    var likeText;
    var commentText;

    if (item.likes == 1) {
        likeText = '1 Like';
    } else if (item.likes > 1) {
        likeText = item.likes + ' Likes';
    } else {
        likeText = 'Like';
    }

    if (item.comments == 1) {
        commentText = '1 Comment';
    } else if (item.comments > 1) {
        commentText = item.comments + ' Comments';
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

    const likePost = async () => {
        mappedUser =  'usersWhoLiked.' + userId;
        if (userLiked) {
            firebase.firestore().collection('posts').doc(item.postId).update({ mappedUser: false });
            setUserLiked(false);
        } else {
            firebase.firestore().collection('posts').doc(item.postId).update({ mappedUser: true });
            setUserLiked(true);
        }
    }

    useEffect(() => {
        getUser();
        console.log('Item: ' + item.comments);
        console.log('Map: ' + item.usersWhoLiked);
//        bool = item.usersWhoLiked.get(userId, false);

//        if (bool == true) {
//            //user alr liked
//            setUserLiked(true);
//        } else {
//            setUserLiked(false);
//        }
//        likeIcon = userLiked ? 'heart' : 'heart-outline';
//        likeIconColor = userLiked ? '#dc143c' : '#333';
    }, []);

    return (
        <SafeAreaView>
          <View style={styles.container}>
            <TitleWithBack onPress={() => navigation.navigate('HomePostsScreen')}/>

            <View style={styles.postInfo}>
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
                    <UserName>
                      {userData ? userData.name || 'Anonymous User' : 'Anonymous User'}
                    </UserName>
                    <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
                  </UserInfoText>
              </UserInfo>
              <Text style={styles.postText}>
                {item.post}
              </Text>
              {item.postImg != null ? (
                  <Image
                    source={{uri: item.postImg}}
                    style={styles.image}
                    resizeMode='contain'
                  />
              ) : (
                  <Divider />
              )}

              <TouchableOpacity
                active={item.liked}
                onPress={() => (item.liked ? item.liked = false : item.liked = true)}
                style={styles.like}>
                    <Ionicons
                        name={userLiked ? 'heart' : 'heart-outline'}
                        size={40}
                        color={userLiked ? '#dc143c' : '#333'} />
                    <Text style={styles.likeText} active={item.liked}>{likeText}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </SafeAreaView>
    );

};

export default MainPostScreen;

const styles = StyleSheet.create({
  container: {
    flex:0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postInfo: {
    width: '100%',
  },
  postText: {
    width: '100%',
    margin: 12,
    fontSize: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  like: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 16,
    paddingLeft: 10,
  },
});