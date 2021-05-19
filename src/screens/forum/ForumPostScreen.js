import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, } from 'react-native';
import CancelButton from '../../components/CancelButton';
import SubmitButton from '../../components/SubmitButton';
import ForumRecommendedScreen from './ForumRecommendedScreen';

// Not used yet

export default class ForumPostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Type something",
      HOME_PAGE: 'ForumRecommendedScreen',
    };
  }

  render() {
    const { navigation } = this.props;
    return (
        <SafeAreaView>
          <View style={styles.container}>
              <Text style={styles.title}>
                -Create a Post
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
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
    backgroundColor: '#00203f',
    color: '#aaf0d1',
    fontSize: 30,
    marginLeft: 0
  },
  input: {
    flex: 0,
    height: 500,
    margin: 12,
    borderWidth: 1,
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