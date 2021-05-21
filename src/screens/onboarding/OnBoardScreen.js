import React from 'react';
import SkipButton from '../../components/SkipButton';
import DoneButton from '../../components/DoneButton';
import NextButton from '../../components/NextButton';
import Dots from '../../components/Dots';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

export default function OnBoardScreen({navigation}) {
    return (
        <Onboarding
        SkipButtonComponent={SkipButton}
        NextButtonComponent={NextButton}
        DoneButtonComponent={DoneButton}
        DotComponent={Dots}
        //replace
        onSkip={() => navigation.replace("StartScreen")}
        onDone={() => navigation.navigate("StartScreen")}
        pages={[
          {
            backgroundColor: '#a6ffcc',
            image: <Image source={require('../../assets/onboarding-img1.png')} />,
            title: 'Connect to the World',
            subtitle: 'A New Way To Connect With The World',
          },
          {
            backgroundColor: '#fff29e',
            image: <Image source={require('../../assets/onboarding-img2.png')} />,
            title: 'Share Your Favorites',
            subtitle: 'Share Your Thoughts With Similar Kind of People',
          },
          {
            backgroundColor: '#ffb34d',
            image: <Image source={require('../../assets/onboarding-img3.png')} />,
            title: 'Become The Star',
            subtitle: "Let The Spot Light Capture You",
          },
        ]}
      />
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});