import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";

const NoInternet =()=>{
    return(
        <View style={style.container}>
            <Text style={style.emoji}>🤷‍♂️</Text>
            <Text style={style.text}>No Internet Connection</Text>
        </View>
    )
}

export default NoInternet;