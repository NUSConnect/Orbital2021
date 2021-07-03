import * as React from 'react'
import GroupCreationTopTab from '../GroupCreationTopTab'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<GroupCreationTopTab />)
  expect(tree).toMatchSnapshot()
})

it('on back button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<GroupCreationTopTab onBack={mockOnPressFn} />)
  fireEvent.press(getByTestId('onBack'))
  expect(mockOnPressFn).toHaveBeenCalled()
})

it('on press button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<GroupCreationTopTab onPress={mockOnPressFn} />)
  fireEvent.press(getByTestId('onPress'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
