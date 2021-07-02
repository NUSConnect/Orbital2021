import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Card } from '@paraboly/react-native-card'

const MatchCard = ({ route, item, onPress }) => {
  return (
    <View style={styles.container}>
    <Card
      title={item.success ? 'Success!': 'Sorry!' }
      iconName={item.success ? 'check' : 'cross' }
      iconColor={item.success ? '#90EE90' : '#FF7F7F'}
      iconType='Entypo'
      topRightText='Date'
      bottomRightText={item.success ? item.isGroup ? 'Group' : 'Individual' : ''}
      description={item.success ? 'Match was successful! Tap here to chat...' : 'Match failed, please try again.'}
      onPress={() => console.log('pressed')}
    />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
  }
})

export default MatchCard