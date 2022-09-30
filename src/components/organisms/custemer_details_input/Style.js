import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height-font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor
    },
    inputView:{
        height:font.headerHeight,
        width:width-font.headerHeight,
        borderWidth:1,
        borderColor:color.darkGray,
        borderRadius:5,
        justifyContent:'center'
    },
    inputStyle:{
        fontSize:font.size.font14,
        fontWeight:font.weight.low,
        color:color.borderColor,
        marginLeft:10
    },
    inputContainer:{
        width:width,
        alignItems:'center',
        justifyContent:'space-evenly',
        height:height/2
    },
    sellectStaffButton:{
        height:font.headerHeight-5,
        width:font.headerHeight*2,
        borderRadius:5,
        backgroundColor:color.tertiary,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonView:{
        width:width,
        alignItems:'center',
        justifyContent:'center',
        height:height/8
    },
    selctStaffText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    },
    heading:{
        fontSize:font.size.font12,
        color:color.darkGray,
        fontWeight:font.weight.low,
        marginVertical:5
    }
})

export default style;