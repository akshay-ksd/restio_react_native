import React from "react";
import {View,Image, ActivityIndicator} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";

class Splash extends React.PureComponent{
    render(){
        return(
            <View style={style.container}>
                <Image style={style.logo}
                        source={require("../../../../assets/whiteR.png")}/>
                <View style={style.loaderView}>
                    <ActivityIndicator size={font.size.font18} color={color.white}/>
                </View>
            </View>
        )
    }
}

export default Splash