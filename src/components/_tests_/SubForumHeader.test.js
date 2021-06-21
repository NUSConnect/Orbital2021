import * as React from 'react'
import SubForumHeader from '../SubForumHeader'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<SubForumHeader />)
  expect(tree).toMatchSnapshot()
})
