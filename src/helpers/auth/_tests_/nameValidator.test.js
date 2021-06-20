import { nameValidator } from '../nameValidator'

it('returns empty string error', () => {
  expect(nameValidator('')).toBe("Name can't be empty.")
})

it('returns successfully', () => {
  expect(nameValidator('A')).toBe('')
})

it('returns successfully', () => {
  expect(nameValidator('a')).toBe('')
})

it('returns successfully', () => {
  expect(nameValidator('a test')).toBe('')
})

it('returns successfully', () => {
  expect(nameValidator('a test subject')).toBe('')
})
