import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet,Text,View, Image, SafeAreaView } from 'react-native';
import { logoutUser } from '../../api/auth'
import Button from '../../components/Button';
import { theme } from '../../core/theme';
import * as firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AccountSettingsScreen from './AccountSettingsScreen';
import * as ImagePicker from 'expo-image-picker';

export default class ProfilePersonalScreen extends React.Component {
    state = {
            imagePath: require("../../assets/placeholder.png"),
            uploaded: false,
            status: '',
            imageURL: ''
        }

    static navigationOptions = {
        header: null,
      };

      onChooseImagePress = async () => {
        //let result = await ImagePicker.launchCameraAsync();
        let result = await ImagePicker.launchImageLibraryAsync();

        if (!result.cancelled) {
          this.uploadImage(result.uri, firebase.auth().currentUser.uid)
            .then(() => {
              console.log("Success");
              this.setState()
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }

      uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("profile/" + imageName);
        this.setState({ imagePath:"profile/" + imageName });
        console.log(this.state.imagePath);
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({ userImg:this.state.imagePath })
        return ref.put(blob);
      }

      getURI(imagePath) {
          let imgSource = imagePath;
          if (isNaN(imagePath)) {
             imgSource = firebase.storage().ref().child(imagePath).getDownloadURL();
          }
          return imgSource;
      }

    render() {
    let { imagePath } = this.state;
    let imgSource = this.getURI(imagePath);
    console.log(imgSource);
    return (
    <SafeAreaView>

      <View style={styles.container}>
         <View style={styles.header}>
            <View style={styles.headerContent}>
            <Image source={imgSource} />
            <Button title="Choose image..." onPress={this.onChooseImagePress}>
                Upload profile picture
            </Button>
            <Text style={styles.name}>{firebase.auth().currentUser.displayName}</Text>
            <Text style={styles.userInfo}>{firebase.auth().currentUser.email}</Text>
         </View>
      </View>

         <View style={styles.body}>
            <Button style = {styles.accountset}
            mode="outlined" onPress={() => this.props.navigation.navigate('AccountSettingsScreen')} >
                Account Settings
            </Button>

            <Button style = {styles.logout}
            mode="outlined" onPress={logoutUser}>
                Logout
            </Button>
         </View>
      </View>
      </SafeAreaView>
    );
    }
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
    backgroundColor: "#FFFAFA",
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
  },
  accountset: {
    backgroundColor:'#add8e6'
  },
  logout: {
    backgroundColor: '#add8e6'
  },
});