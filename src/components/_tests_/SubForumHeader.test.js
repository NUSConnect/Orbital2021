import * as React from 'react'
import { MenuProvider } from 'react-native-popup-menu'
import SubForumHeader from '../SubForumHeader'
import renderer from 'react-test-renderer'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(
    <MenuProvider>
      <SubForumHeader />
    </MenuProvider>
  )
  expect(tree).toMatchSnapshot()
})
