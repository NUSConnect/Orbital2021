import * as React from 'react'
import AddMajorTopTab from '../AddMajorTopTab'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<AddMajorTopTab />)
  expect(tree).toMatchSnapshot()
})

it('on press button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<AddMajorTopTab onPress={mockOnPressFn} />)
  fireEvent.press(getByTestId('back'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
