import React from "react";
import {TouchableOpacity, View,Text} from "react-native";
import style from "./Style";
import Icons from "../../atom/Icon";
import {useNavigation} from "@react-navigation/native"
import font from "../../../theme/font";
import color from "../../../theme/colors";
import Button from "../../atom/Button";
const Heder =(props)=>{
    const navigation = useNavigation()
    const [selectAllMenu,setselectAllMenu] = React.useState(false)

    React.useEffect(()=>{

    },[])

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
                <Text style={style.ordersText}>Menu access</Text>
            </View>
            <TouchableOpacity style={[style.iconView,{left:font.headerHeight*3.1}]} onPress={()=>props.selectAll()}>
                <Icons iconName = {props.isSelected ? "checkmark-circle":"checkmark-circle-outline"}
                        iconSize = {font.size.font20}
                        iconColor = {props.isSelected ?color.secondary:color.black}
                        iconStyle = {style.iconStyle}/>
                <Text style={style.selectAllText}>{props.isSelected ?"All Selected":"Select All"}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Heder;
