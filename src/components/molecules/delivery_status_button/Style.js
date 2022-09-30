import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    conntainer:{
        alignItems:'center',
        justifyContent:'center',
    },
    deliveryButton:{
        height:font.headerHeight-10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.primary,
        borderRadius:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
        marginLeft:5,
        marginVertical:10,
        marginRight:20,
        borderWidth:0,
        borderColor:color.tertiary,
    },
    deliveryButton1:{
        height:font.headerHeight-5,
        alignItems:'center',
        backgroundColor:color.gray,
        borderRadius:5,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        marginLeft:5,
        marginVertical:10,
        marginRight:20,
        borderWidth:4,
        borderColor:color.white,
        flexDirection:'row'
    },
    deliveryText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.primary,
        marginHorizontal:13
    },
    staffNameText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
    },
    status:{
        fontSize:font.size.font16,
        fontWeight:font.weight.low,
        color:color.darkGray,
        bottom:0,
        position:'absolute'
    },
    textView:{
        flex:1,
        // alignItems:'center',
        justifyContent:'center',
        marginVertical:5
    },
    statusText:{
        fontSize:font.size.font12,
        color:color.darkGray
    },
    closeButton:{
        alignItems:'center',
        justifyContent:'center',
        width:35,
        backgroundColor:color.borderColor,
        height:35,
        borderRadius:5,
        marginRight:1.5
    },
    closButtonText:{
        fontSize:font.size.font10,
        color:color.white
    },
    closeButton1:{
        alignItems:'center',
        justifyContent:'center',
        width:35,
        backgroundColor:color.primary,
        height:35,
        borderRadius:5,
        marginRight:1.5
    },
    closButtonText1:{
        fontSize:font.size.font10,
        color:color.white
    }
})

export default style