import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

export default function SubForumHeader ({
  title,
  forumId,
  navigation,
  isSubscribed,
  subscribe,
  isAdmin
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.4}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name='arrow-back'
          color='#79D2E6'
          size={38}
          style={styles.icon}
        />
      </TouchableOpacity>
      <View style={styles.title}>
        <Text style={styles.text} numberOfLines={2}>{title}</Text>
      </View>
      <Menu style={styles.centerAlign}>
        <MenuTrigger>
          <Ionicons name='chevron-down' size={38} color='#79D2E6' style={styles.moreOptions} />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => navigation.navigate('ForumAddPostScreen', { forumId })}>
            <View style={styles.menuItems}>
              <MaterialCommunityIcons name='plus-thick' size={30} color='#79D2E6' />
              <Text style={styles.menuText}>Add Post</Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={() => navigation.navigate('SubForumInfoScreen', { forumName: title, forumId: forumId })}>
            <View style={styles.menuItems}>
              <MaterialIcons name='info' size={30} color='#79D2E6' />
              <Text style={styles.menuText}>Forum Info</Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={() => subscribe()}>
            <View style={styles.menuItems}>
              <MaterialIcons name='star' size={30} color={isSubscribed ? 'gold' : 'darkgray'} />
              <Text style={styles.menuText}>Favourite</Text>
            </View>
          </MenuOption>
          {isAdmin === true
            ? (
              <MenuOption onSelect={() => navigation.navigate('SubforumViewReportScreen', { forumName: title, forumId: forumId })}>
                <View style={styles.menuItems}>
                  <MaterialCommunityIcons name='shield-check' size={30} color='#79D2E6' />
                  <Text style={styles.menuText}>Manage Forum</Text>
                </View>
              </MenuOption>
              )
            : (null)}
          <MenuOption onSelect={() => console.log('cancel')}>
            <View style={styles.menuItems}>
              <MaterialIcons name='cancel' size={30} color='#79D2E6' />
              <Text style={styles.menuText}>Cancel</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: '15%',
    paddingLeft: 12
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 30,
    paddingRight: 30
  },
  text: {
    color: '#ff7f50',
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
    flexWrap: 'wrap'
  },
  icon: {},
  moreOptions: {
    marginRight: 10
  },
  menuText: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 4
  },
  menuItems: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
