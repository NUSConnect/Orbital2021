import * as firebase from 'firebase'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import HeaderTopBar from '../../../components/HeaderTopBar'
import { REPORTS_CATEGORY } from '../../../core/reports'

const DeviceWidth = Dimensions.get('window').width

export default function ReportDetailScreen ({ props, route, navigation }) {
  const { category, item } = route.params
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)

  const quickViewer = REPORTS_CATEGORY[category].quickView

  const getReports = async () => {
    const reports = []

    await firebase
      .firestore()
      .collection('reports')
      .doc(category)
      .collection('reported')
      .doc(item.id)
      .collection('reporters')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          const { reason } = documentSnapshot.data()
          reports.push({
            id: documentSnapshot.id,
            reason: reason
          })
        })
      })

    setReports(reports)
    setLoading(false)
  }

  const ItemView = ({ item }) => {
    return (
    // Flat List Item
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('UnrestrictedViewProfileScreen', { itemId: item.id })}
      >
        <View style={styles.itemContainer2}>
          <Text
            style={styles.userId}
          >
            userId: {item.id}
          </Text>
          <Text
            style={styles.reason}
          >
            Reason: {item.reason}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const ItemSeparatorView = () => {
    return (
    // Flat List Item Separator
      <View
        style={{
          height: 5,
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
      <FlatList
        data={reports}
        ListHeaderComponent={quickViewer(item, navigation)}
        ListHeaderComponentStyle={styles.headerComponentStyle}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
        contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HandleReportActionsScreen', { item, itemId: item.id, category })}
          >
            <Text style={styles.buttonText}>
              Handle Report
            </Text>
          </TouchableOpacity>
        }
        ListFooterComponentStyle={styles.footerComponentStyle}
        style={{ marginBottom: 2 }}
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
    width: '95%',
    height: 82,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20
  },
  itemContainer2: {
    padding: 20
  },
  userId: {
    fontSize: 18
  },
  reason: {
    fontSize: 18
  },
  footerComponentStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10
  },
  button: {
    height: 50,
    width: DeviceWidth * 0.5,
    backgroundColor: 'darkorange',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white'
  }
})
