import AsyncStorage from '@react-native-async-storage/async-storage'
import checkIfFirstLaunch from '../firstLaunch'

jest.useFakeTimers()

it('can read asyncstorage', async () => {
  this.HAS_LAUNCHED = ''
  await AsyncStorage.getItem('HAS_LAUNCHED').then(HAS_LAUNCHED => {
    this.HAS_LAUNCHED = HAS_LAUNCHED
  })
  expect(this.HAS_LAUNCHED).toBe(null)
})

it('checkIfFirstLaunch returns true', async () => {
  const func = await checkIfFirstLaunch()
  expect(func).toBe(true)
})
