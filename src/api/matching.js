import * as firebase from 'firebase'
import { getClusters } from './kMeans'

export async function formClusters() {
  const data = []

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
      })
    })

  console.log('New Test: # points = ', data.length)

  const clusters = getClusters(data)
  console.log(clusters);

  const flattenHelper = (clusters) => {
    if (clusters.length == 0) {
        return []
    } else {
        const newClusters = clusters.flatMap(cluster => getClusters(cluster.data))
        const acceptableClusters = newClusters.filter(cluster => cluster.data.length <= 5)
        const incorrectClusters = newClusters.filter(cluster => cluster.data.length > 5)

        return acceptableClusters.concat(flattenHelper(incorrectClusters))
    }
  }

  const flattenClusters = (clusters) => {
    const acceptableClusters = clusters.filter(cluster => cluster.data.length <= 5)
    const incorrectClusters = clusters.filter(cluster => cluster.data.length > 5)

    const correctedClusters = flattenHelper(incorrectClusters)

    return acceptableClusters.concat(correctedClusters)
  }

  const flattenedClusters = flattenClusters(clusters);


  const processedClusters = flattenedClusters.filter(cluster => cluster.data.length > 1)

  const rejectedClusters = flattenedClusters.filter(cluster => cluster.data.length == 1)

  for (let i = 0; i < processedClusters.length; i++) {
    const clusterSize = processedClusters[i].data.length
    console.log('Processed Cluster: ' + i, processedClusters[i].data)
    console.log('Size: ', clusterSize)
    // Form group and send notification
  }

  for (let i = 0; i < rejectedClusters.length; i++) {
    // Send them notification that matching failed, alert opens the next time they open the app
  }
}