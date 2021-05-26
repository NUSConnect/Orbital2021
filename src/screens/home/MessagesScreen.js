import React, {useState, useEffect} from 'react';
import { View, Text, Button, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../../styles/MessageStyles';
import * as firebase from 'firebase';

const MessagesScreen = ({navigation}) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [friends, setFriends] = useState([]);

    useEffect(() => {
            const subscriber = firebase.firestore()
              .collection('users')
              .onSnapshot(querySnapshot => {
                const friendsArr = [];
                querySnapshot.forEach(documentSnapshot => {
                console.log(documentSnapshot.id)
                console.log(currentUserId)
                if (documentSnapshot.id !== currentUserId) {
                    friendsArr.push(documentSnapshot.data());
                }
                });
                console.log(friendsArr)
                setFriends(friendsArr);
              });
            return () => subscriber();
          }, []);

    return (
      <Container>
        <FlatList
          data={friends}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Card onPress={() => navigation.navigate('ChatScreen', {name: item.name})}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={item.userImg} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.name}</UserName>
                    <PostTime>{item.messageTime}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.messageText}</MessageText>
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      </Container>
    );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});