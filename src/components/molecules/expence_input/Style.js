import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor,
        marginVertical:20
    },
    inputView:{
        flexDirection:'row',
        height:font.headerHeight,
        width:width,
        backgroundColor:color.white,
        alignItems:'center'
    },
    inputViewStyle:{
        height:font.headerHeight,
        width:width-150,
        borderBottomWidth:1,
        borderColor:color.primary,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:5
    },
    inputStyle:{
        height:font.headerHeight,
        width:width-150,
        fontSize:font.size.font14,
        color:color.borderColor 
    },
    amounttextView:{
        marginHorizontal:10,
        alignItems:'center',
        justifyContent:'center',
        height:font.headerHeight,
        width:font.headerHeight*1.5
    },
    amountText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    iconStyle:{
        marginLeft:10
    }
})

export default style