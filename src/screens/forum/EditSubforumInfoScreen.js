import * as ImagePicker from 'expo-image-picker'
import * as firebase from 'firebase'
import React from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CancelButton from '../../components/CancelButton'
import SubmitButton from '../../components/SubmitButton'
import Button from '../../components/Button'
import { textChecker } from '../../api/textChecker'

export default class EditSubforumInfoScreen extends React.Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      nameText: '',
      descriptionText: '',
      image: 'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/forum%2FWELCOME.png?alt=media&token=eb0f815b-0e18-4eca-b5a6-0cc170b0eb51',
      uploading: false,
      transferred: 0
    }
  }

  componentDidMount () {
    this.getForumInfo()
  }

  getForumInfo = async () => {
    await firebase
      .firestore()
      .collection('forums')
      .doc(this.props.route.params.forumId)
      .get()
      .then(documentSnapshot => this.setState({
        image: documentSnapshot.data().forumImg,
        nameText: documentSnapshot.data().forumName,
        descriptionText: documentSnapshot.data().forumDescription
      }))
  }

    handleChoosePhotoFromLibrary = async () => {
      const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!')
        return
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1]
      })
      console.log(pickerResult)

      if (pickerResult.cancelled === true) {
        return
      }

      this.setState({ image: pickerResult.uri })
    };

    submitPost = async (goBack) => {
      Alert.alert(
        'Edit portal info',
        'Are you sure?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed!'),
            style: 'cancel'
          },
          {
            text: 'Confirm',
            onPress: () => this.handleSubmit(goBack)
          }
        ],
        { cancelable: false }
      )
    };

    handleSubmit = async (navigator) => {
      const imageUrl = await this.uploadImage()

      await firebase
        .firestore()
        .collection('forums')
        .doc(this.props.route.params.forumId)
        .update({
          forumImg: imageUrl,
          forumName: this.state.nameText,
          forumDescription: this.state.descriptionText
        })
      await firebase
        .firestore()
        .collection('forums')
        .doc(this.props.route.params.forumId)
        .collection('admins')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            firebase
              .firestore()
              .collection('users')
              .doc(documentSnapshot.id)
              .collection('forumAdmin')
              .doc(this.props.route.params.forumId)
              .update({ name: this.state.nameText })
          })
        })
      Alert.alert(
        'Portal info edited!',
        'Info has been successfully updated.',
        [
          {
            text: 'OK',
            onPress: navigator
          }
        ],
        { cancelable: false }
      )
    };

    uploadImage = async () => {
      if (this.state.image == null) {
        return null
      }
      const uploadUri = this.state.image
      const response = await fetch(uploadUri)
      const blob = await response.blob()

      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

      // Add timestamp to File Name
      const extension = filename.split('.').pop()
      const name = this.state.nameText + '_'
      filename = name + Date.now() + '.' + extension

      this.setState({ uploading: true })
      this.setState({ transferred: 0 })

      const storageRef = firebase.storage().ref(`forum/${filename}`)
      const task = storageRef.put(blob)

      // Set transferred state
      task.on('state_changed', (taskSnapshot) => {
        console.log(
                `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
        )

        this.setState({
          transferred:
                    Math.round(
                      taskSnapshot.bytesTransferred / taskSnapshot.totalBytes
                    ) * 100
        })
      })

      try {
        await task

        const url = await storageRef.getDownloadURL()

        this.setState({ uploading: false })
        this.setState({ image: null })

        return url
      } catch (e) {
        console.log(e)
        return null
      }
    };

    render () {
      const { navigation } = this.props
      return (
        <KeyboardAwareScrollView
          style={styles.container}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled
        >
          <Text style={styles.title}>Edit {this.props.route.params.forumName} Info</Text>
          <Text style={styles.subTitle}>Portal Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={this.handleChoosePhotoFromLibrary}>
            <Image
              source={{
                uri: this.state.image
              }}
              style={styles.image}
            />
          </TouchableOpacity>
          <View style={{ marginBottom: -15 }}>
            <Button
              onPress={() => this.setState({ image: 'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/forum%2FWELCOME.png?alt=media&token=eb0f815b-0e18-4eca-b5a6-0cc170b0eb51' })}
            >
              Default Portal Image
            </Button>
          </View>
          <Text style={styles.subTitle}>Name</Text>
          <TextInput
            style={styles.nameInput}
            returnKeyType='next'
            onChangeText={(nameText) => this.setState({ nameText })}
            value={this.state.nameText}
            placeholder='Enter a name'
          />
          <Text style={styles.subTitle}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            onChangeText={(descriptionText) =>
              this.setState({ descriptionText })}
            value={this.state.descriptionText}
            placeholder='Enter a description'
            multiline
          />
          {this.state.uploading
            ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text>
                  {' '}
                  {this.state.transferred} % completed!{' '}
                </Text>
                <ActivityIndicator
                  size='large'
                  color='0000ff'
                />
              </View>
              )
            : (
              <View style={styles.buttons}>
                <CancelButton goBack={() => navigation.goBack()} />
                <View style={styles.space} />
                <SubmitButton
                  goBack={() => {
                    if (textChecker(this.state.nameText) && textChecker(this.state.descriptionText)) {
                      this.submitPost(() => {
                        navigation.goBack()
                        navigation.goBack()
                        navigation.goBack()
                      })
                    } else {
                      Alert.alert(
                        'Missing information',
                        'Please fill in all text boxes.'
                      )
                    }
                  }}
                  string='Edit'
                />
              </View>
              )}
        </KeyboardAwareScrollView>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  title: {
    height: 60,
    lineHeight: 60,
    width: '100%',
    backgroundColor: '#ff8c00',
    color: '#ffffff',
    fontSize: 30,
    paddingLeft: 15
  },
  subTitle: {
    fontSize: 16,
    color: '#000000',
    paddingTop: 10,
    paddingLeft: 20
  },
  nameInput: {
    flex: 0,
    height: 40,
    margin: 12,
    borderWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 10
  },
  descriptionInput: {
    flex: 0,
    height: 60,
    margin: 12,
    borderWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    padding: 10
  },
  reasonInput: {
    flex: 0,
    height: 100,
    margin: 12,
    borderWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    padding: 10
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  space: {
    width: 20
  },
  imageContainer: {
    alignItems: 'center'
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'black'
  }
})
