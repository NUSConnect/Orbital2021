import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'
import Button from '../../components/Button'

export default function SuperAdminScreen ({ navigation }) {
  return (
    <Background style={styles.bg}>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.buttonwrap}>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('PromoteSuperAdminScreen')}
        >
          Promote to Super Admin
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('DemoteSuperAdminScreen')}
        >
          Demote Super Admin
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    width: '100%'
  },
  buttonwrap: {
    backgroundColor: '#FFFFFF',
    height: 500,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
