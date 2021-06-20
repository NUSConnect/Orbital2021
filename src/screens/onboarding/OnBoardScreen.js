import React from 'react'
import { Image, StyleSheet } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'
import DoneButton from '../../components/DoneButton'
import NextButton from '../../components/NextButton'
import SkipButton from '../../components/SkipButton'

export default function OnBoardScreen ({ navigation }) {
  return (
    <Onboarding
      controlStatusBar={false}
      containerStyles={{ height: '100%' }}
      SkipButtonComponent={SkipButton}
      NextButtonComponent={NextButton}
      DoneButtonComponent={DoneButton}
            // replace
      onSkip={() => navigation.replace('AuthLoadingScreen')}
      onDone={() => navigation.replace('AuthLoadingScreen')}
      pages={[
        {
          backgroundColor: '#a6ffcc',
          image: (
            <Image
              source={require('../../assets/onboarding-img1.png')}
            />
          ),
          title: 'A Portal To The World',
          subtitle: 'A New Way To Connect'
        },
        {
          backgroundColor: '#fff29e',
          image: (
            <Image
              source={require('../../assets/onboarding-img2.png')}
            />
          ),
          title: 'Connect With People Like You',
          subtitle: 'Get To Know People With Similar Interests'
        },
        {
          backgroundColor: '#ffb34d',
          image: (
            <Image
              source={require('../../assets/onboarding-img3.png')}
            />
          ),
          title: 'Share Your Thoughts',
          subtitle: 'Interact with Communities And Create Your Own'
        }
      ]}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
