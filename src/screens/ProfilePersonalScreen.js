import React, { Component } from 'react';
import { StyleSheet,Text,View, Image } from 'react-native';
import Button from '../components/Button';
import { theme } from '../core/theme';

export default function ProfilePersonalScreen() {
    return (
      <View style={styles.container}>
         <View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar}
                  source={require('../assets/logo.png')}/>

                <Text style={styles.name}>Name</Text>
                <Text style={styles.userInfo}>email</Text>
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