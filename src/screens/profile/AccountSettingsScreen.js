import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import BackButton from '../../components/BackButton';
import Background from '../../components/Background';
import Button from '../../components/Button';
import { logoutUser } from '../../api/auth'

export default function AccountSettingsScreen({ navigation }) {
  return (
    <Background style={styles.bg}>
        <View style={styles.buttonwrap}>
          <Button style={styles.button} title='update' onPress={() => navigation.navigate('DummyScreen')}> Update Email Address </Button>
          <Button style={styles.button} onPress={() => navigation.navigate('DummyScreen')}> Change Password </Button>
          <Button style={styles.button} onPress={() => navigation.navigate('DummyScreen')}> Manage Blocked Accounts </Button>
          <Button style={styles.button} onPress={() => navigation.navigate('DummyScreen')}> Privacy Settings </Button>
          <Button style={styles.button} color='#de1738'onPress={logoutUser}> Logout </Button>
        </View>
    </Background>
  );
}

const styles = {
  button: {
    backgroundColor:'#FFFFFF',
  },
  buttonwrap: {
    backgroundColor: "#FFFFFF",
    height:500,
    alignItems:'center',
  },
}