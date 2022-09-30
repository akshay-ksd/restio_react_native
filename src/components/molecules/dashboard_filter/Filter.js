import React from "react";
import {View} from "react-native";
import Button from "../../atom/Button";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";

const Filter =(props)=>{
    const selectType=(type)=>{
        props.selectType(type)
    }
    return(
        <View style={style.container}>
             <Button 
                buttonStyle = {[style.filterButton,{borderColor:props.selectedType == 1? color.primary:color.white}]}
                onPress = {()=>selectType(1)}
                disabled = {false}
                textStyle = {[style.filterText,{color:color.borderColor}]}
                text = {"ToDay"}
                iconShow = {false}
            />
            <Button 
                buttonStyle = {[style.filterButton,{borderColor:props.selectedType == 2? color.primary:color.white}]}
                onPress = {()=>selectType(2)}
                disabled = {false}
                textStyle = {[style.filterText,{color:color.borderColor}]}
                text = {"This Week"}
                iconShow = {false}
            />
            <Button 
                buttonStyle = {[style.filterButton,{borderColor:props.selectedType == 3? color.primary:color.white}]}
                onPress = {()=>selectType(3)}
                disabled = {false}
                textStyle = {[style.filterText,{color:color.borderColor}]}
                text = {"This Month"}
                iconShow = {false}
            />
            <Button 
                buttonStyle = {[style.filterButton,{borderColor:props.selectedType == 4? color.primary:color.white}]}
                onPress = {()=>selectType(4)}
                disabled = {false}
                textStyle = {[style.filterText,{color:color.borderColor}]}
                text = {"This Year"}
                iconShow = {false}
            />
        </View>
    )
}

export default Filter