import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button ({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && {
          backgroundColor: theme.colors.surface
        },
        style
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 9 * Dimensions.get('window').width / 414
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 24
  }
})
