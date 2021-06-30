import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, LayoutAnimation } from 'react-native'

export default function Collapsible ({ header, children }) {
  const [open, setOpen] = useState(false)

  const  onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpen(!open)
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.item} testID='collapsible'>
        <Text style={styles.text}>{header}</Text>
      {open && (
        <Text> SOME DATA</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 20,
    overflow: 'hidden',
    paddingVertical: 10,
    marginBottom: 5,
    backgroundColor: 'orange',
    color: 'orange'
  },
  text: {
    color: 'black',
    fontSize: 24,
    paddingLeft: 10
  }
})
