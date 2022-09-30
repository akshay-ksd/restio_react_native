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
    inPutView:{
        width:width,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:0.5,
        borderColor:color.darkGray,
        borderStyle:'dashed'
    },
    inputViewStyle:{
        height:font.headerHeight*4,
        width:width-10,
        margin:5,
        borderRadius:5,
        borderWidth:0.5,
        borderColor:color.primary,
        marginVertical:15,
        backgroundColor:color.gray
    },
    inputStyle:{
        fontSize:font.size.font14,
        color:color.borderColor,
        fontWeight:font.weight.low,
        left:5
    },
    whatsAppButtonView:{
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    whatsAppButton:{
        height:font.headerHeight-10,
        width:font.headerHeight*2,
        borderRadius:5,
        backgroundColor:color.tertiary,
        marginVertical:10,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row'
    },
    whatsAppButtonText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    },
    iconStyle:{
        margin:0
    },
    sendthroughtext:{
        marginVertical:10,
        fontSize:font.size.font12
    }
})

export default style;