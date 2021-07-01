import * as React from 'react'
import { Text, View } from 'react-native'
import BackButton from '../../components/BackButton'
import { formClusters } from '../../api/matching'

export default function DummyScreen ({ navigation }) {
  formClusters()
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <BackButton goBack={navigation.goBack} />
      <Text>Work In Progress</Text>
    </View>
  )
}
