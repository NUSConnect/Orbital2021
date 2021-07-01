import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, LayoutAnimation, FlatList } from 'react-native'
import CheckList from './CheckList'

export default function Collapsible ({ header, data, items, setItems, selectItem }) {
  const [open, setOpen] = useState(false)

  const  onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpen(!open)
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.item} testID='collapsible'>
        <Text style={open ? styles.openedText : styles.closedText}>{header}</Text>
        {open && (
          <FlatList
            style={styles.list}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            numColumns={2}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <CheckList
                checked={items.includes(item)}
                item={item}
                selectItem={selectItem(items, setItems)}

              />
            )}
          />
        )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'orange',
    borderColor: 'white'
  },
  openedText: {
    color: 'white',
    fontSize: 24,
    paddingLeft: 10,
    paddingTop: 10
  },
  closedText: {
    color: 'white',
    fontSize: 24,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  list: {
    marginTop: 20,
    width: '100%',
    backgroundColor: 'white'
  }
})
