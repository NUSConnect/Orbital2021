import * as React from 'react'
import CheckList from '../CheckList'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const Platform = require.requireActual('react-native/Libraries/Utilities/Platform')
  Platform.OS = 'android'
  return Platform
})

it('renders correctly', () => {
  const tree = renderer.create(<CheckList />)
  expect(tree).toMatchSnapshot()
})

it('android checkbox works correctly', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<CheckList selectItem={mockOnPressFn} />)
  const checkbox = getByTestId('checkbox')
  fireEvent(checkbox, 'onValueChange', { nativeEvent: {} })
  expect(mockOnPressFn).toHaveBeenCalled()
})
