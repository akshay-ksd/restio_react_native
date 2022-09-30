import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    loaderView:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'center'
    },
    authtext:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        margin:5
    },
    heading:{
        height:font.headerHeight,
        width:width,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:10,
        marginTop:font.headerHeight
    },
    headingText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    otpView:{
        height:font.headerHeight,
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    inputViewStyle:{
        height:font.headerHeight,
        borderBottomWidth:2,
        borderColor:color.secondary
    },
    inputStyle:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    timerView:{
        width:width,
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center'
    },
    resend:{
        fontSize:font.size.font14,
        fontWeight:font.weight.full,
        color:color.secondary,
        textDecorationLine:"underline"
    },
    verifyView:{
        width:width,
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center',
        marginTop:font.headerHeight
    },
    varifyButton:{
        height:font.headerHeight-5,
        width:width-font.headerHeight,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.secondary
    },
    textStyle:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.white
    },
    loader:{
        width:width,
        alignItems:'center',
        justifyContent:'center',
        margin:10
    }
})

export default style