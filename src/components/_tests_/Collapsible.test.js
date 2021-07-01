import * as React from 'react'
import Collapsible from '../Collapsible'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<Collapsible />)
  expect(tree).toMatchSnapshot()
})
