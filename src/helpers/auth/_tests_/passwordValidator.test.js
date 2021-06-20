import { passwordValidator } from '../passwordValidator'

it('returns empty string error', () => {
  expect(passwordValidator('')).toBe("Password can't be empty.")
})

it('returns password too short error', () => {
  expect(passwordValidator('a')).toBe('Password must be at least 6 characters long.')
})

it('returns password too short error', () => {
  expect(passwordValidator('ab')).toBe('Password must be at least 6 characters long.')
})

it('returns password too short error', () => {
  expect(passwordValidator('abc')).toBe('Password must be at least 6 characters long.')
})

it('returns password too short error', () => {
  expect(passwordValidator('abcd')).toBe('Password must be at least 6 characters long.')
})

it('returns password too short error', () => {
  expect(passwordValidator('abcde')).toBe('Password must be at least 6 characters long.')
})

it('returns successfully', () => {
  expect(passwordValidator('abcdef')).toBe('')
})

it('returns successfully', () => {
  expect(passwordValidator('correctPassword')).toBe('')
})
