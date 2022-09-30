import React from "react";
import {TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native"
import Icons from "../../atom/Icon";
import style from "./Style";
import font from "../../../theme/font";
import color from "../../../theme/colors";
import Button from "../../atom/Button";
import Textinput from "../../atom/TextInput";

function Header(props){
    const navigation = useNavigation()
    const [text,setText] = React.useState("")
    const load_data = (text) =>{
        props.searchProduct(text)
        setText(text)
    }

    const goOrderScreen =()=>{
        navigation.navigate("Orders")
    }

    const goAddProductScreen =()=>{
        navigation.navigate("AddProduct")
    }


    return(
        <View style={style.container}>
            <TouchableOpacity style={style.IconView}
                              onPress = {()=>navigation.goBack()}>
                <Icons iconName = {"arrow-back-outline"}
                       iconSize = {font.size.font20}
                       iconColor = {color.black}
                       iconStyle = {style.iconStyle}/>
            </TouchableOpacity>

            <View style={style.buttoView}>

                <Textinput 
                    inputViewStyle = {style.inputViewStyle}
                    inputStyle = {style.inputStyle}
                    placeHolder = {"Search All Products"}
                    iconShow = {true}
                    iconName = {"search"}
                    iconColor = {color.secondary}
                    iconSize = {font.size.font16}
                    iconStyle = {style.iconStyle}
                    secureTextEntry = {false}
                    maxLength = {100}
                    load_data = {load_data}
                    value = {text}
                    type = {"normal"}/>
                    {
                        text.length !== 0?
                            <Button buttonStyle = {[style.button]}
                                onPress = {()=>load_data("")}
                                disabled = {false}
                                textStyle = {style.buttonTextStyle}
                                text = {0}
                                iconShow = {true}
                                iconName = {"close-circle-outline"}
                                iconSize = {font.size.font18}
                                iconColor = {color.darkGray}
                                style = {props.iconStyle}
                            />
                            :null
                    }
                 
                <Button buttonStyle = {style.button1}
                        onPress = {()=>goOrderScreen()}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle1}
                        text = {"Orders"}
                        iconShow = {true}
                        iconName = {"reader"}
                        iconSize = {font.size.font16}
                        iconColor = {color.secondary}
                        style = {props.iconStyle}/>
            </View>
        </View>
    )
}

export default Header