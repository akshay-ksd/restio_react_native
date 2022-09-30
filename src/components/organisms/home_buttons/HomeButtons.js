import React from "react";
import {View,Image,Dimensions,Text} from "react-native"
import Style from "./Style"
import Button from "../../atom/Button"
import color from "../../../theme/colors";
import font from "../../../theme/font";
import NotificationBar from "../notification_bar/NotificationBar";
import { useNavigation } from '@react-navigation/native';
import style from "./Style";
const {width,height} = Dimensions.get("window");


function HomeButtons (props){
    const navigation = useNavigation()

    const goMenuScreen=()=>{
        navigation.navigate("Menu",{from:"home"})
    }

    const goOrderScreen=()=>{
        navigation.navigate("Orders")
    }

    const goSalesScreen=()=>{
        navigation.navigate("Sales")
    }

    const goProfileScreen=()=>{
        navigation.navigate("Profile")
    }
        return(
            <View style={Style.container} >
                {/* <View>
                    <NotificationBar/>
                </View> */}
                <View style={[style.bannerImage,{shadowColor:color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:10,}]}>
                    <Image style={[style.bannerImage]} source={require("../../../../assets/whiteR.png")}/>
                </View>
                <Text style={style.resName}>{global.resName}</Text>

                <View style={Style.buttonView}>
                    {
                        global.access == "ALL" || global.access == "MENU" ?
                            <Button 
                                buttonStyle = {Style.button}
                                onPress = {()=>goMenuScreen()}
                                disabled = {false}
                                textStyle = {Style.buttonTextStyle}
                                text = {"Menu"}
                                iconShow = {true}
                                iconName = {"grid-outline"}
                                iconSize = {font.size.font16}
                                iconColor = {color.secondary}
                                style = {props.iconStyle}
                            />:null
                    }

                    {
                        global.access == "ALL" || global.access == "KITCHEN" || global.access == "DELIVERY" || global.access == "ORDER"?
                            <Button 
                                buttonStyle = {Style.button}
                                onPress = {()=>goOrderScreen()}
                                disabled = {false}
                                textStyle = {Style.buttonTextStyle}
                                text = {"Orders"}
                                iconShow = {true}
                                iconName = {"reader-outline"}
                                iconSize = {font.size.font16}
                                iconColor = {color.secondary}
                                style = {props.iconStyle}
                            />:null
                    }                    
                </View>

                <View style={Style.buttonView}>
                    {
                        global.access == "ALL" || global.access == "SALES" ?
                            <Button 
                                buttonStyle = {Style.button}
                                onPress = {()=>goSalesScreen()}
                                disabled = {false}
                                textStyle = {Style.buttonTextStyle}
                                text = {"Sales"}
                                iconShow = {true}
                                iconName = {"pie-chart-outline"}
                                iconSize = {font.size.font16}
                                iconColor = {color.secondary}
                                style = {props.iconStyle}
                            />:null
                    }
                    
                   
                            <Button 
                                buttonStyle = {Style.button}
                                onPress = {()=>goProfileScreen()}
                                disabled = {false}
                                textStyle = {Style.buttonTextStyle}
                                text = {"Profile"}
                                iconShow = {true}
                                iconName = {"person-circle-outline"}
                                iconSize = {font.size.font16+2}
                                iconColor = {color.secondary}
                                style = {props.iconStyle}
                            />      
                </View>
            </View>
        )
    }

export default HomeButtons