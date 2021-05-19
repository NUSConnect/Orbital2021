import React from 'react'
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import { theme } from '../core/theme'

export default function PostButton({ style, onPress, ...props }) {
  return (
     <TouchableOpacity
        style={styles.button}
        activeOpacity={ 0.4 }
        onPress={ onPress }>
          <Image style={styles.avatar}
            resizeMode={"cover"}
            source={require('../assets/logo.png')}/>
          <Text style={styles.text}>
            Say Something...
          </Text>
          <Ionicons name="send" color="#ffa500" size={38}
            style={styles.icon} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 100,
    flexDirection: 'row',
    backgroundColor: '#a9a9a9',
    paddingTop: 10,
    borderColor: 'black'
  },
  avatar: {
    marginLeft: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'black',
    borderWidth: 1,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 30,
    marginLeft:10,
    paddingTop: 18,
  },
  icon: {
    marginLeft: 30,
    paddingTop: 18,
  },
})