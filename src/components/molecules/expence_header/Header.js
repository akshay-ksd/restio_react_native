import React from "react";
import {View,Text,TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";
import {useNavigation} from "@react-navigation/native"

const Header =()=>{
    const navigation = useNavigation()

    const goBack =()=>{
        navigation.goBack()
    }

    return(
        <View style={style.container}>
            <TouchableOpacity style={style.iconView} onPress={()=>goBack()}>
                <Icons iconName = {"arrow-back-outline"}
                        iconSize = {font.size.font16}
                        iconColor = {color.black}
                        iconStyle = {style.iconStyle}/>
            </TouchableOpacity>
            <View style={style.orderTextView}>
                <Text style={style.ordersText}>Add Expence</Text>
            </View>
        </View>
    )
}

export default Header;