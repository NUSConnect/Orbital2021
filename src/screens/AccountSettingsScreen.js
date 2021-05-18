import * as React from 'react';
import { Text, View } from 'react-native';

export default function ForumScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <BackButton goBack={navigation.goBack} />
      <Text>Account settings</Text>
    </View>
  );
}