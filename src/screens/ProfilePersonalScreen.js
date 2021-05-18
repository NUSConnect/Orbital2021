import React, { Component } from 'react';
import { StyleSheet,Text,View, Image, SafeAreaView } from 'react-native';
import { User } from '../api/auth'
import Button from '../components/Button';
import { theme } from '../core/theme';
import firebase from 'firebase/app';

export default function ProfilePersonalScreen() {
    return (
    <SafeAreaView>
      <View style={styles.container}>
         <View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar}
                  source={require('../assets/logo.png')}/>

                <Text style={styles.name}>{firebase.auth().currentUser.displayName}</Text>
                <Text style={styles.userInfo}>{firebase.auth().currentUser.email}</Text>
            </View>
         </View>

         <View style={styles.body}>
            <Button mode="contained">
               Settings
            </Button>

            <Button mode="contained">
               Test
            </Button>
         </View>
      </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: theme.colors.surface,
  },
  header:{
    backgroundColor: "#DCDCDC",
  },
  headerContent:{
    padding:30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
  },
  name:{
    fontSize:22,
    color:"#000000",
    fontWeight:'600',
  },
  userInfo:{
    fontSize:16,
    color:"#778899",
    fontWeight:'600',
  },
  body:{
    backgroundColor: "#778899",
    height:500,
    alignItems:'center',
  },
  item:{
    flexDirection : 'row',
  },
  infoContent:{
    flex:1,
    alignItems:'flex-start',
    paddingLeft:5
  },
  iconContent:{
    flex:1,
    alignItems:'flex-end',
    paddingRight:5,
  },
  icon:{
    width:30,
    height:30,
    marginTop:20,
  },
  info:{
    fontSize:18,
    marginTop:20,
    color: "#FFFFFF",
  }
});