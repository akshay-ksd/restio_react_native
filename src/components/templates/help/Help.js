import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Header from "../../molecules/custom_heder/Heder"
import Button from "../../atom/Button";
import {useNavigation} from "@react-navigation/native"

const Help =()=>{
    const navigation = useNavigation()
    const [loadData,setLoadData] = React.useState(false)

    React.useEffect(()=>{
        loadDatas()
    },[])

    const loadDatas=()=>{
        setTimeout(()=>{setLoadData(true)},100)
    }

    const goContactUsScreen=(type)=>{
        navigation.navigate("ContactUs",{type:type})
    }

    const goWebViewScreen=(from,heding)=>{
        navigation.navigate("WebView",{from:from,heding:heding})
    }
    return(
        <View style={style.container}>
            {
                loadData == true ?
                <>
                    <Header headerName = {"Help"}/>

                    <Button 
                        buttonStyle = {style.button}
                        onPress = {()=>goWebViewScreen("help")}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle}
                        text = {"Help"}
                        iconShow = {true}
                        iconName = {"help-circle"}
                        iconSize = {font.size.font16}
                        iconColor = {color.secondary}
                        iconStyle = {style.iconStyle}
                    />

                    <Button 
                        buttonStyle = {style.button}
                        onPress = {()=>goContactUsScreen("p")}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle}
                        text = {"Contact Us"}
                        iconShow = {true}
                        iconName = {"people-circle"}
                        iconSize = {font.size.font16}
                        iconColor = {color.secondary}
                        iconStyle = {style.iconStyle}
                    />

                    <Button 
                        buttonStyle = {style.button}
                        onPress = {()=>goContactUsScreen("s")}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle}
                        text = {"Suggestion"}
                        iconShow = {true}
                        iconName = {"bulb"}
                        iconSize = {font.size.font16}
                        iconColor = {color.secondary}
                        iconStyle = {style.iconStyle}
                    />
                     <Button 
                        buttonStyle = {style.button}
                        onPress = {()=>goWebViewScreen("privacy","Privacy Policy")}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle}
                        text = {"Privacy Policy"}
                        iconShow = {true}
                        iconName = {"newspaper"}
                        iconSize = {font.size.font16}
                        iconColor = {color.secondary}
                        iconStyle = {style.iconStyle}
                    />
                     <Button 
                        buttonStyle = {style.button}
                        onPress = {()=>goWebViewScreen("terms","Terms & Condition")}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle}
                        text = {"Terms & Condition"}
                        iconShow = {true}
                        iconName = {"reader"}
                        iconSize = {font.size.font16}
                        iconColor = {color.secondary}
                        iconStyle = {style.iconStyle}
                    />
                </>
                :null
            }
        </View>
    )
}

export default Help;