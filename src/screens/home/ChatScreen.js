import React from "react";
import {View, Text , StyleSheet, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { GiftedChat, Message, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fire from "../Database";

export default class ChatScreen extends React.Component{

    state = {
        messages: []
    }


    //this function is used to obtain the user detailes to the chat
    get user(){
        return{
            _id: Fire.uid,
            name: this.props.route.params.name
        }
    }


    // here we obtain the data from the fire base db and apend it to the imported gited chat body
    componentDidMount(){
        Fire.get(message =>
            this.setState(previous =>({
            messages: GiftedChat.append(previous.messages,message)
        })))
    }

    componentWillUnmount(){
        Fire.off();
    }

     onSend = (messages = []) => {
        this.setState( { messages: (previousMessages) =>
          GiftedChat.append(previousMessages, messages)}
        );
      }

     renderSend = (props) => {
        return (
          <Send {...props}>
            <View>
              <MaterialCommunityIcons
                name="send-circle"
                style={{marginBottom: 5, marginRight: 5}}
                size={32}
                color="#2e64e5"
              />
            </View>
          </Send>
        );
      };

     renderBubble = (props) => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#2e64e5',
              },
            }}
            textStyle={{
              right: {
                color: '#fff',
              },
            }}
          />
        );
      };

     scrollToBottomComponent = () => {
        return(
          <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
      }

    render(){
        return (
                <GiftedChat
                  messages={this.state.messages}
                  onSend={(message) => this.onSend(message)}
                  user={{
                    _id: 1,
                  }}
                  renderBubble={this.renderBubble}
                  alwaysShowSend
                  renderSend={this.renderSend}
                  scrollToBottom
                  scrollToBottomComponent={this.scrollToBottomComponent}
                />
              );
    }
}