import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Background from '../../components/Background'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import { formClusters, deletePool } from '../../api/matching'

export default function MatchMeControlScreen ({ navigation }) {
  const days = ['Sun ', 'Mon ', 'Tues ', 'Wed ', 'Thurs ', 'Fri ', 'Sat ']
  const [currentTime, setCurrentTime] = useState(null)
  const [date, setDate] = useState(null)

  useEffect(() => {
    let isMounted = true
    setInterval(() => {
      if (isMounted) {
        setCurrentTime(days[new Date().getDay()] + (new Date().toLocaleTimeString()))
        setDate(new Date().toLocaleDateString())
      }
    }, 1000)

    return () => { isMounted = false }
  }, [])

  return (
    <Background style={styles.bg}>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.buttonwrap}>
        <Text style={styles.reminderText}>
          Clusters should be formed every Monday from 11 a.m. to 12 noon
        </Text>
        <Text style={styles.reminderText2}>
          Current Time:
        </Text>
        <Text style={styles.clock}>
          {currentTime}
        </Text>
        <Text style={styles.date}>
          {date}
        </Text>
        <Button onPress={() => formClusters()}>
          <Text style={styles.buttonText}> Form clusters </Text>
        </Button>
        <Button onPress={() => deletePool()} color='#de1738'>
          <Text style={styles.buttonText}> Delete pool </Text>
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    width: '100%'
  },
  buttonwrap: {
    backgroundColor: '#FFFFFF',
    height: 500,
    alignItems: 'center'
  },
  reminderText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  },
  reminderText2: {
    fontSize: 18,
    marginBottom: 20
  },
  clock: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10
  },
  date: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: 'blue'
  },
  buttonText: {
    fontSize: 18
  }
})
