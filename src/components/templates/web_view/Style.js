import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    webview:{
        height:height-font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor
    },
    loaderView:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    }
})

export default style