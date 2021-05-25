import * as React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import BackButton from '../../components/BackButton';
import Background from '../../components/Background';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

export default class AccountSettingsScreen extends React.Component {
  constructor(props) {
          super(props);
          this.state = {
              myText: 'Ready to get swiped!',
              gestureName: 'none',
          }
      }

      onSwipeUp(gestureState) {
          this.setState({myText: 'You swiped up!'});
        }

        onSwipeDown(gestureState) {
          this.setState({myText: 'You swiped down!'});
        }

        onSwipeLeft(gestureState) {
          this.setState({myText: 'You swiped left!'});
        }

        onSwipeRight(gestureState) {
          this.setState({myText: 'You swiped right!'});
        }

        onSwipe(gestureName, gestureState) {
            const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
            this.setState({gestureName: gestureName});
            switch (gestureName) {
              case SWIPE_UP:
                break;
              case SWIPE_DOWN:
                break;
              case SWIPE_LEFT:
                this.props.navigation.navigate('HomePostsScreen');
                console.log(this.state.myText);
                break;
              case SWIPE_RIGHT:
                break;
            }
          }

    render() {
    const { navigation } = this.props;
    const config = {
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80,
                detectSwipeUp: false,
                detectSwipeDown: false,
              };
    return (
       <SafeAreaView>
         <GestureRecognizer
            onSwipe={(direction, state) => this.onSwipe(direction, state)}
            onSwipeLeft={(state) => this.onSwipeLeft(state)}
            onSwipeRight={(state) => this.onSwipeRight(state)}
            config={config}
         >
         </GestureRecognizer>
       </SafeAreaView>
        );
     }
  }