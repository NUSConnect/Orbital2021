import * as React from 'react'
import Header from '../Header'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<Header />)
  expect(tree).toMatchSnapshot()
})
