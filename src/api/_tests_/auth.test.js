import * as authentication from '../auth'
import * as firebase from 'firebase'

jest.mock('firebase', () => {
  return {
    auth: jest.fn(() => {
      return {
        createUserWithEmailAndPassword: jest.fn(
          (email, password) => {
            return new Promise(function (resolve, reject) {
              resolve({
                email: 'test@test.com',
                uid: '12345abcde'
              })

              reject(new Error('Unable to create user'))
            })
          }
        ),
        signOut: jest.fn(() => {
          return new Promise(function (resolve, reject) {
            resolve('Success')
            reject(new Error('Unable to sign out'))
          })
        }),
        onAuthStateChanged: jest.fn(() => {
          return {
            email: 'test@test.com',
            uid: '12345abcde'
          }
        }),
        signInWithEmailAndPassword: jest.fn(
          (email, password) => {
            return new Promise(function (resolve, reject) {
              reject(new Error('Unable to sign in'))
            })
          }
        ),
        sendPasswordResetEmail: jest.fn(
          (email) => {
            return new Promise(function (resolve, reject) {
              reject(new Error('Unable to send email'))
            })
          }
        )
      }
    })
  }
})

it('calls sign out successfully on logoutUser', async () => {
  await authentication.logoutUser()
  expect(firebase.auth().signOut()).resolves.toHaveBeenCalledTimes(1)
})

it('creates user successfully on signUpUser', async () => {
  await authentication.signUpUser('testName', 'test@test.com', 'testPassword')
  expect(firebase.auth().createUserWithEmailAndPassword()).resolves.toHaveBeenCalledTimes(1)
})

it('successful login on loginUser', async () => {
  await authentication.loginUser('test@test.com', 'testPassword')
  expect(firebase.auth().signInWithEmailAndPassword()).resolves.toHaveBeenCalledTimes(1)
})

it('successful email sent on sendEmailWithPassword', async () => {
  await authentication.sendEmailWithPassword('test@test.com')
  expect(firebase.auth().sendPasswordResetEmail()).resolves.toHaveBeenCalledTimes(1)
})
