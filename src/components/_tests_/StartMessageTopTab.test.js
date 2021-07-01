import * as React from 'react'
import StartMessageTopTab from '../StartMessageTopTab'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<StartMessageTopTab />)
  expect(tree).toMatchSnapshot()
})

it('on press button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<StartMessageTopTab onBack={mockOnPressFn} />)
  fireEvent.press(getByTestId('onBack'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
