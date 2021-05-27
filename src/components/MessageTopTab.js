import React from 'react'
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from '../core/theme'

export default function MessageTopTab({ style, ...props }) {
  return (
     <View style={styles.container}>
       <Text style={styles.text}>
         Messages
       </Text>
     </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    width: '85%',
    color: '#ff7f50',
    fontFamily: 'notoserif',
    fontSize: 30,
    textAlign: 'center',
    paddingLeft: 0,
  },
  icon: {
  },
})