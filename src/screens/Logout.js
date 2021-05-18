import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { logoutUser } from '../api/auth'

// currently unused

export default function Logout() {
  return (
    <Background>
      <Logo />
      <Header>Let’s start</Header>
      <Paragraph>
        Main page
      </Paragraph>
      <Button mode="outlined" onPress={logoutUser}>
        Logout
      </Button>
    </Background>
  );
}