import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native'
import CommentScreen from '../home/CommentScreen'
import ForumPostScreen from '../forum/ForumPostScreen'
import AccountSettingsScreen from './AccountSettingsScreen'
import AddBioScreen from './AddBioScreen'
import AddFacultyScreen from './AddFacultyScreen'
import BusinessMajorsScreen from './BusinessMajorsScreen'
import ChangeNameScreen from './ChangeNameScreen'
import ChangePasswordScreen from './ChangePasswordScreen'
import CHSMajorsScreen from './CHSMajorsScreen'
import ComputingMajorsScreen from './ComputingMajorsScreen'
import DesignMajorsScreen from './DesignMajorsScreen'
import DummyScreen from './DummyScreen'
import EngineeringMajorsScreen from './EngineeringMajorsScreen'
import ProfilePersonalScreen from './ProfilePersonalScreen'
import ProfilePostsScreen from './ProfilePostsScreen'
import UpdateEmailScreen from './UpdateEmailScreen'
import MatchHistoryScreen from './MatchHistoryScreen'
import EditPostScreen from '../home/EditPostScreen'
import ChatScreen from '../home/ChatScreen'
import ViewProfileScreen from './ViewProfileScreen'
import GroupInfoScreen from '../home/GroupInfoScreen'
import EditGroupScreen from '../home/EditGroupScreen'
import FollowersScreen from './FollowersScreen'
import FollowingScreen from './FollowingScreen'
import RequestedFollowersScreen from './RequestedFollowersScreen'
import PrivacySettingsScreen from './PrivacySettingsScreen'
import ManageFollowersScreen from './ManageFollowersScreen'
import SuperAdminScreen from './SuperAdminScreen'
import ViewReportsScreen from './ViewReportsScreen'
import UnrestrictedViewProfileScreen from './viewReports/UnrestrictedViewProfileScreen'
import ReportsListScreen from './viewReports/ReportsListScreen'
import ReportDetailScreen from './viewReports/ReportDetailScreen'
import MatchMeControlScreen from './MatchMeControlScreen'
import PromoteAdminOptionsScreen from './PromoteAdminOptionsScreen'
import PromoteSuperAdminScreen from './PromoteSuperAdminScreen'
import DemoteSuperAdminScreen from './DemoteSuperAdminScreen'
import ManageForumAdminsScreen from './ManageForumAdminsScreen'
import ForumAdminSelectionScreen from './ForumAdminSelectionScreen'
import ForumAdminViewReportScreen from './ForumAdminViewReportScreen'
import ForumReportsListScreen from './viewReports/ForumReportsListScreen'
import ForumAdminForumsScreen from './ForumAdminForumsScreen'
import ForumAdminManagementScreen from './ForumAdminManagementScreen'
import HandleReportActionsScreen from './HandleReportActionsScreen'
import BannedUsersScreen from './BannedUsersScreen'

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

function ProfileHomeTabs () {
  return (
    <Tab.Navigator
      tabBarOptions={{
        pressColor: '#ffa500',
        pressOpacity: 'ffa500',
        indicatorStyle: { backgroundColor: '#ff8c00' },
        labelStyle: { fontSize: 14 }
      }}
    >
      <Tab.Screen name='Personal' component={ProfilePersonalScreen} />
      <Tab.Screen name='Posts' component={ProfilePostsScreen} />
      <Tab.Screen name='Matches' component={MatchHistoryScreen} />
    </Tab.Navigator>
  )
}

const ProfileMasterScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='ProfileHomeTabs'
          component={ProfileHomeTabs}
        />
        <Stack.Screen
          name='AccountSettingsScreen'
          component={AccountSettingsScreen}
        />
        <Stack.Screen name='DummyScreen' component={DummyScreen} />
        <Stack.Screen name='UpdateEmailScreen' component={UpdateEmailScreen} />
        <Stack.Screen name='AddFacultyScreen' component={AddFacultyScreen} />
        <Stack.Screen name='BusinessMajorsScreen' component={BusinessMajorsScreen} />
        <Stack.Screen name='CHSMajorsScreen' component={CHSMajorsScreen} />
        <Stack.Screen name='ComputingMajorsScreen' component={ComputingMajorsScreen} />
        <Stack.Screen name='DesignMajorsScreen' component={DesignMajorsScreen} />
        <Stack.Screen name='EngineeringMajorsScreen' component={EngineeringMajorsScreen} />
        <Stack.Screen name='AddBioScreen' component={AddBioScreen} />
        <Stack.Screen name='CommentScreen' component={CommentScreen} />
        <Stack.Screen name='ForumPostScreen' component={ForumPostScreen} />
        <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
        <Stack.Screen name='ChangeNameScreen' component={ChangeNameScreen} />
        <Stack.Screen name='EditPostScreen' component={EditPostScreen} />
        <Stack.Screen name='ViewProfileScreen' component={ViewProfileScreen} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} />
        <Stack.Screen name='GroupInfoScreen' component={GroupInfoScreen} />
        <Stack.Screen name='EditGroupScreen' component={EditGroupScreen} />
        <Stack.Screen name='FollowersScreen' component={FollowersScreen} />
        <Stack.Screen name='FollowingScreen' component={FollowingScreen} />
        <Stack.Screen name='RequestedFollowersScreen' component={RequestedFollowersScreen} />
        <Stack.Screen name='PrivacySettingsScreen' component={PrivacySettingsScreen} />
        <Stack.Screen name='ManageFollowersScreen' component={ManageFollowersScreen} />
        <Stack.Screen name='SuperAdminScreen' component={SuperAdminScreen} />
        <Stack.Screen name='ViewReportsScreen' component={ViewReportsScreen} />
        <Stack.Screen name='UnrestrictedViewProfileScreen' component={UnrestrictedViewProfileScreen} />
        <Stack.Screen name='ReportsListScreen' component={ReportsListScreen} />
        <Stack.Screen name='ReportDetailScreen' component={ReportDetailScreen} />
        <Stack.Screen name='MatchMeControlScreen' component={MatchMeControlScreen} />
        <Stack.Screen name='PromoteAdminOptionsScreen' component={PromoteAdminOptionsScreen} />
        <Stack.Screen name='PromoteSuperAdminScreen' component={PromoteSuperAdminScreen} />
        <Stack.Screen name='DemoteSuperAdminScreen' component={DemoteSuperAdminScreen} />
        <Stack.Screen name='ManageForumAdminsScreen' component={ManageForumAdminsScreen} />
        <Stack.Screen name='ForumAdminSelectionScreen' component={ForumAdminSelectionScreen} />
        <Stack.Screen name='ForumAdminViewReportScreen' component={ForumAdminViewReportScreen} />
        <Stack.Screen name='ForumReportsListScreen' component={ForumReportsListScreen} />
        <Stack.Screen name='ForumAdminForumsScreen' component={ForumAdminForumsScreen} />
        <Stack.Screen name='ForumAdminManagementScreen' component={ForumAdminManagementScreen} />
        <Stack.Screen name='HandleReportActionsScreen' component={HandleReportActionsScreen} />
        <Stack.Screen name='BannedUsersScreen' component={BannedUsersScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#000000'
  }
})

export default ProfileMasterScreen
