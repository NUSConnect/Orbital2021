import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, Alert, } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CancelButton from '../../components/CancelButton';
import SubmitButton from '../../components/SubmitButton';

export default class ForumCreationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameText: "",
      descriptionText: "",
      reasonText: "",
    };
  }

  handleSubmit = (goBack) => {
      Alert.alert(
        'Submit request for creation of forum',
        'Are you sure? (This is a dummy creation, nothing will be created)',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed!'),
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => goBack(),
          },
        ],
        {cancelable: false},
      );
  }
  render() {
    const { navigation } = this.props;
    return (
      <KeyboardAwareScrollView
        style={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
          <Text style={styles.title}>
            Create a new Forum
          </Text>
          <Text style={styles.subTitle}>
            Forum Name
          </Text>
          <TextInput
            style={styles.nameInput}
            returnKeyType="next"
            onChangeText={(nameText) => this.setState({ nameText })}
            value={this.state.nameText}
            placeholder='Enter a name'
          />
          <Text style={styles.subTitle}>
            Forum Description
          </Text>
          <TextInput
            style={styles.descriptionInput}
            onChangeText={(descriptionText) => this.setState({ descriptionText })}
            value={this.state.descriptionText}
            placeholder='Enter a description'
            multiline={true}
          />
          <Text style={styles.subTitle}>
            Reason for new Forum
          </Text>
          <TextInput
            style={styles.reasonInput}
            onChangeText={(reasonText) => this.setState({ reasonText })}
            value={this.state.reasonText}
            placeholder='Give a few reasons why this is different from existing forums'
            multiline={true}
          />
          <View style={styles.buttons}>
            <CancelButton goBack = {() => navigation.goBack()}/>
            <View style={styles.space} />
            <SubmitButton goBack = {() => this.handleSubmit(() => navigation.goBack())} string = {'Create'}/>
          </View>
      </KeyboardAwareScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
  nameInput: {
    flex: 0,
    height: 40,
    margin: 12,
    borderWidth: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  descriptionInput: {
    flex: 0,
    height: 80,
    margin: 12,
    borderWidth: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  reasonInput: {
    flex: 0,
    height: 200,
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
    marginTop: 30,
  },
  space: {
    width:20
  }
});