import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    deliveryStatus:{
        bottom:50,
        width:width/2
    },
    deliveryStatusView:{
        alignItems:'center',
        justifyContent:'center',
        width:width
    }
})

export default style