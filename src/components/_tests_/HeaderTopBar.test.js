import * as React from 'react'
import HeaderTopBar from '../HeaderTopBar'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<HeaderTopBar />)
  expect(tree).toMatchSnapshot()
})

it('on press button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<HeaderTopBar onPress={mockOnPressFn} />)
  fireEvent.press(getByTestId('onPress'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
