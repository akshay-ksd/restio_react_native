import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window')

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    staffList:{
        height:height-font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor
    },
    footer:{
        height:font.headerHeight,
        width:width
    }
})

export default style;
