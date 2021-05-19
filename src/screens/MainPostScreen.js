import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, } from 'react-native';
import CancelButton from '../components/CancelButton';
import SubmitButton from '../components/SubmitButton';
import HomePostsScreen from './HomePostsScreen';

export default class MainPostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Type something",
      HOME_PAGE: 'HomePostsScreen',
    };
  }

  render() {
    const { navigation } = this.props;
    return (
        <SafeAreaView>
          <View style={styles.container}>
              <Text style={styles.title}>
                Create a Post
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
                multiline={true}
              />
              <View style={styles.buttons}>
                <CancelButton goBack = {() => navigation.navigate(this.state.HOME_PAGE)}/>
                <View style={styles.space} />
                <SubmitButton goBack = {() => navigation.navigate(this.state.HOME_PAGE)} string = {'Post'}/>
              </View>
          </View>
        </SafeAreaView>
    );
  }
};

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
  input: {
    flex: 0,
    height: 500,
    margin: 12,
    borderWidth: 1,
    fontSize: 18,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  space: {
    width:20
  }
});