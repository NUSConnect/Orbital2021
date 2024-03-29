import React from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from 'react-native-vector-icons'

const CreateComment = ({ onPress, setComment, comment, setIsFocused, isFocused }) => {
  const textInputRef = React.useRef()

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        ref={textInputRef}
        placeholder='Add a comment'
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={setComment}
        maxLength={2000}
        autoCorrect={false}
        value={comment}
        multiline
      />
      <TouchableOpacity
        onPress={() => {
          textInputRef.current.blur()
          onPress()
        }}
        testID='send'
      >
        <Ionicons name='send' size={25} color='#79D2E6' />
      </TouchableOpacity>
    </View>
  )
}

export default CreateComment

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    paddingHorizontal: 5,
    elevation: 3
  },
  textInput: {
    flex: 1,
    margin: 5,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16
  }
})
