import * as React from 'react'
import Background from '../Background'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<Background />)
  expect(tree).toMatchSnapshot()
})
