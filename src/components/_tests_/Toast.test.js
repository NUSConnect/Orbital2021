import * as React from 'react'
import Toast from '../Toast'
import renderer from 'react-test-renderer'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = renderer.create(<Toast />)
  expect(tree).toMatchSnapshot()
})
