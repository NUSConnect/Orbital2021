import * as React from 'react'
import NextButton from '../NextButton'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<NextButton />)
  expect(tree).toMatchSnapshot()
})
