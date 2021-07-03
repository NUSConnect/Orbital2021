import * as React from 'react'
import CreateComment from '../CreateComment'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<CreateComment />)
  expect(tree).toMatchSnapshot()
})

it('on press button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<CreateComment onPress={mockOnPressFn} />)
  fireEvent.press(getByTestId('send'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
