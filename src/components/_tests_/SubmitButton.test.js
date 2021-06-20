import * as React from 'react'
import SubmitButton from '../SubmitButton'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<SubmitButton />)
  expect(tree).toMatchSnapshot()
})
