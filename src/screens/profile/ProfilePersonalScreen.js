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
            defaultUri: null,
            userData: null,
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
          const userId = firebase.auth().currentUser.uid
          const imagePath = 'profile/' + userId;

          this.uploadImage(result.uri, imagePath)
            .then(async () => {
              console.log("Success");
              const url = await firebase.storage().ref().child(imagePath).getDownloadURL();
              firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({ userImg:url });
              this.getUser();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }

      uploadImage = async (uri, imagePath) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref(imagePath);

        return ref.put(blob);
      }

      getUser = async () => {
        await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get().
        then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            console.log('User Data', documentSnapshot.data());
            this.setState({ userData: documentSnapshot.data() });
          }
        })

//        if (!this.state.userData.userImg) {
//          this.setState({ imageUri: this.state.userData.userImg })
//        };
      }

    componentDidMount() {
        this.getUser();
        const uri = firebase.storage().ref('profile/placeholder.png').getDownloadURL();
        this.setState({ defaultUri: uri });
    }

    render() {
    console.log(this.state.imageUri);

    return (
    <SafeAreaView>

      <View style={styles.container}>
         <View style={styles.header}>
            <View style={styles.headerContent}>
            <Image source={{ uri: this.state.userData ? this.state.userData.userImg ||
                this.state.defaultUri : this.state.defaultUri }} />
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