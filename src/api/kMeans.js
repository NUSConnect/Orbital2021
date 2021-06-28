export function defaultVectorFunc (vector) {
  return vector
}

export function getNumDimensions (data, vectorFunc) {
  if (data[0]) {
    return vectorFunc(data[0]).length
  }
}

export function getNumClusters (numPoints) {
  return Math.ceil(Math.sqrt(numPoints / 2))
}

export function initMinMax (numDimensions) {
  const result = { minValue: [], maxValue: [] }
  for (let i = 0; i < numDimensions; i++) {
    result.minValue.push(-10000)
    result.maxValue.push(10000)
  }
  return result
}

export function getMinMax (data, numDimensions, vectorFunc) {
  const minMaxValues = initMinMax(numDimensions)
  data.forEach(vector => {
    for (let i = 0; i < numDimensions; i++) {
      if (vectorFunc(vector)[i] < minMaxValues.minValue[i]) {
        minMaxValues.minValue[i] = vectorFunc(vector)[i]
      }
      if (vectorFunc(vector)[i] > minMaxValues.maxValue[i]) {
        minMaxValues.maxValue[i] = vectorFunc(vector)[i]
      }
    }
  })
  return minMaxValues
}

export function getMean (data, index, vectorFunc) {
  let sum = 0
  const total = data.length
  if (total === 0) return 0
  data.forEach(vector => {
    sum = sum + vectorFunc(vector)[index]
  })
  return sum / total
}

export function updateMean (cluster, vectorFunc) {
  const newMean = []
  for (let i = 0; i < cluster.mean.length; i++) {
    newMean.push(getMean(cluster.data, i, vectorFunc))
  };
  cluster.mean = newMean
}

export function updateMeans (clusters, vectorFunc) {
  clusters.forEach(cluster => {
    updateMean(cluster, vectorFunc)
  })
}

export function assignDataToClusters (data, clusters, distanceFunc, vectorFunc) {
  data.forEach(vector => {
    const cluster = findClosestCluster(vectorFunc(vector), clusters, distanceFunc)
    if (!cluster.data) cluster.data = []
    cluster.data.push(vector)
  })
}

export function findClosestCluster (vector, clusters, distanceFunc) {
  let closest = {}
  let minDistance = 10000000
  clusters.forEach(cluster => {
    const distance = distanceFunc(cluster.mean, vector)
    if (distance < minDistance) {
      minDistance = distance
      closest = cluster
    };
  })
  return closest
}

export function initClustersData (clusters) {
  clusters.forEach(cluster => {
    cluster.data = []
  })
}

export function createClusters (means) {
  const clusters = []

  means.forEach(mean => {
    const cluster = { mean: mean, data: [] }
    clusters.push(cluster)
  })
  return clusters
}

export function createRandomMeans (numDimensions, numClusters, minMaxValues) {
  const means = []
  for (let i = 0; i < numClusters; i++) {
    means.push(createRandomPoint(numDimensions, minMaxValues.minValue[i], minMaxValues.maxValue[i]))
  };
  return means
}

export function createRandomPoint (numDimensions, minValue, maxValue) {
  const point = []
  for (let i = 0; i < numDimensions; i++) {
    point.push(random(minValue, maxValue))
  };
  return point
}

export function random (low, high) {
  return low + Math.random() * (high - low)
}

export function getDistance (vector1, vector2) {
  let sum = 0
  for (let i = 0; i < vector1.length; i++) {
    sum = sum + Math.pow(vector1[i] - vector2[i], 2)
  }
  return Math.sqrt(sum)
}

export function getClustersWithParams (data, numDimensions, numClusters, distanceFunc, vectorFunc, minMaxValues, maxIterations) {
  const means = createRandomMeans(numDimensions, numClusters, minMaxValues)
  const clusters = createClusters(means)
  let numIterations = 0
  const iterations = []
  while (numIterations < maxIterations) {
    initClustersData(clusters)
    assignDataToClusters(data, clusters, distanceFunc, vectorFunc)
    updateMeans(clusters, vectorFunc)
    numIterations++
  }
  return { clusters: clusters, iterations: iterations }
}

export function getClusters (data, options) {
  let numberOfClusters, distanceFunc, vectorFunc, maxIterations
  let minMaxValues = {}

  if (!options || !options.numberOfClusters) {
    numberOfClusters = getNumClusters(data.length)
  } else {
    numberOfClusters = options.numberOfClusters
  }

  if (!options || !options.distanceFunc) {
    distanceFunc = getDistance
  } else {
    distanceFunc = options.distanceFunc
  }

  if (!options || !options.vectorFunc) {
    vectorFunc = defaultVectorFunc
  } else {
    vectorFunc = options.vectorFunc
  }

  if (!options || !options.maxIterations) {
    maxIterations = 1000
  } else {
    maxIterations = options.maxIterations
  }

  const numberOfDimensions = getNumDimensions(data, vectorFunc)

  minMaxValues = getMinMax(data, numberOfDimensions, vectorFunc)

  return getClustersWithParams(data, numberOfDimensions, numberOfClusters, distanceFunc, vectorFunc, minMaxValues, maxIterations).clusters
}
