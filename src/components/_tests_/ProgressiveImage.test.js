import * as React from 'react'
import ProgressiveImage from '../ProgressiveImage'
import renderer from 'react-test-renderer'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = renderer.create(<ProgressiveImage />)
  expect(tree).toMatchSnapshot()
})
