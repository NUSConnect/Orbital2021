import React, { useEffect, useState } from 'react'
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import SearchBar from '../../components/SearchBar'
import { sortByName } from '../../api/ranking'

export default function MajorsSearchScreen ({ props, navigation }) {
  const [search, setSearch] = useState('')
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [masterDataSource, setMasterDataSource] = useState([])
  const [filtered, setFiltered] = useState(false)

  const majors = [
    { name: 'Business Administration (Accountancy)' },
    { name: 'Business Administration' },
    { name: 'Data Science and Economics' },
    { name: 'Food Science and Technology' },
    { name: 'Humanities and Sciences' },
    { name: 'Pharmaceutical Science' },
    { name: 'Philosophy, Politics, Economics' },
    { name: 'Business Analytics' },
    { name: 'Computer Science' },
    { name: 'Information Security' },
    { name: 'Information Systems' },
    { name: 'Computer Engineering' },
    { name: 'Architecture' },
    { name: 'Industrial Design' },
    { name: 'Landscape Architecture' },
    { name: 'Project and Facilities Management' },
    { name: 'Real Estate' },
    { name: 'Biomedical Engineering' },
    { name: 'Chemical Engineering' },
    { name: 'Civil Engineering' },
    { name: 'Engineering Science' },
    { name: 'Environmental Engineering' },
    { name: 'Electrical Engineering' },
    { name: 'Industrial and System Engineering' },
    { name: 'Material Science and Engineering' },
    { name: 'Mechanical Engineering' },
    { name: 'Dentistry' },
    { name: 'Law' },
    { name: 'Medicine' },
    { name: 'Nursing' },
    { name: 'Pharmacy' },
    { name: 'Music' }
  ]

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
      <Text
        style={styles.itemStyle}
        onPress={() =>
          navigation.navigate('FilteredMajorScreen', {
            major: item.name
          })}
      >
        {item.name}
      </Text>
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
    majors.sort(sortByName)
    setMasterDataSource(majors)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  itemStyle: {
    padding: 10,
    fontSize: 20
  }
})
