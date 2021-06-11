import React from "react";
import { logoutUser } from "../api/auth";
import Background from "../components/Background";
import Button from "../components/Button";
import Header from "../components/Header";
import Logo from "../components/Logo";
import Paragraph from "../components/Paragraph";

// currently unused

export default function Logout() {
    return (
        <Background>
            <Logo />
            <Header>Let’s start</Header>
            <Paragraph>Main page</Paragraph>
            <Button mode="outlined" onPress={logoutUser}>
                Logout
            </Button>
        </Background>
    );
}