import * as React from 'react'
import ProfileView from '../components/ProfileView'
import UserPostView from '../components/UserPostView'
import UserCommentView from '../components/UserCommentView'
import ForumPostView from '../components/ForumPostView'
import ForumCommentView from '../components/ForumCommentView'

export const REPORTS_CATEGORY = {
  users: {
    title: 'Reported Users',
    quickView: function (item, navigation) { return (<ProfileView item={item} navigation={navigation} />) }
  },
  userPosts: {
    title: 'Reported User Posts',
    quickView: function (item, navigation) { return (<UserPostView item={item} navigation={navigation} />) }
  },
  userComments: {
    title: 'Reported User Comments',
    quickView: function (item, navigation) { return (<UserCommentView item={item} navigation={navigation} />) }
  },
  forumPosts: {
    title: 'Reported Forum Posts',
    quickView: function (item, navigation) { return (<ForumPostView item={item} navigation={navigation} />) }
  },
  forumComments: {
    title: 'Reported Forum Comments',
    quickView: function (item, navigation) { return (<ForumCommentView item={item} navigation={navigation} />) }
  }
}
