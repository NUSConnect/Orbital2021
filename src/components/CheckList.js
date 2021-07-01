import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  CheckBox,
  Switch,
  Platform
} from 'react-native'

export default class CheckList extends React.Component {
  constructor (props) {
    super()
    this.state = { value: props.item, checked: false }
  }

  componentDidMount () {
    this.setState({ checked: this.props.checked })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.item !== this.props.item) { this.setState({ ...this.state, value: nextProps.item, checked: false }) }
  }

  handleCheckBoxClick = e => {
    this.props.selectItem(this.state.checked, this.props.item)
    this.setState({
      checked: !this.state.checked
    })
  };

  render () {
    const text = this.state.checked
      ? (
        <Text>{this.state.value}</Text>
        )
      : (
          this.state.value
        )
    return (
      <View id='list' style={styles.widgetUl}>
        <View
          className='main'
          style={styles.main}
        >
          {Platform.OS === 'android'
            ? (
              <CheckBox
                style={{ marginLeft: 5 }}
                onValueChange={this.handleCheckBoxClick}
                value={this.state.checked}
              />
              )
            : (
              <Switch
                onValueChange={this.handleCheckBoxClick}
                value={this.state.checked}
              />
              )}

          <Text style={styles.textBd}>{text}</Text>
        </View>
      </View>
    )
  }

  componentWillUnmount () {}
}

const styles = StyleSheet.create({
  widgetUlX: {
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  widgetUl: {
    paddingVertical: 8,
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textBd: {
    fontSize: 20
  },
  main: {
    flex: 11,
    flexBasis: 250,
    flexDirection: 'row'
  }
})
