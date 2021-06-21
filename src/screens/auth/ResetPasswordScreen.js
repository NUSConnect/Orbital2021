import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { sendEmailWithPassword } from '../../api/auth'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Logo from '../../components/Logo'
import TextInput from '../../components/TextInput'
import Toast from '../../components/Toast'
import { emailValidator } from '../../helpers/auth/emailValidator'

export default function ResetPasswordScreen ({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ value: '', type: '' })

  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    setLoading(true)
    const response = await sendEmailWithPassword(email.value)
    if (response.error) {
      setToast({ type: 'error', message: response.error })
    } else {
      setToast({
        type: 'success',
        message: 'Email with password has been sent.'
      })
    }
    setLoading(false)
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.inner}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
    >
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Reset Password</Header>
      <TextInput
        label='Email'
        returnKeyType='done'
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize='none'
        autoCompleteType='email'
        textContentType='emailAddress'
        keyboardType='email-address'
        description='You will receive an email with password reset link.'
      />
      <Button
        style={styles.reset}
        loading={loading}
        mode='contained'
        onPress={sendResetPasswordEmail}
      >
        Send Reset Link
      </Button>
      <Toast
        {...toast}
        onDismiss={() => setToast({ value: '', type: '' })}
      />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white'
  },
  inner: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  reset: {
    backgroundColor: '#ff8c00',
    marginTop: 16
  }
})
