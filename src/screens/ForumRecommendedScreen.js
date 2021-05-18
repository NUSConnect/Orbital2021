import React, { useState, useEffect } from 'react';
import {
  Text, Image, View, FlatList, SafeAreaView, StyleSheet, StatusBar, RefreshControl, TouchableOpacity
} from 'react-native';
import ForumCreationScreen from './ForumCreationScreen';

export default class ForumRecommendedScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: true,
        }
    }

    componentDidMount() {
        this.fetchCats();
    }

    fetchCats() {
        this.setState({ refreshing: true });
        fetch('https://api.thecatapi.com/v1/images/search?limit=10&page=1')
            .then(res => res.json())
            .then(resJson => {
                this.setState({ data: resJson });
                this.setState({ refreshing: false });
            }).catch(e => console.log(e));
    }

    renderItemComponent = (data) =>
        <TouchableOpacity style={styles.container}>
            <Image style={styles.image} source={{ uri: data.item.url }} />
        </TouchableOpacity>

    ItemSeparator = () => <View style={{
        height: 2,
        backgroundColor: "rgba(0,0,0,0.5)",
        marginLeft: 10,
        marginRight: 10,
    }}
    />

    handleRefresh = () => {
        this.setState({ refreshing: false }, () => { this.fetchCats() });
    }

    render() {
      const { navigation } = this.props;
      return (
        <SafeAreaView>
          <Text style={styles.createForum}>
            Can't find what you're looking for?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate('ForumCreationScreen')}>
                <Text style={styles.buttonText}>
                  CREATE A NEW FORUM
                </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.data}
            renderItem={item => this.renderItemComponent(item)}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={this.ItemSeparator}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        </SafeAreaView>)
    }
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 6,
  },
  createForum: {
    fontSize: 20,
    color: '#000000',
    paddingLeft: 20,
    paddingTop: 10,
  },
  image: {
    height: '100%',
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  buttonStyle: {
    height: 50,
    backgroundColor: '#6495ed',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    padding: 10,
  },
});
