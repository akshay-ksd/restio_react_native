import React from "react";
import {View,Text, TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";

const StaffProfile =(props)=>{
    
    const editProfile =()=>{
        props.editProfile()
    }

    return(
        <TouchableOpacity style={[style.container,{backgroundColor:props.is_active == 1?color.backgroundColor:color.gray}]} 
                          onPress={()=>editProfile()}
                          disabled={props.disabled}>
            <View style={[style.avathar,{borderColor:props.index == props.selectedIndex?color.secondary:color.white}]}>
                <Text style={style.avatharText}>👨</Text>
            </View>

            <View style={style.nameTextView}>
                <Text style={style.nameText}>{props.name}</Text>
                {
                props.is_active == 0?
                    <Text style={style.offlineText}>Offline</Text>
                :null
            }
            </View>
            
            {
                props.index == props.selectedIndex?
                <Text style={[style.access,{color:color.borderColor,fontSize:font.size.font16}]}>  👈🏾</Text>
                : <Text style={style.access}>{props.access}</Text>
            }
        </TouchableOpacity>
    )
}

export default StaffProfile