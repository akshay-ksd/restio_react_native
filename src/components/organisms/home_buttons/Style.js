import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font"
const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor,
        borderRadius:15,
        bottom:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:0,
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    buttonView:{
        height:height/6,
        width:width,
        backgroundColor:color.backgroundColor,
        flexDirection:'row',
        justifyContent:'space-evenly',
    },
    button:{
        height:font.headerHeight*2,
        width:font.headerHeight*2,
        borderRadius:15,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center',
        shadowColor:color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
    },
    buttonTextStyle:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginTop:5
    },
    iconStyle:{
        margin:5
    },
    bannerImage:{
        height:height/5,
        width:width/3,
        backgroundColor:color.secondary,
        borderRadius:10
    },
    resName:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        bottom:0,
        position:'absolute'
    }
})

export default style