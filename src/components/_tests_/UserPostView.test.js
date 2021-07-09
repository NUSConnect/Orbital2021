import * as React from 'react'
import UserPostView from '../UserPostView'
import renderer from 'react-test-renderer'
import 'jest-styled-components'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

// Mock
jest.mock('firebase', () => {
  return {
    auth: jest.fn().mockReturnValue({ currentUser: { uid: 22222 } })
  }
})

const mockItem = {
  id: 11111,
  userId: 22222
}

// Tests

it('renders correctly', () => {
  const tree = renderer.create(<UserPostView item={mockItem} />)
  expect(tree).toMatchSnapshot()
})
