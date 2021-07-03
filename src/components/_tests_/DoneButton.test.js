import * as React from 'react'
import DoneButton from '../CreateComment'
import renderer from 'react-test-renderer'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<DoneButton />)
  expect(tree).toMatchSnapshot()
})
