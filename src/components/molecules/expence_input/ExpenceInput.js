import React from "react";
import {View,Text, TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";
import Textinput from "../../atom/TextInput";

const ExpenceInput =(props)=>{
    const load_data=(text)=>{
        props.onChange(props.heading,text)
    }
    return(
        <View style={style.container}>
            <View style={style.inputView}>
                <View style={style.amounttextView}>
                    <Text style={style.amountText}>{props.heading}</Text>
                </View>
                <Textinput 
                  inputViewStyle = {style.inputViewStyle}
                  inputStyle = {style.inputStyle}
                  placeHolder = {props.placeHolder}
                  iconShow = {false}
                  keyboardType = {props.type}
                  secureTextEntry = {false}
                  maxLength = {100}
                  load_data = {load_data}
                  type = {"phone"}
                  value = {props.value}
                />
                {/* <TouchableOpacity onPress={()=>props.onPress()}>
                    <Icons iconName = {props.iconName}
                        iconSize = {font.size.font16}
                        iconColor = {color.borderColor}
                        iconStyle = {style.iconStyle}/>
                </TouchableOpacity> */}
            </View>
        </View>
    )
}

export default ExpenceInput;