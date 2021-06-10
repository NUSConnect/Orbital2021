import React from "react";
import { Animated, StyleSheet } from "react-native";
import RNActionButton from "react-native-action-button";

RNActionButton.prototype.animateButton = function (animate = true) {
    if (this.state.active) return this.reset();

    if (animate) {
        Animated.spring(this.anim, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    } else {
        this.anim.setValue(1);
    }

    this.setState({ active: true, resetToken: this.state.resetToken });
};

RNActionButton.prototype.reset = function (animate = true) {
    if (this.props.onReset) this.props.onReset();

    if (animate) {
        Animated.spring(this.anim, {
            toValue: 0,
            useNativeDriver: false,
        }).start();
    } else {
        this.anim.setValue(0);
    }

    setTimeout(() => {
        if (this.mounted) {
            this.setState({ active: false, resetToken: this.state.resetToken });
        }
    }, 250);
};

export default function ActionButton({ props }) {
    return <RNActionButton buttonColor="#2e64e5">{props}</RNActionButton>;
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: "white",
    },
});