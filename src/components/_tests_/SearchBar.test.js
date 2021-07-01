import * as React from 'react'
import SearchBar from '../SearchBar'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()
jest.mock('react-native-vector-icons')

it('renders correctly', () => {
  const tree = renderer.create(<SearchBar />)
  expect(tree).toMatchSnapshot()
})

it('onChangeText works', () => {
  const setSearchFn = jest.fn()
  const filterFn = jest.fn()
  const resetFilterFn = jest.fn()
  const { getByTestId } = render(
    <SearchBar search='a' setSearch={setSearchFn} searchFilterFunction={filterFn} resetFilter={resetFilterFn} />
  )

  fireEvent.changeText(getByTestId('input'), 'test')
  expect(filterFn).toHaveBeenCalledWith('test')
})

it('reset button works', () => {
  const setSearchFn = jest.fn()
  const filterFn = jest.fn()
  const resetFilterFn = jest.fn()
  const { getByTestId } = render(
    <SearchBar search='a' setSearch={setSearchFn} searchFilterFunction={filterFn} resetFilter={resetFilterFn} />
  )

  fireEvent.press(getByTestId('reset'))
  expect(setSearchFn).toHaveBeenCalledWith('')
  expect(resetFilterFn).toHaveBeenCalled()
})
