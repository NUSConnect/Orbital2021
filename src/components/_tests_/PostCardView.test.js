import * as React from 'react'
import PostCardView from '../PostCardView'
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
  const tree = renderer.create(<PostCardView item={mockItem} />)
  const instance = tree.root
  expect(instance.findByProps({ testID: 'post' }).props.children).toEqual('mockPost')
  expect(instance.findByProps({ testID: 'time' }).props.children).toEqual(moment(timestamp.toDate()).fromNow())
  expect(instance.findByProps({ testID: 'image' }).props.source.uri).toEqual('mockImg')
//    expect(instance.findByProps({ testID: 'likes' }).props.children).toEqual('100 Likes'); // no states
})

it('pressable events', () => {
  const mockViewProfileFn = jest.fn(x => x)

  const { getByTestId } = render(
    <PostCardView
      item={mockItem}
      onViewProfile={mockViewProfileFn}
    />
  )

  fireEvent.press(getByTestId('user'))

  expect(mockViewProfileFn).toHaveBeenCalled()
  // missing test for likes
})
