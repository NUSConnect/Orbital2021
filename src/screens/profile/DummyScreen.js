import * as React from 'react'
import { View } from 'react-native'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import { formClusters, deletePool } from '../../api/matching'

export default function DummyScreen ({ navigation }) {
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <BackButton goBack={navigation.goBack} />
      <Button onPress={() => formClusters()}> Form clusters </Button>
      <Button onPress={() => deletePool()}> Delete pool </Button>
    </View>
  )
}
