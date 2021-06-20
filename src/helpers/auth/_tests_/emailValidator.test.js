import { emailValidator } from '../emailValidator'

it('returns empty string error', () => {
  expect(emailValidator('')).toBe("Email can't be empty.")
})

it('returns invalid email error', () => {
  expect(emailValidator('hello')).toBe('Oops! We need a valid email address.')
})

it('returns invalid email error', () => {
  expect(emailValidator('test@gmail')).toBe('Oops! We need a valid email address.')
})

it('returns invalid email error', () => {
  expect(emailValidator('gmail.com')).toBe('Oops! We need a valid email address.')
})

it('returns invalid email error', () => {
  expect(emailValidator('@gmail.com')).toBe('Oops! We need a valid email address.')
})

it('returns invalid email error', () => {
  expect(emailValidator('.com')).toBe('Oops! We need a valid email address.')
})

it('returns invalid email error', () => {
  expect(emailValidator('@gmail')).toBe('Oops! We need a valid email address.')
})

it('returns successfully', () => {
  expect(emailValidator('test@gmail.com')).toBe('')
})
