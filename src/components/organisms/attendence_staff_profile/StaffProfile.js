import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import PressentButton from "../../molecules/attendence_prssent_button/PressentButton";
const StaffProfile =(props)=>{
    const pressent=(status)=>{
        props.pressent(status,props.token,props.name,props.index)
    }

    return(
        <View style={style.container}>
            <View style={style.avatharView}>
                <Text style={style.avatharText}>👨</Text>
            </View>
            <View style={style.nameView}>
                <Text style={style.name}>{props.name}</Text>
                <Text style={style.access}>{props.access}</Text>
            </View>

            <PressentButton pressent = {pressent}
                            loadingIndex = {props.loadingIndex}
                            index = {props.index}
                            isPresent={props.isPresent}/>
        </View>
    )
}

export default StaffProfile