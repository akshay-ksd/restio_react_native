import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.secondary,
        alignItems:'center',
        justifyContent:'center'
    },
    textView:{
        width:width,
        alignItems:'center',
        justifyContent:'space-evenly',
        height:font.headerHeight*1.5
    },
    text:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white,
    },
    subText:{
        fontSize:font.size.font10,
        color:color.borderColor,
        fontWeight:font.weight.semi
    }
})

export default style