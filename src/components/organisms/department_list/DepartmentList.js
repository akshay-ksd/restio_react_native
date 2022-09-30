import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Button from "../../atom/Button";

const DepartmetList =(props)=>{

    const selectDepartMent=(access)=>{
        props.selectDepartMent(access)
    }

    const conform=()=>{
        props.conform()
    }

    const updateData=()=>{
        props.updateData()
    }
    return(
        <View>
            <View style={style.departmentHeadingView}>
                <Text style={style.departmentHeading}>Select Department</Text>
            </View>

            {/* <View style={style.departmentButtonView}>
                <Button 
                    buttonStyle = {style.button}
                    onPress = {()=>selectDepartMent("MENU")}
                    disabled = {false}
                    textStyle = {style.buttonText}
                    text = {"Menu"}
                    iconShow = {props.access == "MENU"?true:false}
                    iconName = {"checkmark-circle"}
                    iconSize = {font.size.font20}
                    iconColor = {color.secondary}
                    style = {style.iconStyle}
                />

                <Button 
                    buttonStyle = {style.button}
                    onPress = {()=>selectDepartMent("SALE")}
                    disabled = {false}
                    textStyle = {style.buttonText}
                    text = {"Sales"}
                    iconShow = {props.access == "SALE"?true:false}
                    iconName = {"checkmark-circle"}
                    iconSize = {font.size.font20}
                    iconColor = {color.secondary}
                    style = {style.iconStyle}
                />
            </View> */}

            <View style={style.departmentButtonView}>
                <Button 
                    buttonStyle = {style.button}
                    onPress = {()=>selectDepartMent("KITCHEN")}
                    disabled = {false}
                    textStyle = {style.buttonText}
                    text = {"Kitchen"}
                    iconShow = {props.access == "KITCHEN"?true:false}
                    iconName = {"checkmark-circle"}
                    iconSize = {font.size.font16}
                    iconColor = {color.primary}
                    style = {style.iconStyle}
                />

                <Button 
                    buttonStyle = {style.button}
                    onPress = {()=>selectDepartMent("DELIVERY")}
                    disabled = {false}
                    textStyle = {style.buttonText}
                    text = {"Delivery"}
                    iconShow = {props.access == "DELIVERY"?true:false}
                    iconName = {"checkmark-circle"}
                    iconSize = {font.size.font16}
                    iconColor = {color.primary}
                    style = {style.iconStyle}
                />
            </View>

            <View style={style.departmentButtonView}>

                <Button 
                    buttonStyle = {style.button}
                    onPress = {()=>selectDepartMent("ORDER")}
                    disabled = {false}
                    textStyle = {style.buttonText}
                    text = {"Orders"}
                    iconShow = {props.access == "ORDER"?true:false}
                    iconName = {"checkmark-circle"}
                    iconSize = {font.size.font16}
                    iconColor = {color.primary}
                    style = {style.iconStyle}
                />
                 <Button 
                    buttonStyle = {style.button}
                    onPress = {()=>selectDepartMent("MENU")}
                    disabled = {false}
                    textStyle = {style.buttonText}
                    text = {"Menu"}
                    iconShow = {props.access == "MENU"?true:false}
                    iconName = {"checkmark-circle"}
                    iconSize = {font.size.font16}
                    iconColor = {color.secondary}
                    style = {style.iconStyle}
                />
            </View>

            <View style={style.addButtonView}>
                {
                    props.purpose == "ADD" ?
                    <Button 
                        buttonStyle = {style.addButton}
                        onPress = {()=>conform()}
                        disabled = {false}
                        textStyle = {style.addButtonText}
                        text = {"CONFIRM"}
                        iconShow = {false}
                        iconName = {"checkmark-circle"}
                        iconSize = {font.size.font16}
                        iconColor = {color.secondary}
                        style = {style.iconStyle}
                    />:
                    <Button 
                        buttonStyle = {style.addButton}
                        onPress = {()=>updateData()}
                        disabled = {false}
                        textStyle = {style.addButtonText}
                        text = {"UPDATE"}
                        iconShow = {false}
                        iconName = {"checkmark-circle"}
                        iconSize = {font.size.font16}
                        iconColor = {color.secondary}
                        style = {style.iconStyle}
                    />
                }
               
            </View>
        </View>
    )
}

export default DepartmetList