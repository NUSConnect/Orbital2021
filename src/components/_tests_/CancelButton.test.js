import * as React from 'react'
import CancelButton from '../CancelButton'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = renderer.create(<CancelButton />)
  expect(tree).toMatchSnapshot()
})

it('on press button', () => {
  const mockCancelFn = jest.fn()
  const { getByTestId } = render(<CancelButton goBack={mockCancelFn} />)
  fireEvent.press(getByTestId('cancel'))
  expect(mockCancelFn).toHaveBeenCalled()
})
