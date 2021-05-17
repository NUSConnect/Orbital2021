import React from 'react'
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import { theme } from '../core/theme'

export default function PostButton({ style, onPress, ...props }) {
  return (
    <View style={styles.container}>
      <Image style={styles.avatar}
        resizeMode={"cover"}
        source={require('../assets/logo.png')}/>
      <TouchableOpacity
        style={[ style ]}
        onPress={ onPress }>
          <Text style={styles.text}>
            Say Something...
          </Text>
      </TouchableOpacity>
      <Ionicons name="send" color="#aaf0d1" size={38}
        style={styles.icon}
        onPress={ onPress } />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#00203f',
    alignItems: 'center'
  },
  avatar: {
    marginLeft: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop:20,
    marginLeft:10
  },
  icon: {
    marginLeft: 30
  },
})