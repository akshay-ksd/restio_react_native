import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Button from "../../atom/Button";

const GraphDate =()=>{
    return(
        <View style={style.container}>
            <Button 
                    buttonStyle = {style.buttonView}
                    onPress = {()=>bill()}
                    disabled = {false}
                    textStyle = {style.buttonText}
                    text = {"6 Month"}
                    iconShow = {true}
                    iconName = {"radio-button-on"}
                    iconSize = {font.size.font20+2}
                    iconColor = {color.green}
                    style = {style.iconStyle}
                />
                <Button 
                    buttonStyle = {style.buttonView}
                    onPress = {()=>bill()}
                    disabled = {false}
                    textStyle = {style.buttonText}
                    text = {"4 Week"}
                    iconShow = {true}
                    iconName = {"radio-button-on"}
                    iconSize = {font.size.font20+2}
                    iconColor = {color.green}
                    style = {style.iconStyle}
                />
                <Button 
                    buttonStyle = {style.buttonView}
                    onPress = {()=>bill()}
                    disabled = {false}
                    textStyle = {style.buttonText}
                    text = {"7 Days"}
                    iconShow = {true}
                    iconName = {"radio-button-on"}
                    iconSize = {font.size.font20+2}
                    iconColor = {color.green}
                    style = {style.iconStyle}
                />
                <View style={style.applyView}>
                    <Button 
                        buttonStyle = {style.applyButton}
                        onPress = {()=>bill()}
                        disabled = {false}
                        textStyle = {style.applyButtonText}
                        text = {"Apply"}
                        iconShow = {false}
                        // iconName = {"radio-button-on"}
                        // iconSize = {font.size.font20+2}
                        // iconColor = {color.green}
                        // style = {style.iconStyle}
                    />
                </View>
        </View>
    )
}

export default GraphDate;