import React from "react";
import {TouchableOpacity, View,Text} from "react-native";
import style from "./Style";
import Icons from "../../atom/Icon";
import {useNavigation} from "@react-navigation/native"
import font from "../../../theme/font";
import color from "../../../theme/colors";
import Button from "../../atom/Button"
const Header =(props)=>{
    const navigation = useNavigation()

    const goBack =()=>{
        navigation.goBack()
    }

    return(
        <View style={style.container}> 
            <TouchableOpacity style={style.iconView} onPress={()=>goBack()}>
                <Icons iconName = {"arrow-back-outline"}
                        iconSize = {font.size.font20}
                        iconColor = {color.black}
                        iconStyle = {style.iconStyle}/>
            </TouchableOpacity>
            <View style={style.orderTextView}>
                <Text style={style.ordersText}>Profile</Text>
            </View>
        </View>
    )
}

export default Header;
