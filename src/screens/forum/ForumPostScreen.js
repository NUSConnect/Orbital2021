import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CancelButton from '../../components/CancelButton';
import SubmitButton from '../../components/SubmitButton';
import ForumRecommendedScreen from './ForumRecommendedScreen';

// Not used yet

const ForumPostScreen = ({navigation, route, onPress}) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('');

    const { forumId } = route.params;

    return (
      <KeyboardAwareScrollView style={styles.container}>
          <Text style={styles.title}>
            Create a Forum Post
          </Text>
          <Text style={styles.subTitle}>
            Post Title
          </Text>
          <TextInput
            style={styles.inputTitle}
            returnKeyType="next"
            onChangeText={(title) => setTitle(title)}
            value={title}
            placeholder="Post title"
          />
          <Text style={styles.subTitle}>
            Post Body
          </Text>
          <TextInput
            style={styles.inputBody}
            onChangeText={(text) => setText(text)}
            value={text}
            multiline={true}
            placeholder="Post body"
          />
          <View style={styles.buttons}>
            <CancelButton goBack = {() => navigation.goBack()}/>
            <View style={styles.space} />
            <SubmitButton goBack = {() => navigation.goBack()} string = {'Post'}/>
          </View>
      </KeyboardAwareScrollView>
    );
};

export default ForumPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    height: 60,
    lineHeight: 60,
    width: '100%',
    backgroundColor: '#ff8c00',
    color: '#ffffff',
    fontSize: 30,
    paddingLeft: 15,
  },
  subTitle: {
    fontSize: 16,
    color: "#000000",
    paddingTop: 10,
    paddingLeft: 20,
  },
  inputTitle: {
    flex: 0,
    height: 40,
    margin: 12,
    borderWidth: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  inputBody: {
    flex: 0,
    height: 440,
    margin: 12,
    borderWidth: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  space: {
    width:20
  },
});