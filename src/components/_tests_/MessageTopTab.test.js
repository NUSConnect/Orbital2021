import * as React from 'react'
import MessageTopTab from '../MessageTopTab'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<MessageTopTab />)
  expect(tree).toMatchSnapshot()
})

it('on press back', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<MessageTopTab onBack={mockOnPressFn} />)
  fireEvent.press(getByTestId('onBack'))
  expect(mockOnPressFn).toHaveBeenCalled()
})

it('on press people', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<MessageTopTab onPress={mockOnPressFn} />)
  fireEvent.press(getByTestId('onPress'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
