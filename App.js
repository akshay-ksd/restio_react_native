import React,{Component} from 'react';
import {
  LogBox,
  Text,
  useColorScheme,
  StatusBar,
} from 'react-native';
import StackNavigation from './src/navigation/StackNavigation';
import color from './src/theme/colors';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
// LogBox.ignoreAllLogs();
global.url = 'https://prickly-flawed-pronghorn.gigalixirapp.com/'
const initialState = {
  login_status: false,
  is_valid: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
      case 'LOGIN':
          return { login_status: true }
      case 'LOGOUT':
          return { login_status: false }
      case 'VALID':
        return { is_valid: true}
      case 'EXPAIRED':
        return { is_valid: false}
  }
  return state
}

const store = createStore(reducer)

class App extends Component{
  render(){
    return(
      <>
      <StatusBar
        animated={true}
        backgroundColor={color.white}
        barStyle = {'dark-content'}
      />
        <Provider store={store}>
            <StackNavigation/>
        </Provider>
      </>
    )
  }
}

export default App;
