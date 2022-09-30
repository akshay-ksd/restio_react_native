import { Dimensions, StyleSheet } from "react-native";
import color from "../../theme/colors";
import font from "../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    addButtonView:{
        alignItems:'center',
        justifyContent:'center',
        marginVertical:40
    },
    addButton:{
        height:font.headerHeight-10,
        width:font.headerHeight*2,
        borderRadius:5,
        backgroundColor:color.tertiary,
        alignItems:'center',
        justifyContent:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:5,
        zIndex:0
    },
    addButtonText:{
        fontSize:font.size.font20,
        fontWeight:font.weight.semi,
        color:color.white
    },
    paymentType:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        padding:20
    },
    typeBox:{
        alignItems:'center',
        justifyContent:'center'
    },
    cashText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginVertical:5
    },
    loader:{
        bottom:10,
        zIndex:20
    },
    updateButtonView:{
        width:width,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row'
    }
})

export default style