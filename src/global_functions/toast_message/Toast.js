import {ToastAndroid,
        Platform,
        AlertIOS, } from "react-native";

export const toast =(msg)=>{
    if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
            msg,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
    } else {
      AlertIOS.alert(msg);
    }
}