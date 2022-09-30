import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {height,width} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor,
        flexDirection:'row',
        alignItems:'center'
    },
    iconView:{
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:10
    },
    iconStyle:{
        marginLeft:0
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