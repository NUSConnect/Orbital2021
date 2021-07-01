import * as React from 'react'
import TextInput from '../TextInput'
import renderer from 'react-test-renderer'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = renderer.create(<TextInput />)
  expect(tree).toMatchSnapshot()
})
