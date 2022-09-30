import React from "react";
import {View,Text, TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";

const ExpenceList =(props)=>{
    const onPress=()=>{
        props.onPress()
    }
    return(
        <TouchableOpacity style={style.container}
                          onPress={()=>onPress()}>
            <View style={style.textView}>
                <Text style={style.text}>{props.category}</Text>
            </View>

            <View style={style.priceText}>
                <Text style={style.text}>₹ {props.amount}</Text>
            </View>
            <Icons iconName = {props.paymentType == 0 ? "cash":props.paymentType == 1?"card":"phone-portrait"}
                    iconSize = {font.size.font14}
                    iconColor = {color.darkGray}
                    iconStyle = {style.iconStyle}/>
            {/* <View style={style.iconView}>
                <Icons iconName = {"create"}
                    iconSize = {font.size.font14}
                    iconColor = {color.tertiary}
                    iconStyle = {style.iconStyle}/>
                <Icons iconName = {"trash-bin"}
                    iconSize = {font.size.font14}
                    iconColor = {color.primary}
                    iconStyle = {style.iconStyle}/>
            </View> */}
        </TouchableOpacity>
    )
}

export default ExpenceList