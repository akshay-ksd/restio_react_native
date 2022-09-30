import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";

const IEBBox =()=>{
    return(
        <View style={style.container}>
            <View style={style.heading}>
                <Text style={style.headingText}>Incom</Text>
            </View>
            <View style={style.boxView}>
                <View style={style.box}>
                    <Text style={style.dayText}>Today</Text>
                    <Text style={style.priceText}>₹15000</Text>
                </View>
                <View style={style.box}>
                    <Text style={style.dayText}>This Week</Text>
                    <Text style={style.priceText}>₹15000</Text>
                </View>
            </View>

            <View style={style.boxView}>
                <View style={style.box}>
                    <Text style={style.dayText}>This Month</Text>
                    <Text style={style.priceText}>₹15000</Text>
                </View>
                <View style={style.box}>
                    <Text style={style.dayText}>This Year</Text>
                    <Text style={style.priceText}>₹15000</Text>
                </View>
            </View>
        </View>
    )
}

export default IEBBox;