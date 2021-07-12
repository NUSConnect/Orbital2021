import React from 'react'
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default class ForumOthersScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      refreshing: true
    }
  }

    renderItemComponent = (data) => (
      <TouchableOpacity style={styles.container}>
        <Image style={styles.image} source={{ uri: data.item.url }} />
      </TouchableOpacity>
    );

    ItemSeparator = () => (
      <View
        style={{
          height: 2,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginLeft: 10,
          marginRight: 10
        }}
      />
    );

    handleRefresh = () => {
      this.setState({ refreshing: false }, () => {
        this.fetchCats()
      })
    };

    render () {
      const { navigation } = this.props
      return (
        <SafeAreaView>
          <Text style={styles.createForumHeader}>
            Portal Opening Guidelines
          </Text>
          <Text style={styles.createForum}>
            1. Check for duplicates before creation. If the portal you want to open is very similar to existing ones,
            try messaging an existing portal admin for admin status.
          </Text>
          <Text style={styles.createForum}>
            2. Avoid using inappropriate names or images when trying to open a new portal.
          </Text>
          <Text style={styles.createForum}>
            3. At Portal.io, we believe in forging inclusive communities. Do not open portals which aim to sow discord.
          </Text>
          <Text style={styles.createForum}>
            4. Do not engage in illegal activities using the portals.
          </Text>
          <Text style={styles.createForum}>
            5. Do not publicly share personal information.
          </Text>
          <Text />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() =>
                navigation.navigate('ForumCreationScreen')}
            >
              <Text style={styles.buttonText}>
                OPEN A NEW PORTAL
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 6
  },
  createForumHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'darkslategrey',
    paddingLeft: 20,
    paddingTop: 10,
    paddingRight: 20
  },
  createForum: {
    fontSize: 18,
    color: 'darkslategrey',
    paddingLeft: 20,
    paddingTop: 10,
    paddingRight: 20
  },
  image: {
    height: '100%',
    borderRadius: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    paddingTop: 4
  },
  buttonStyle: {
    height: 50,
    backgroundColor: '#79D2E6',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: 50
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    padding: 10
  }
})
