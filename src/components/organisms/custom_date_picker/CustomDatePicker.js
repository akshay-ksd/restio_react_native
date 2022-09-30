import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Button from "../../atom/Button";

const CustomDatePicker =()=>{
    return(
        <View style={style.container}>
            <View style={style.incomeExpence}>
                <Button 
                    buttonStyle = {style.icomeButton}
                    onPress = {()=>bill()}
                    disabled = {false}
                    textStyle = {style.icomeText}
                    text = {"Income"}
                    iconShow = {true}
                    iconName = {"radio-button-on"}
                    iconSize = {font.size.font20+2}
                    iconColor = {color.green}
                    style = {style.iconStyle}
                />

                <Button 
                    buttonStyle = {style.icomeButton}
                    onPress = {()=>bill()}
                    disabled = {false}
                    textStyle = {style.icomeText}
                    text = {"Expence"}
                    iconShow = {true}
                    iconName = {"radio-button-off"}
                    iconSize = {font.size.font20+2}
                    iconColor = {color.green}
                    style = {style.iconStyle}
                />

                <Button 
                    buttonStyle = {style.icomeButton}
                    onPress = {()=>bill()}
                    disabled = {false}
                    textStyle = {style.icomeText}
                    text = {"Balance"}
                    iconShow = {true}
                    iconName = {"radio-button-off"}
                    iconSize = {font.size.font20+2}
                    iconColor = {color.green}
                    style = {style.iconStyle}
                />
            </View>
            <View style={style.incomeExpence}>
                <Button 
                    buttonStyle = {style.datePicker}
                    onPress = {()=>bill()}
                    disabled = {false}
                    textStyle = {style.datePickerText}
                    text = {"Pick Date"}
                    iconShow = {true}
                    iconName = {"calendar"}
                    iconSize = {font.size.font20+2}
                    iconColor = {color.secondary}
                    style = {style.iconStyle}
                />

                <Button 
                    buttonStyle = {style.datePicker}
                    onPress = {()=>bill()}
                    disabled = {false}
                    textStyle = {style.datePickerText}
                    text = {"Pick Date"}
                    iconShow = {true}
                    iconName = {"calendar"}
                    iconSize = {font.size.font20+2}
                    iconColor = {color.secondary}
                    style = {style.iconStyle}
                />
            </View>
            <View style={style.amountView}>
                <Text style={style.amountText}>₹ 0.00</Text>
            </View>
        </View>
    )
}

export default CustomDatePicker;