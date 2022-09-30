import React from "react";
import {View} from "react-native";
import style from "./Style";
import Button from "../../atom/Button"
import color from "../../../theme/colors";

const OrderFilter =(props)=>{
    const [type,setType] = React.useState(1)

    const changeFilter =(filterType)=>{
        setType(filterType)
        props.changeFilter(filterType)
    }

    const datePickerShow =()=>{
        setType(3)
        props.datePickerShow("hi")
    }
    return(
        <View style={style.container}>
             <Button 
                buttonStyle = {[style.filterView,{borderColor:type == 0?color.secondary:color.white}]}
                onPress = {()=>changeFilter(0)}
                disabled = {false}
                textStyle = {[style.filterText,{color:type == 0?color.borderColor:color.borderColor}]}
                text = {"ALL"}
                iconShow = {false}
                gradient = {false}
            />

              <Button 
                 buttonStyle = {[style.filterView,{borderColor:type == 1?color.secondary:color.white}]}
                 onPress = {()=>changeFilter(1)}
                 disabled = {false}
                 textStyle = {[style.filterText,{color:type == 1?color.borderColor:color.borderColor}]}
                 text = {"ACTIVE"}
                 iconShow = {false}
                 gradient = {false}
             />

             <Button 
                buttonStyle = {[style.filterView,{borderColor:type == 2?color.secondary:color.white}]}
                onPress = {()=>changeFilter(2)}
                disabled = {false}
                textStyle = {[style.filterText,{color:type == 2?color.borderColor:color.borderColor}]}
                text = {props.from == "Delivery"? "DELIVERD":props.from == "Kitchen"?"PREPARED":"PAID"}
                iconShow = {false}
                gradient = {false}
            />

            <Button 
               buttonStyle = {[style.filterView,{borderColor:type == 3?color.secondary:color.white}]}
                onPress = {()=>datePickerShow()}
                disabled = {false}
                textStyle = {[style.filterText,{color:type == 3?color.borderColor:color.borderColor}]}
                text = {"CUSTOM"}
                iconShow = {false}
                gradient = {false}
            />
        </View>
    )
}

export default OrderFilter;