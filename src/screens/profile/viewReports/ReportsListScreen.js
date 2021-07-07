import * as firebase from 'firebase'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import HeaderTopBar from '../../../components/HeaderTopBar'
import SearchBar from '../../../components/SearchBar'
import { REPORTS_CATEGORY } from '../../../core/reports'

export default function ReportsListScreen ({ props, route, navigation }) {
  const { category } = route.params
  const [search, setSearch] = useState('')
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [masterDataSource, setMasterDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState(false)

  const getReports = async () => {
    const reports = []

    await firebase
      .firestore()
      .collection('reports')
      .doc(category)
      .collection('reported')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          const { timeReported, actionTaken, postId, forumId } = documentSnapshot.data()
          reports.push({
            id: documentSnapshot.id,
            timeReported: timeReported,
            actionTaken: actionTaken,
            postId: postId,
            forumId: forumId
          })
        })
      })

    setMasterDataSource(reports)
    setLoading(false)
  }

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })
      setFiltered(true)
      setFilteredDataSource(newData)
      setSearch(text)
    } else {
      setFilteredDataSource(masterDataSource)
      setSearch(text)
    }
  }

  const ItemView = ({ item }) => {
    return (
    // Flat List Item
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('ReportDetailScreen', { category: category, item: item })}
      >
        <Text
          style={styles.itemText}
        >
          {item.id}
        </Text>
      </TouchableOpacity>
    )
  }

  const ItemSeparatorView = () => {
    return (
    // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8'
        }}
      />
    )
  }

  useEffect(() => {
    getReports()
  }, [])

  if (loading) {
    return <ActivityIndicator />
  }

  return (
    <View style={styles.container}>
      <HeaderTopBar
        title={REPORTS_CATEGORY[category].title}
        onPress={() => navigation.goBack()}
      />
      <SearchBar
        search={search}
        setSearch={setSearch}
        searchFilterFunction={searchFilterFunction}
        resetFilter={() => setFilteredDataSource(masterDataSource)}
      />
      <FlatList
        data={filtered ? filteredDataSource : masterDataSource}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  itemContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center'
  },
  itemText: {
    fontSize: 18,
    padding: 6
  }
})
