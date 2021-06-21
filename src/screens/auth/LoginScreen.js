import React, { useState } from 'react'
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Text } from 'react-native-paper'
import { loginUser } from '../../api/auth'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Logo from '../../components/Logo'
import TextInput from '../../components/TextInput'
import Toast from '../../components/Toast'
import { emailValidator } from '../../helpers/auth/emailValidator'
import { passwordValidator } from '../../helpers/auth/passwordValidator'

export default function LoginScreen ({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState()
  const [error, setError] = useState()

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    setLoading(true)
    const response = await loginUser({
      email: email.value,
      password: password.value
    })
    if (response.error) {
      setError(response.error)
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
      <Header>Welcome back.</Header>
      <TextInput
        label='Email'
        returnKeyType='next'
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize='none'
        autoCompleteType='email'
        textContentType='emailAddress'
        keyboardType='email-address'
      />
      <TextInput
        label='Password'
        returnKeyType='done'
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        autoCapitalize='none'
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button
        style={styles.login}
        loading={loading}
        mode='contained'
        onPress={onLoginPressed}
      >
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.replace('RegisterScreen')}
        >
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <Toast message={error} onDismiss={() => setError('')} />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    marginTop: StatusBar.currentHeight || 0
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
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24
  },
  row: {
    flexDirection: 'row',
    marginTop: 4
  },
  forgot: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'dodgerblue'
  },
  link: {
    fontWeight: 'bold',
    color: 'dodgerblue'
  },
  login: {
    backgroundColor: '#ff8c00'
  }
})
