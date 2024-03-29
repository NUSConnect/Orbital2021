import * as React from 'react'
import MatchCard from '../MatchCard'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

jest.useFakeTimers()

jest.mock('firebase', () => {
  return {
    auth: jest.fn().mockReturnValue({ currentUser: { uid: 22222 } })
  }
})

const mockedNavigate = jest.fn()

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockedNavigate
    })
  }
})

class CustomDate {
  constructor (date) {
    this.date = date
  }

  toDate () {
    return this.date
  }
}

const setDate = new Date(2021, 5, 15, 12, 0, 0)
const timestamp = new CustomDate(setDate)

const mockItem1 = {
  success: true,
  timeMatched: timestamp,
  isGroup: true
}

const mockItem2 = {
  success: false,
  timeMatched: timestamp
}

const mockItem3 = {
  success: true,
  timeMatched: timestamp,
  isGroup: false
}

it('renders correctly', () => {
  const tree = renderer.create(<MatchCard item={mockItem1} />)
  expect(tree).toMatchSnapshot()
})

it('on press card with group', () => {
  console.log = jest.fn()
  const { getByTestId } = render(<MatchCard item={mockItem1} />)
  fireEvent.press(getByTestId('pressable'))
  expect(console.log).toHaveBeenCalledWith('Group')
})

it('on press card with failure', () => {
  console.log = jest.fn()
  const { getByTestId } = render(<MatchCard item={mockItem2} />)
  fireEvent.press(getByTestId('pressable'))
  expect(console.log).toHaveBeenCalledWith('Failure')
})

it('on press card with individual', () => {
  console.log = jest.fn()
  const { getByTestId } = render(<MatchCard item={mockItem3} />)
  fireEvent.press(getByTestId('pressable'))
  expect(console.log).toHaveBeenCalledWith('Individual, go to view profile')
})
