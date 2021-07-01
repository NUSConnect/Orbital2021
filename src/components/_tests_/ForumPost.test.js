import * as React from 'react'
import ForumPost from '../ForumPost'
import renderer from 'react-test-renderer'
import moment from 'moment'
import { fireEvent, render } from '@testing-library/react-native'

// Mock
jest.mock('firebase', () => {
  return {
    auth: jest.fn().mockReturnValue({ currentUser: { uid: 'tester' } })
  }
})

jest.mock('react-native-vector-icons')

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
const mockItem = {
  forumId: 11111,
  postId: 22222,
  postTitle: 'mockTitle',
  postBody: 'mockBody',
  userId: 12345,
  postTime: timestamp,
  votes: 100,
  commentCount: 50
}

// Tests

it('renders correctly', () => {
  const tree = renderer.create(<ForumPost item={mockItem} />)
  const instance = tree.root
  expect(instance.findByProps({ testID: 'title' }).props.children).toEqual('mockTitle')
  expect(instance.findByProps({ testID: 'body' }).props.children).toEqual('mockBody')
  expect(instance.findByProps({ testID: 'time' }).props.children).toEqual([' ·', ' ', moment(timestamp.toDate()).fromNow()])
  expect(instance.findByProps({ testID: 'votes' }).props.children).toEqual(100)
  expect(instance.findByProps({ testID: 'comments' }).props.children).toEqual(50)
})

it('pressable events', () => {
  const mockViewPostFn = jest.fn()
  const mockViewProfileFn = jest.fn(x => x)
  const mockEditFn = jest.fn()
  const mockDelFn = jest.fn()
  const mockReportFn = jest.fn()

  const { getByTestId } = render(
    <ForumPost
      item={mockItem}
      onPress={mockViewPostFn}
      onViewProfile={mockViewProfileFn}
      onEdit={mockEditFn}
      onDelete={mockDelFn}
      onReport={mockReportFn}
    />
  )

  fireEvent.press(getByTestId('username'))
  fireEvent.press(getByTestId('title'))
  fireEvent.press(getByTestId('body'))
  fireEvent.press(getByTestId('commentIcon'))
  fireEvent.press(getByTestId('report'))

  expect(mockViewProfileFn).toHaveBeenCalled()
  expect(mockViewPostFn.mock.calls.length).toBe(3)
  expect(mockReportFn).toHaveBeenCalled()

  // missing test for voting, edit and delete
})
