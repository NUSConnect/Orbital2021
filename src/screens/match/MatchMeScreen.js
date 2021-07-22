import * as firebase from 'firebase'
import React, { useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native'
import GroupCreationTopTab from '../../components/GroupCreationTopTab'
import Collapsible from '../../components/Collapsible'

export default function MatchMeScreen ({ props, route, navigation }) {
  const currentUserId = firebase.auth().currentUser.uid
  const [sports, setSports] = useState([])
  const [arts, setArts] = useState([])
  const [leisure, setLeisure] = useState([])
  const [common, setCommon] = useState([])
  const [numSelected, setNumSelected] = useState(0)

  const SPORTS = ['Basketball', 'Soccer', 'Frisbee', 'Volleyball', 'Badminton', 'Tennis', 'Rugby', 'Archery']
  const ARTS = ['Drawing', 'Painting', 'Piano', 'Concerts', 'Opera', 'K-Pop', 'Dancing']
  const LEISURE = ['Photography', 'Netflix', 'Movies', 'Anime', 'K-Drama', 'Bowling', 'Darts', 'Swimming', 'Diving']
  const COMMONS = ['Eat', 'Sleep', 'Drink', 'Nothing']

  const selectItem = (list, setList) => {
    return (checked, item) => {
      if (checked) {
        setList(list.filter(thing => thing !== item))
        setNumSelected(numSelected - 1)
      } else {
        setList(oldArray => [...oldArray, item])
        setNumSelected(numSelected + 1)
      }
    }
  }

  const submitVector = () => {
    const sportsScore = sports.length / SPORTS.length
    const artsScore = arts.length / ARTS.length
    const leisureScore = leisure.length / LEISURE.length
    const commonScore = common.length / COMMONS.length
    const vector = [sportsScore, artsScore, leisureScore, commonScore]
    if (numSelected === 0) {
      Alert.alert(
        'Cannot match with 0 interests selected!',
        'Select a few interests to join the matching pool.'
      )
    } else {
      firebase.firestore().collection('matchingPool').doc(currentUserId).set({ vector: vector })
        .then(() => {
          Alert.alert(
            'Added to our matching pool successfully!',
            'You will know the results of this matching by Monday 12 noon.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack()
              }
            ],
            { cancelable: false }
          )
        })
    }
  }

  return (
    <ScrollView style={styles.container}>
      <GroupCreationTopTab
        text='Match Me!'
        onBack={() => navigation.goBack()} onPress={() => submitVector()}
      />
      <Collapsible
        header='Sports'
        data={SPORTS}
        items={sports}
        setItems={setSports}
        selectItem={selectItem}
      />
      <Collapsible
        header='Arts'
        data={ARTS}
        items={arts}
        setItems={setArts}
        selectItem={selectItem}
      />
      <Collapsible
        header='Leisure'
        data={LEISURE}
        items={leisure}
        setItems={setLeisure}
        selectItem={selectItem}
      />
      <Collapsible
        header='Other common interests'
        data={COMMONS}
        items={common}
        setItems={setCommon}
        selectItem={selectItem}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  header: {
    fontSize: 20,
    color: 'darkorange',
    paddingLeft: 10
  },
  collapsible: {
    backgroundColor: 'darkorange'
  },
  collapsibleTitle: {
    color: 'darkorange'
  },
  list: {
    marginBottom: -100
  }
})
