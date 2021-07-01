import * as React from 'react'
import BackButton from '../BackButton'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = renderer.create(<BackButton />)
  expect(tree).toMatchSnapshot()
})

it('on press button', () => {
  const mockGoBackFn = jest.fn()
  const { getByTestId } = render(<BackButton goBack={mockGoBackFn} />)
  fireEvent.press(getByTestId('back'))
  expect(mockGoBackFn).toHaveBeenCalled()
})
