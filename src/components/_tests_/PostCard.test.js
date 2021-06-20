import * as React from 'react'
import PostCard from '../PostCard'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import moment from 'moment'
import { fireEvent, render } from '@testing-library/react-native'

// Mock
jest.mock('firebase', () => {
  return {
    auth: jest.fn().mockReturnValue({ currentUser: { uid: 22222 } })
  }
})

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
  id: 11111,
  userId: 22222,
  userName: 'mockUser',
  userImg: 'mockDP',
  postId: 33333,
  postTime: timestamp,
  post: 'mockPost',
  postImg: 'mockImg',
  likeCount: 100,
  commentCount: 50
}

// Tests

it('renders correctly', () => {
  const tree = renderer.create(<PostCard item={mockItem} />)
  const instance = tree.root
  expect(instance.findByProps({ testID: 'post' }).props.children).toEqual('mockPost')
  expect(instance.findByProps({ testID: 'time' }).props.children).toEqual(moment(timestamp.toDate()).fromNow())
  expect(instance.findByProps({ testID: 'image' }).props.source.uri).toEqual('mockImg')
  //    expect(instance.findByProps({ testID: 'likes' }).props.children).toEqual('100 Likes'); // no states
  expect(instance.findByProps({ testID: 'comments' }).props.children).toEqual('50 Comments')
})

it('pressable events', () => {
  const mockCommentFn = jest.fn()
  const mockViewProfileFn = jest.fn(x => x)
  const mockEditFn = jest.fn()
  const mockDelFn = jest.fn(x => x)
  const mockReportFn = jest.fn(x => x)

  const { getByTestId, queryByTestId } = render(
    <PostCard
      item={mockItem}
      onPress={mockCommentFn}
      onViewProfile={mockViewProfileFn}
      onEdit={mockEditFn}
      onDelete={mockDelFn}
      onReport={mockReportFn}
    />
  )

  fireEvent.press(getByTestId('user'))
  fireEvent.press(getByTestId('edit'))
  fireEvent.press(getByTestId('commentPress'))
  fireEvent.press(getByTestId('delete'))

  expect(mockViewProfileFn).toHaveBeenCalled()
  expect(mockCommentFn).toHaveBeenCalled()
  expect(mockEditFn).toHaveBeenCalled()
  expect(mockDelFn).toHaveBeenCalled()

  expect(queryByTestId('report')).toBeNull() // currUserID is the same as poster, report should not appear
  // missing test for likes
})
