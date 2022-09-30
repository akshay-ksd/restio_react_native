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
    input:{
        width:width,
        height:font.headerHeight,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        marginVertical:20
    },
    textView:{
        width:width/2.5
    },
    text:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    inputViewStyle:{
        height:font.headerHeight-15,
        width:font.headerHeight+10,
        borderWidth:1,
        borderRadius:5,
        borderColor:color.secondary,
        alignItems:'center',
        justifyContent:'center'
    },
    inputStyle:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    buttonVie:{
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:20
    },
    updateButton:{
        height:font.headerHeight-10,
        width:font.headerHeight*2,
        borderRadius:5,
        backgroundColor:color.tertiary,
        alignItems:'center',
        justifyContent:'center'
    },
    updateText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    },
    gstView:{
        flexDirection:'row',
        alignItems:'center',
        left:5
    },
    percentage:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        left:5
    }
})

export default style