import React from "react"
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  CheckBox,
  Switch,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView
} from "react-native"

export default class CheckList extends React.Component {
  constructor(props) {
    super();
    this.state = { value: props.item, checked: false };
  }

  componentDidMount () {
    this.setState({ checked: this.props.checked })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item)
      this.setState({ ...this.state, value: nextProps.item, checked: false });
  }
  _handleCheckBoxClick = e => {
    this.props.selectItem(this.state.checked, this.props.item)
    this.setState({
      checked: !this.state.checked
    });
  };

  render() {
    /** RENDER  **/
    let text = this.state.checked ? (
      <Text>{this.state.value}</Text>
    ) : (
      this.state.value
    );
    let checked = this.state.checked ? "checked" : "";
    return (
      <View id="list" style={styles.widgetUl}>
        <View
          className="main"
          style={styles.main}
          style={{ flex: 11, flexBasis: 250, flexDirection: "row" }}
        >
          {Platform.OS === "android" ? (
            <CheckBox
              style={{ marginLeft: 5 }}
              onValueChange={this._handleCheckBoxClick}
              value={this.state.checked}
            />
          ) : (
            <Switch
              onValueChange={this._handleCheckBoxClick}
              value={this.state.checked}
            />
          )}

          <Text style={styles.textBd}>{text}</Text>
        </View>
      </View>
    );
  }
  componentWillUnmount() {}
}

const styles = StyleSheet.create({
  widgetUlX: {
    padding: 0,
    margin: 0,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    alignItems: "center"
  },
  widgetUl: {
    paddingVertical: 8,
    width: '50%',
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    alignItems: "center"
  },
  textBd: {
    fontSize: 20
  },
  main: {
    flex: 1,
    flexBasis: 250,
    padding: 10
  },
})