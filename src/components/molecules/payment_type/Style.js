import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        width:width,
        height:height/2,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'space-evenly',
    },
    paymentTypeSelectView:{
        width:width-100,
        height:font.headerHeight,
        flexDirection:"row",
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    iconstyle:{
        margin:5
    },
    paymentTypeText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    heading:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        marginRight:10,
        color:color.darkGray
    },
    conformButton:{
        height:font.headerHeight-10,
        width:font.headerHeight*2,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.secondary,
        marginBottom:20
    },
    conformText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    },
    dummy:{
        height:45,
        width:35
    }
})

export default style