import * as React from 'react'
import { Text, View } from 'react-native'
import BackButton from '../../components/BackButton'
import { getClusters } from '../../api/kMeans'

export default function DummyScreen ({ navigation }) {
  const data = [[1, 2, 1, 2], [3, 4, 3, 4], [10, 11, 10, 11], [12, 13, 12, 13]]
  const clusters = getClusters(data)
  console.log(clusters[0])
  console.log(clusters[1])
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <BackButton goBack={navigation.goBack} />
      <Text>Work In Progress</Text>
    </View>
  )
}
