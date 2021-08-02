import * as firebase from 'firebase'
import { getClusters } from './kMeans'
import { sendPushNotification } from './notifications'
import { Alert } from 'react-native'

export const splitCluster = (cluster) => {
  console.log('Splitting...')
  const mean = cluster.mean
  const clusterData = cluster.data

  const firstHalf = clusterData.splice(clusterData.length / 2)
  const result = [{ data: firstHalf, mean: mean }, { data: clusterData, mean: mean }]

  return result.flatMap(x => splitHelper(x))
}

export const splitHelper = (cluster) => {
  if (cluster.data.length <= 5) {
    return [cluster]
  } else {
    const clusterMean = cluster.mean
    const clusterData = cluster.data

    const firstHalf = clusterData.splice(clusterData.length / 2)
    const result = [{ data: firstHalf, mean: clusterMean }, { data: clusterData, mean: clusterMean }]

    return result.flatMap(x => splitHelper(x))
  }
}

export async function formClusters () {
  const data = []
  console.log('Start pulling')

  await firebase
    .firestore()
    .collection('matchingPool')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        const { vector } = documentSnapshot.data()
        data.push({
          userId: documentSnapshot.id,
          vector: vector
        })
        console.log(documentSnapshot.id)
      })
    })

  console.log('Pulling done')

  console.log('New Test: # points = ', data.length)

  const clusters = getClusters(data)
  console.log(clusters)

  const flattenHelper = (clusters, k) => {
    console.log('Flatten: ', clusters)
    if (clusters.length === 0) {
      return []
    } else if (k > 9) {
      return clusters
    } else {
      const newClusters = clusters.flatMap(cluster => getClusters(cluster.data))
      const acceptableClusters = newClusters.filter(cluster => cluster.data.length <= 5)
      const incorrectClusters = newClusters.filter(cluster => cluster.data.length > 5)

      return acceptableClusters.concat(flattenHelper(incorrectClusters, k + 1))
    }
  }

  const flattenClusters = (clusters) => {
    const acceptableClusters = clusters.filter(cluster => cluster.data.length <= 5)
    const incorrectClusters = clusters.filter(cluster => cluster.data.length > 5)

    const correctedClusters = flattenHelper(incorrectClusters, 0)
    return acceptableClusters.concat(correctedClusters)
  }

  const flattenedClusters = flattenClusters(clusters)

  const preprocessedClusters = flattenedClusters.filter(cluster => cluster.data.length > 1)

  const processedClusters = preprocessedClusters.flatMap(cluster => cluster.data.length > 5 ? splitCluster(cluster) : [cluster])

  const rejectedClusters = flattenedClusters.filter(cluster => cluster.data.length === 1)

  console.log('Rejected', rejectedClusters)

  const matchingId = Date.now().toString()
  const completionTime = new Date()

  console.log('Time: ', completionTime)
  for (let i = 0; i < processedClusters.length; i++) {
    // Form group (if size >3) and send notification
    const cluster = processedClusters[i].data
    const userIds = cluster.map(x => x.userId)

    if (cluster.length > 2) {
      const threadId = 'MatchMe' + concatList(userIds) + matchingId
      const groupName = 'MatchMe ' + completionTime.toLocaleDateString()

      createGroupChat('MatchMe', threadId, groupName, userIds, completionTime.toLocaleDateString())

      for (let k = 0; k < userIds.length; k++) {
        const userId = userIds[k]

        firebase.firestore().collection('users').doc(userId).collection('openChats').doc(threadId).set({})

        firebase.firestore().collection('users').doc(userId).collection('matchHistory').doc(matchingId)
          .set({
            success: true,
            timeMatched: firebase.firestore.Timestamp.fromDate(completionTime),
            users: userIds,
            isGroup: true,
            groupChatThread: threadId
          })

        firebase.firestore().collection('users').doc(userId).get()
          .then((doc) => {
            console.log('Checking if pushToken available')
            if (doc.data().pushToken != null) {
              sendPushNotification(doc.data().pushToken.data, 'Matching Successful',
                'Check your matching results under your profile page now!')
            }
          })
      }
    } else {
      for (let k = 0; k < userIds.length; k++) {
        const userId = userIds[k]

        firebase.firestore().collection('users').doc(userId).collection('matchHistory').doc(matchingId)
          .set({
            success: true,
            timeMatched: firebase.firestore.Timestamp.fromDate(completionTime),
            users: userIds,
            isGroup: false
          })

        firebase.firestore().collection('users').doc(userId).get()
          .then((doc) => {
            console.log('Checking if pushToken available')
            if (doc.data().pushToken != null) {
              sendPushNotification(doc.data().pushToken.data, 'Matching Successful',
                'Check your matching results under your profile page now!')
            }
          })
      }
    }
  }

  for (let i = 0; i < rejectedClusters.length; i++) {
    // Send them notification that matching failed, alert opens the next time they open the app
    const cluster = rejectedClusters[i].data
    const userId = cluster[0].userId

    firebase.firestore().collection('users').doc(userId).collection('matchHistory').doc(matchingId)
      .set({ success: false, timeMatched: firebase.firestore.Timestamp.fromDate(completionTime) })

    firebase.firestore().collection('users').doc(userId).get()
      .then((doc) => {
        console.log('Checking if pushToken available')
        if (doc.data().pushToken != null) {
          sendPushNotification(doc.data().pushToken.data, 'Matching Failed',
            'We are sad to inform you that we are unable to match you this time :(')
        }
      })
  }
  Alert.alert('Clustering done!', 'Clustering has been executed.')
}

export async function deletePool () {
  console.log('Deleting pool')
  await firebase
    .firestore()
    .collection('matchingPool')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        documentSnapshot.ref.delete()
      })
    })
  Alert.alert('Pool deleted!', 'Matching pool has been deleted.')
}

export async function createGroupChat (category, threadId, groupName, users, date) {
  const initialMessage = category + ' group created'
  const description = 'Group formed on ' + date + ' from Find-a-Group: ' + category + ' services.'
  const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/forum%2FWELCOME.png?alt=media&token=eb0f815b-0e18-4eca-b5a6-0cc170b0eb51'

  const threadRef = await firebase.firestore().collection('THREADS').doc(threadId)

  threadRef
    .set({
      latestMessage: {
        text: initialMessage,
        createdAt: new Date().getTime()
      },
      users: users,
      group: true,
      groupImage: imageUrl,
      groupName: { name: groupName },
      groupDescription: { description: description }
    }, { merge: true })
    .catch((error) => {
      console.log(
        'Something went wrong with added post to firestore.',
        error
      )
    })
}

export function concatList (list) {
  let str = ''
  list.sort()
  for (let i = 0; i < list.length; i++) {
    str = str + list[i].substring(0, 6)
  }
  return str
}
