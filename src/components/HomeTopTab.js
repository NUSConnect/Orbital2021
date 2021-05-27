import React from 'react'
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import { theme } from '../core/theme'

export default function HomeTopTab({ style, onPress, onPress2, ...props }) {
  return (
     <View style={styles.container}>
         <TouchableOpacity
            style={styles.button}
            activeOpacity={ 0.4 }
            onPress={ onPress }>
            <Ionicons name="chatbubbles-outline" color="#79D2E6" size={38}
              style={styles.icon} />
         </TouchableOpacity>
          <Text style={styles.text}>
            Portal.io
          </Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={ 0.4 }
            onPress={ onPress2 }>
                <Ionicons name="add" color="#79D2E6" size={38}
                    style={styles.icon} />
          </TouchableOpacity>
     </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '15%',
    paddingLeft: 12,
  },
  text: {
    flex: 1,
    width: '85%',
    color: '#ff7f50',
    fontFamily: 'notoserif',
    fontSize: 30,
    textAlign: 'center',
    paddingLeft: 60
  },
  icon: {
  },
})