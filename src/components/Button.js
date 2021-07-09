import React from 'react'
import { StyleSheet, Dimensions, PixelRatio } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

const marginVertical = PixelRatio.get() <= 1.5 ? 2 : 10

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
    marginVertical: marginVertical
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 24
  }
})
