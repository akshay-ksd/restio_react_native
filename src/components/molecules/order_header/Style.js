import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {height,width} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor,
        flexDirection:'row'
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
    },
    filterType:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.darkGray,
        right:1
    },
    dateView:{
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center',
        width:font.headerHeight*3
    },
    dateText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.darkGray
    }
})

export default style