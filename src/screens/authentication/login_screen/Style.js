import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font"
const {width,height} = Dimensions.get("window")

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    inputContainer:{
        height:height/2,
        alignItems:'center',
        justifyContent:'space-evenly',
    },
    inputViewStyle:{
        height:font.headerHeight,
        width:width-font.headerHeight,
        backgroundColor:color.backgroundColor,
        borderWidth:0.5,
        borderColor:color.borderColor,
        borderRadius:5,
        alignItems:'center',
        flexDirection:'row'
    },
    inputStyle:{
        fontSize:font.size.font14,
        height:font.headerHeight,
        marginLeft:5
    },
    loginButtonView:{
        height:font.headerHeight,
        width:width,
        alignItems:'center',
        justifyContent:'center',
        marginTop:font.headerHeight
    },
    loginButton:{
        height:font.headerHeight-5,
        width:width-font.headerHeight,
        borderRadius:5,
        backgroundColor:color.secondary,
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
    },
    textStyle:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    },
    iconStyle:{
        marginLeft:10
    },
    headingStyle:{
        height:font.headerHeight*1.5,
        width:width,
        justifyContent:'flex-end',
        backgroundColor:color.backgroundColor,
        paddingHorizontal:20
    },
    headerTextStyle:{
        fontSize:font.size.font20,
        color:color.borderColor,
        fontWeight:font.weight.bold
    },
    imageView:{
        width:width-10,
        height:height/3,
        alignItems:'center',
        justifyContent:'center',
        margin:5,
        opacity:0.5
    },
    subHeading:{
        height:font.headerHeight,
        width:width,
        justifyContent:'center',
        paddingHorizontal:20
    },
    subText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.low,
        color:color.borderColor
    },
    subHeading1:{
        height:font.headerHeight,
        width:width,
        justifyContent:'center',
        paddingHorizontal:20,
        marginTop:font.headerHeight
    },
    registerView:{
        height:font.headerHeight,
        width:width,
        alignItems:'center',
        justifyContent:'center',
        marginTop:font.headerHeight/2,
    },
    registerButton:{
        height:font.headerHeight-5,
        width:width-font.headerHeight,
        borderRadius:5,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:0,
        borderColor:color.secondary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
    },
    orView:{
        height:font.headerHeight,
        width:width,
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:1,
        borderColor:color.secondary,
        borderStyle:'dashed'
    },
    rtextStyle:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.secondary
    },
    orText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.darkGray
    }
})

export default style