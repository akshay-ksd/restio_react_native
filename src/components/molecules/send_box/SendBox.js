import React from "react";
import {View,Text, TouchableOpacity, ActivityIndicator} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";
import { useLinkProps } from "@react-navigation/native";

const SendBox =(props)=>{
    const send =()=>{
        props.sendToChef()
    }
    return(
        <TouchableOpacity style={style.container}
                          onPress={()=>send()}> 
            <Text style={style.sendText}>Send To {props.name}</Text>
            {
                props.loader == true?
                    <ActivityIndicator size={font.size.font18} color={color.white}/>
                :
                <Icons iconName={"send"} 
                        iconSize={font.size.font18} 
                        iconColor={color.white}
                        iconStyle = {style.iconStyle}/> 
            }
        </TouchableOpacity>
    )
}

export default SendBox