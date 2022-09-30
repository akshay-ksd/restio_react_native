import React from "react";
import {TouchableOpacity, View,Text,Dimensions} from "react-native";
import style from "./Style";
import Icons from "../../atom/Icon";
import {useNavigation} from "@react-navigation/native"
import font from "../../../theme/font";
import color from "../../../theme/colors";
import moment from "moment";

const {height,width} = Dimensions.get('window');

const Header =(props)=>{
    const navigation = useNavigation()

    const goBack =()=>{
        navigation.goBack()
    }

    const menu_access =()=>{
        navigation.navigate("Menu_access")
    }
    
    return(
        <View style={style.container}> 
            <TouchableOpacity style={[style.iconView,{left:1}]} onPress={()=>goBack()}>
                <Icons iconName = {"arrow-back-outline"}
                        iconSize = {font.size.font20}
                        iconColor = {color.black}
                        iconStyle = {style.iconStyle}/>
            </TouchableOpacity>

            <View style={style.orderTextView}>
                <Text style={style.ordersText}>Orders</Text>
            </View>

            <View style={style.dateView}>
                <Text style={style.dateText}>{props.date !== false ? moment(props.date).format('MMMM Do YYYY'):moment().calendar()}</Text>
            </View>

            <TouchableOpacity style={[style.iconView]} onPress={()=>menu_access()}>
                <Icons iconName = {"apps"}
                       iconSize = {font.size.font16}
                       iconColor = {color.black}
                       iconStyle = {style.iconStyle}/>
                <Text style={style.filterType}>Menu access</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[style.iconView,{left:5,bottom:2}]} onPress={()=>props.filter()}>
                <Icons iconName = {"filter"}
                       iconSize = {font.size.font16}
                       iconColor = {color.black}
                       iconStyle = {style.iconStyle}/>
                <Text style={style.filterType}>{props.filterType == 0 ? "All" : props.filterType == 1 ? "Pending" : props.filterType == 2 ? "Paid" : "Cancelled"}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Header;
