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
        justifyContent:"space-between",
        paddingHorizontal:10
    },
    iconView:{
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center',
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
    cancelView:{
        height:font.headerHeight-20,
        alignItems:'center',
        justifyContent:'center' ,
        borderRadius:5,
        backgroundColor:color.primary,
        marginTop:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
        borderWidth:0,
        borderColor:color.borderColor
    },
    cancelText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white,
        marginHorizontal:10,
    }
})

export default style