import * as matching from '../matching'

it('splitting is done for big clusters', () => {
  const cluster = {
    data: [
      { userId: 'a', vector: [0, 0, 0, 0] },
      { userId: 'b', vector: [0, 0, 0, 0] },
      { userId: 'c', vector: [0, 0, 0, 0] },
      { userId: 'd', vector: [0, 0, 0, 0] },
      { userId: 'e', vector: [0, 0, 0, 0] },
      { userId: 'f', vector: [0, 0, 0, 0] },
      { userId: 'g', vector: [0, 0, 0, 0] },
      { userId: 'h', vector: [0, 0, 0, 0] }
    ],
    mean: [0, 0, 0, 0]
  }

  expect(matching.splitCluster(cluster)).toEqual([
    {
      data: [
        { userId: 'e', vector: [0, 0, 0, 0] },
        { userId: 'f', vector: [0, 0, 0, 0] },
        { userId: 'g', vector: [0, 0, 0, 0] },
        { userId: 'h', vector: [0, 0, 0, 0] }
      ],
      mean: [0, 0, 0, 0]
    },
    {
      data: [
        { userId: 'a', vector: [0, 0, 0, 0] },
        { userId: 'b', vector: [0, 0, 0, 0] },
        { userId: 'c', vector: [0, 0, 0, 0] },
        { userId: 'd', vector: [0, 0, 0, 0] }
      ],
      mean: [0, 0, 0, 0]
    }]
  )
})
