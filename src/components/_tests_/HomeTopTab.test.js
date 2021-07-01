import * as React from 'react'
import HomeTopTab from '../HomeTopTab'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<HomeTopTab />)
  expect(tree).toMatchSnapshot()
})

it('on press button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<HomeTopTab onPress={mockOnPressFn} />)
  fireEvent.press(getByTestId('onPress'))
  expect(mockOnPressFn).toHaveBeenCalled()
})

it('on press button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<HomeTopTab onPress2={mockOnPressFn} />)
  fireEvent.press(getByTestId('onPress2'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
