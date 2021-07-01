import * as kMeans from '../kMeans'

it('defaultVectorFunc returns the vector correctly', () => {
  expect(kMeans.defaultVectorFunc([1, 2, 3])).toEqual([1, 2, 3])
})

it('getNumDimensions returns correct number of dimensions', () => {
  expect(kMeans.getNumDimensions([{ vector: [1, 2, 3] }, { vector: [4, 5, 6] }], kMeans.defaultVectorFunc)).toBe(3)
})

it('getNumDimensions returns null when no data is provided', () => {
  expect(kMeans.getNumDimensions(1, kMeans.defaultVectorFunc)).toBe(undefined)
})

it('getNumClusters returns correct number of clusters', () => {
  expect(kMeans.getNumClusters(8)).toBe(2)
})

it('getNumClusters returns correct number of clusters', () => {
  expect(kMeans.getNumClusters(10)).toBe(3)
})

it('initMinMax initializes the min max values correctly', () => {
  expect(kMeans.initMinMax(2)).toEqual({ minValue: [-10000, -10000], maxValue: [10000, 10000] })
})

it('getMinMax adjusts min max values correctly', () => {
  expect(kMeans.getMinMax([{ vector: [-100000, -100000] }, { vector: [0, 0] }, { vector: [100000, 100000] }], 2, kMeans.defaultVectorFunc))
    .toEqual({ maxValue: [100000, 100000], minValue: [-100000, -100000] })
})

it('getMean calculates mean correctly', () => {
  expect(kMeans.getMean([{ vector: [-100000, -100000] }, { vector: [0, 0] }, { vector: [100000, 100000] }], 0, kMeans.defaultVectorFunc)).toEqual(0)
  expect(kMeans.getMean([{ vector: [-100000, -100000] }, { vector: [0, 0] }, { vector: [100000, 100000] }], 1, kMeans.defaultVectorFunc)).toEqual(0)
})

it('getMean calculates mean correctly', () => {
  expect(kMeans.getMean([{ vector: [-100000, -100000] }, { vector: [0, 0] }, { vector: [100000, 1000000] }], 0, kMeans.defaultVectorFunc)).toEqual(0)
  expect(kMeans.getMean([{ vector: [-100000, -100000] }, { vector: [0, 0] }, { vector: [100000, 1000000] }], 1, kMeans.defaultVectorFunc)).toEqual(300000)
})

it('updateMean updates mean correctly', () => {
  const cluster = { data: [{ vector: [-100000, -100000] }, { vector: [0, 0] }, { vector: [100000, 100000] }], mean: { length: 2 } }
  kMeans.updateMean(cluster, kMeans.defaultVectorFunc)
  expect(cluster.mean).toEqual([0, 0])
})

it('updateMean updates mean correctly', () => {
  const cluster = { data: [{ vector: [-100000, -100000] }, { vector: [0, 0] }, { vector: [100000, 1000000] }], mean: { length: 2 } }
  kMeans.updateMean(cluster, kMeans.defaultVectorFunc)
  expect(cluster.mean).toEqual([0, 300000])
})

it('updateMeans updates means correctly', () => {
  const cluster1 = { data: [{ vector: [-100000, -100000] }, { vector: [0, 0] }, { vector: [100000, 100000] }], mean: { length: 2 } }
  const cluster2 = { data: [{ vector: [-100000, -100000] }, { vector: [0, 0] }, { vector: [100000, 1000000] }], mean: { length: 2 } }
  const clusters = [cluster1, cluster2]
  kMeans.updateMeans(clusters, kMeans.defaultVectorFunc)
  expect(cluster1.mean).toEqual([0, 0])
  expect(cluster2.mean).toEqual([0, 300000])
})

it('findClosestCluster finds the nearest cluster correctly', () => {
  const cluster1 = { data: [[0, 0]], mean: [0, 0] }
  const cluster2 = { data: [[100000, 1000000]], mean: [100000, 1000000] }
  const clusters = [cluster1, cluster2]
  expect(kMeans.findClosestCluster([0, 0], clusters, kMeans.getDistance)).toEqual(cluster1)
})

it('assignDataToClusters pushes data correctly', () => {
  const cluster1 = { data: [{ vector: [0, 0] }], mean: [0, 0] }
  const cluster2 = { data: [{ vector: [100000, 1000000] }], mean: [100000, 1000000] }
  const clusters = [cluster1, cluster2]
  kMeans.assignDataToClusters([{ vector: [1, 1] }, { vector: [100000, 1000001] }], clusters, kMeans.getDistance, kMeans.defaultVectorFunc)
  expect(cluster1.data).toEqual([{ vector: [0, 0] }, { vector: [1, 1] }])
  expect(cluster2.data).toEqual([{ vector: [100000, 1000000] }, { vector: [100000, 1000001] }])
})

it('initClustersData initializes data correctly', () => {
  const cluster1 = { data: [[0, 0]], mean: [0, 0] }
  const cluster2 = { data: [[100000, 1000000]], mean: [100000, 1000000] }
  const clusters = [cluster1, cluster2]
  kMeans.initClustersData(clusters)
  expect(cluster1.data).toEqual([])
  expect(cluster2.data).toEqual([])
})

it('createClusters creates the clusters accordingly', () => {
  const means = [0, 1, 2]
  expect(kMeans.createClusters(means)).toEqual([{ mean: 0, data: [] }, { mean: 1, data: [] }, { mean: 2, data: [] }])
})

it('random generates number correctly', () => {
  global.Math.random = () => 1
  expect(kMeans.random(1, 2)).toEqual(2)
})

it('createRandomPoint generates point correctly', () => {
  global.Math.random = () => 1
  expect(kMeans.createRandomPoint(2, 1, 2)).toEqual([2, 2])
})

it('createRandomMeans generates means correctly', () => {
  global.Math.random = () => 1
  expect(kMeans.createRandomMeans(2, 2, { minValue: [-10000, -10000], maxValue: [10000, 10000] }))
    .toEqual([[10000, 10000], [10000, 10000]])
})

it('getDistance returns the correct Euclidean distance', () => {
  expect(kMeans.getDistance([0, 0], [3, 4])).toEqual(5)
})

it('getClusters returns the correct info', () => {
  const data = [{ vector: [1, 2, 1, 2] }, { vector: [3, 4, 3, 4] }, { vector: [10, 11, 10, 11] }, { vector: [12, 13, 12, 13] }]
  expect(kMeans.getClusters(data, 2)).toEqual([{ data: [{ vector: [10, 11, 10, 11] },
  { vector: [12, 13, 12, 13] }], mean: [11, 12, 11, 12] }, { data: [{ vector: [1, 2, 1, 2] }, { vector: [3, 4, 3, 4] }], mean: [2, 3, 2, 3] }]
  )
})
