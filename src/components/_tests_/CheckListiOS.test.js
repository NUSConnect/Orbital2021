import * as React from 'react'
import CheckList from '../CheckList'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const mockComponent = require('react-native/jest/mockComponent')
  return mockComponent('react-native/Libraries/Components/Switch/Switch')
})

it('renders correctly', () => {
  const tree = renderer.create(<CheckList />)
  expect(tree).toMatchSnapshot()
})

it('ios switch works correctly', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<CheckList selectItem={mockOnPressFn} />)
  const checkbox = getByTestId('switch')
  fireEvent(checkbox, 'onValueChange', true)
  expect(mockOnPressFn).toHaveBeenCalled()
})
