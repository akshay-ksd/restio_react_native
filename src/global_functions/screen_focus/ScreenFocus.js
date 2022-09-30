import React from "react";
import {View} from "react-native";
import { useIsFocused,useFocusEffect,useNavigation } from '@react-navigation/native';

const ScreenFocus =(props)=>{
    useFocusEffect(
        React.useCallback(() => {
            props.is_focused()
        }, [])
      );
    return(
        <View>

        </View>
    )
}

export default ScreenFocus