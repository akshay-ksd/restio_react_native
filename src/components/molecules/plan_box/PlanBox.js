import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";

const PlanBox =(props)=>{
    return(
        <View style={style.container}>
            <Text style={style.plan}>{props.plan}</Text>
            <Text style={style.priceText}>₹ {props.price}</Text>
        </View>
    )
}

export default PlanBox