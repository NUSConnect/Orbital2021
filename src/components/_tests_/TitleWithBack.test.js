import * as React from 'react'
import TitleWithBack from '../TitleWithBack'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<TitleWithBack />)
  expect(tree).toMatchSnapshot()
})

it('on press button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<TitleWithBack onPress={mockOnPressFn} />)
  fireEvent.press(getByTestId('onPress'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
