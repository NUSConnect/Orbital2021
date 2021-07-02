import * as firebase from 'firebase'
import { getClusters } from './kMeans'

const splitClusterTest = (cluster) => {
  const firstHalf = cluster.splice(cluster.length / 2)
  const result = [firstHalf, cluster]
  return result.flatMap(x => splitHelper(x))
}

const splitHelperTest = (cluster) => {
  if (cluster.length <= 5) {
    return [cluster]
  } else {
    const firstHalf = cluster.splice(cluster.length / 2)
    const result = [firstHalf, cluster]
    return result.flatMap(x => splitHelper(x))
  }
}

const test = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]

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

  const splitCluster = (cluster) => {
    const firstHalf = cluster.splice(cluster.data.length / 2)
    const result = [firstHalf, cluster]
    return result.flatMap(x => splitHelper(x))
  }

  const splitHelper = (cluster) => {
    if (cluster.data.length <= 5) {
      return [cluster]
    } else {
      const firstHalf = cluster.splice(cluster.data.length / 2)
      const result = [firstHalf, cluster]
      return result.flatMap(x => splitHelper(x))
    }
  }

  const flattenedClusters = flattenClusters(clusters)

  const preprocessedClusters = flattenedClusters.filter(cluster => cluster.data.length > 1)

  const processedClusters = preprocessedClusters.flatMap(cluster => cluster.data.length > 5 ? splitCluster(cluster) : [cluster])

  const rejectedClusters = flattenedClusters.filter(cluster => cluster.data.length === 1)

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
