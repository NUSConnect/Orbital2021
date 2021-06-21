import * as React from 'react'
import PostButton from '../PostButton'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

it('renders correctly', () => {
  const tree = renderer.create(<PostButton />)
  expect(tree).toMatchSnapshot()
})

it('on press button', () => {
  const mockOnPressFn = jest.fn()
  const { getByTestId } = render(<PostButton onPress={mockOnPressFn} />)
  fireEvent.press(getByTestId('onPress'))
  expect(mockOnPressFn).toHaveBeenCalled()
})
