import * as React from 'react'
import CheckList from '../CheckList'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<CheckList />)
  expect(tree).toMatchSnapshot()
})
