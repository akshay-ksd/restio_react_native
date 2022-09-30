import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window")

const style = StyleSheet.create({
    container:{
        height:font.headerHeight,
        width:width,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:color.backgroundColor,
    },
    iconStyle:{
        marginLeft:10
    },
    orderTextView:{
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center'
    },
    ordersText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:10
    }
})

export default style