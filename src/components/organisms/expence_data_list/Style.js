import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        marginVertical:5,
    },
    textView:{
        width:width/2,
        height:font.headerHeight,
        justifyContent:'center',
    },
    text:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    priceText:{
        height:font.headerHeight,
        width:font.headerHeight,
        justifyContent:'center'
    },
    iconView:{
        width:font.headerHeight,
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row'
    }
})

export default style