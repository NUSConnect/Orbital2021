import * as React from 'react'
import DoubleTap from '../DoubleTap'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<DoubleTap />)
  expect(tree).toMatchSnapshot()
})

it('on tap does not activate', () => {
  const mockTapFn = jest.fn()
  const { getByTestId } = render(<DoubleTap onPress={mockTapFn} />)
  fireEvent.press(getByTestId('doubletap'))
  expect(mockTapFn).not.toHaveBeenCalled()
})
