import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, } from 'react-native';
import CancelButton from '../../components/CancelButton';
import SubmitButton from '../../components/SubmitButton';
import ForumRecommendedScreen from './ForumRecommendedScreen';


export default class ForumCreationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameText: "Enter a name",
      descriptionText: "Enter a description",
      reasonText: "Give a few reasons why this is different from existing forums",
      HOME_PAGE: 'ForumRecommendedScreen',
    };
  }

  render() {
    const { navigation } = this.props;
    return (
        <SafeAreaView>
          <View style={styles.container}>
              <Text style={styles.title}>
                Create a new Forum
              </Text>
              <Text style={styles.subTitle}>
                Forum Name
              </Text>
              <TextInput
                style={styles.nameInput}
                onChangeText={(nameText) => this.setState({ nameText })}
                value={this.state.nameText}
                multiline={true}
              />
              <Text style={styles.subTitle}>
                Forum Description
              </Text>
              <TextInput
                style={styles.descriptionInput}
                onChangeText={(descriptionText) => this.setState({ descriptionText })}
                value={this.state.descriptionText}
                multiline={true}
              />
              <Text style={styles.subTitle}>
                Reason for new Forum
              </Text>
              <TextInput
                style={styles.reasonInput}
                onChangeText={(reasonText) => this.setState({ reasonText })}
                value={this.state.reasonText}
                multiline={true}
              />
              <View style={styles.buttons}>
                <CancelButton goBack = {() => navigation.navigate(this.state.HOME_PAGE)}/>
                <View style={styles.space} />
                <SubmitButton goBack = {() => navigation.navigate(this.state.HOME_PAGE)} string = {'Create'}/>
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
    borderColor: 'black',
    borderWidth: 1,
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