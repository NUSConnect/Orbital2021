import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Card } from 'react-native-shadow-cards'

const MatchCard = ({ navigation, route, item, onPress }) => {
  const color = item.success ? '#90EE90' : '#FF7F7F'

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log('pressed')}>
        <Card style={{ padding: 10, margin: 10, backgroundColor: color }}>
          <Text> {item.success ? 'Success!' : 'Sorry!'} </Text>
          <Text> {item.success ? 'Match was successful! Tap here to chat...' : 'Match failed, better luck next time!'} </Text>
        </Card>
      </TouchableOpacity>
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
