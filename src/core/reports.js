import * as React from 'react'
import ProfileView from '../components/ProfileView'

// ONLY USER IS DONE, THE REST ARE INCORRECT
export const REPORTS_CATEGORY = {
  users: {
    title: 'Reported Users',
    quickView: function (userId, navigator) { return (<ProfileView itemId={userId} onPress={navigator} />) },
    navigateTo: 'UnrestrictedViewProfileScreen'
  },
  userPosts: {
    title: 'Reported User Posts',
    quickView: function (userId, navigator) { return (<ProfileView itemId={userId} onPress={navigator} />) },
    navigateTo: 'UnrestrictedViewProfileScreen'
  },
  userComments: {
    title: 'Reported User Comments',
    quickView: function (userId, navigator) { return (<ProfileView itemId={userId} onPress={navigator} />) },
    navigateTo: 'UnrestrictedViewProfileScreen'
  },
  forumPosts: {
    title: 'Reported Forum Posts',
    quickView: function (userId, navigator) { return (<ProfileView itemId={userId} onPress={navigator} />) },
    navigateTo: 'UnrestrictedViewProfileScreen'
  },
  forumComments: {
    title: 'Reported Forum Comments',
    quickView: function (userId, navigator) { return (<ProfileView itemId={userId} onPress={navigator} />) },
    navigateTo: 'UnrestrictedViewProfileScreen'
  }
}
