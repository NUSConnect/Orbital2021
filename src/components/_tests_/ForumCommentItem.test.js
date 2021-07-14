import * as React from 'react'
import ForumCommentItem from '../ForumCommentItem'
import renderer from 'react-test-renderer'
import moment from 'moment'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

// Mock
jest.mock('firebase', () => {
  return {
    auth: jest.fn().mockReturnValue({ currentUser: { uid: 'tester' } }),
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn(() => {
          return {
            get: jest.fn(() => Promise.resolve(true))
          }
        })
      })
    })
  }
})

jest.mock('react-native-popup-menu', () => ({
  Menu: 'Menu',
  MenuContext: 'MenuContext',
  MenuOptions: 'MenuOptions',
  MenuOption: 'MenuOption',
  MenuTrigger: 'MenuTrigger'
}))

class CustomDate {
  constructor (date) {
    this.date = date
  }

  toDate () {
    return this.date
  }
}

const setDate = new Date(2021, 5, 15, 12, 0, 0)
const timestamp = new CustomDate(setDate)
const mockItem = { userId: 12345, postTime: timestamp, commentBody: 'commentText' }

// Tests

it('renders correctly', async () => {
  const tree = renderer.create(<ForumCommentItem item={mockItem} />)
  const instance = tree.root
  expect(instance.findByProps({ testID: 'time' }).props.children).toEqual([' ·', ' ', moment(timestamp.toDate()).fromNow()])
  expect(instance.findByProps({ testID: 'comment' }).props.children).toEqual('commentText')
})

it('on view profile', () => {
  const mockFn = jest.fn(x => x)
  const { getByTestId } = render(<ForumCommentItem item={mockItem} onViewProfile={mockFn} />)
  fireEvent.press(getByTestId('username'))
  expect(mockFn).toHaveBeenCalled()
})
