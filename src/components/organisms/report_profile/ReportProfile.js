import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";

const ReportProfile =(props)=>{
    return(
        <View style={style.container}>
            <View style={style.avatharView}>
                <Text style={style.avatharText}>👨</Text>
            </View>
            <View style={style.nameView}>
                <Text style={style.name}>{props.name}</Text>
                <Text style={style.access}>{props.access}</Text>
            </View>
            <View style={style.attendenceBox}>
                <Text style={[style.presentCount,{color:color.tertiary}]}>{props.present}</Text>
                <Text style={style.presentText}>Present</Text>
            </View>
            <View style={style.attendenceBox}>
                <Text style={[style.presentCount,{color:color.secondary}]}>{props.absent}</Text>
                <Text style={style.presentText}>Absent</Text>
            </View>
        </View>
    )
}

export default ReportProfile