import React from 'react';
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

const Messages = [
  {
    id: '1',
    userName: 'A',
    messageTime: '4 mins ago',
    messageText:
      'test'
  },
  {
    id: '2',
    userName: 'B',
    messageTime: '2 hours ago',
    messageText:
      'test'
  },
  {
    id: '3',
    userName: 'C',
    messageTime: '1 hours ago',
    messageText:
      'test'
  },
  {
    id: '4',
    userName: 'D',
    messageTime: '1 day ago',
    messageText:
      'test',
  },
];

const MessagesScreen = ({navigation}) => {
    return (
      <Container>
        <FlatList
          data={Messages}
          keyExtractor={item=>item.id}
          renderItem={({item}) => (
            <Card onPress={() => navigation.navigate('ChatScreen')}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={item.userImg} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.userName}</UserName>
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