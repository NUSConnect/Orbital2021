import * as React from 'react'
import Collapsible from '../Collapsible'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

it('renders correctly', () => {
  const tree = renderer.create(<Collapsible />)
  expect(tree).toMatchSnapshot()
})

it('on press collapsible', () => {
  const mockOnPressFn = jest.fn()
  jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
    ...require.requireActual(
      'react-native/Libraries/LayoutAnimation/LayoutAnimation'
    ),
    configureNext: mockOnPressFn
  }))
  const { getByTestId } = render(<Collapsible />)
  fireEvent.press(getByTestId('collapsible'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
