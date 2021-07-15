import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import HeaderTopBar from '../../components/HeaderTopBar'
import Button from '../../components/Button'

export default function SubforumViewReportScreen ({ navigation, route }) {
  const { forumId, forumName } = route.params
  return (
    <View>
      <HeaderTopBar
        onPress={() => navigation.goBack()}
        title={forumName}
      />
      <View style={styles.buttonwrap}>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('SubforumReportsListScreen', { category: 'forumPosts', subforumId: forumId, subforumName: forumName })}
        >
          forum posts
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('SubforumReportsListScreen', { category: 'forumComments', subforumId: forumId, subforumName: forumName })}
        >
          forum comments
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('EditSubforumInfoScreen', { forumName: forumName, forumId: forumId })}
        >
          edit forum info
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ForumAdminManagementScreen', { forumName: forumName, forumId: forumId })}
        >
          manage forum admins
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF'
  },
  buttonwrap: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
