import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window")

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    hedingView:{
        width:width,
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center'
    },
    heding:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    inputView:{
        width:width,
        height:font.headerHeight*2,
        alignItems:'center',
        justifyContent:'center'
    },
    inputViewStyle:{
        height:font.headerHeight,
        width:font.headerHeight,
        borderWidth:1,
        borderRadius:5,
        borderColor:color.borderColor,
        alignItems:'center',
        justifyContent:'center'
    },
    inputStyle:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    updateButtonView:{
        width:width,
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:"center"
    },
    updateButton:{
        height:font.headerHeight-5,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        backgroundColor:color.secondary,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
    },
    buttonText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.white
    },
    inputViewStyle:{
        width:width/2,
        height:font.headerHeight,
        borderRadius:10,
        borderWidth:0.5,
        borderColor:color.darkGray,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center'
    },
    inputStyle:{
        fontSize:font.size.font12,
        fontWeight:font.size.semi,
        color:color.borderColor,
    },
    indicatorView:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    editView:{
        width:width-font.headerHeight,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row'
    }
})

export default style