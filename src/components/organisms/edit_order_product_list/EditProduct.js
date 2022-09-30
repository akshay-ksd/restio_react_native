import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";
import AddButton from "../../molecules/add_button/AddButton"

const EditProdut =(props)=>{
    const loadCount=(count)=>{
        props.loadProductCount(count,props.product_id,props.price)
    }
    return(
        <View style={style.container}>
            <View style={style.productView}>
                <Text style={style.productName}>{props.name}</Text>
                <View style={style.priceView}>
                    <Icons  iconName = {"radio-button-on-outline"}
                            iconSize = {font.size.font14}
                            iconColor = {color.red}
                            iconStyle = {style.iconstyle}/>
                    <Text style={[style.productName,{marginLeft:10}]}>₹ {props.price}</Text>
                </View>
            </View>
            <AddButton count = {props.count}
                       value = {loadCount}/>
        </View>
    )
}

export default EditProdut;