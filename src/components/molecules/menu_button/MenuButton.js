import React from "react";
import {View,TouchableOpacity,Text} from "react-native";
import Icons from "../../atom/Icon";
import font from "../../../theme/font";
import color from "../../../theme/colors";
import {useNavigation} from "@react-navigation/native";
import style from "./Style";

const MenuButton =()=>{
    const navigation = useNavigation()

    const goMenuScreen =()=>{
        navigation.navigate("Menu",{from:"home"})
    }
    return(
        <TouchableOpacity onPress={()=>goMenuScreen()} style={style.addButton}>
            <Icons iconName = {"add"}
                iconSize = {font.size.font20+5}
                iconColor = {color.white}
                iconStyle = {style.iconStyle}/>
        </TouchableOpacity>
    )
}

export default MenuButton