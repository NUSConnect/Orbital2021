import React from 'react'
import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function CancelButton({ goBack }) {
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Text style={styles.text}>
        Cancel
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dcdcdc",
    alignItems: 'center',
    height: 50,
    width: 180,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 30,
    lineHeight:50,
    alignItems: 'center',
  },
})