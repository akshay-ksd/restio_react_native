import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";

const CurrentPlan =(props)=>{
    return(
        <View style={style.container}>
            <View style={style.block}>
                <Text style={style.blockText}>Duration</Text>
                <Text style={style.blockText}>{props.month}</Text>
            </View>

            <View style={style.block}>
                <Text style={style.blockText}>Price</Text>
                <Text style={style.blockText}>{props.price}</Text>
            </View>
        </View>
    )
}

export default CurrentPlan