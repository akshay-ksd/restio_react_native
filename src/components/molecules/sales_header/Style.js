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
        alignItems:'center',
        justifyContent:'space-between',
        padding:10
    },
    iconView:{
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center'
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
    },
    chartDateButton:{
        height:font.headerHeight-15,
        width:font.headerHeight*2,
        borderRadius:5,
        backgroundColor:color.primary,
        alignItems:'center',
        justifyContent:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
        flexDirection:'row',
        marginLeft:50
    },
    chartDateText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.low,
        color:color.white,
        marginLeft:2
    }
})

export default style