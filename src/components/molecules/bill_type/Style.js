import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height/2,
        width:width,
        alignItems:'center',
        backgroundColor:color.white
    },
    pdfButton:{
        height:font.headerHeight,
        width:font.headerHeight*2.5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        borderRadius:10,
        backgroundColor:color.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:7,
    },
    pdfText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    btDevicesView:{
        height:font.headerHeight,
        width:width,
        paddingHorizontal:20,
        alignItems:'center',
        flexDirection:'row',
        marginVertical:8
    },
    textStyle:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        width:width/1.5,
        marginLeft:10
    },
    header:{
        height:font.headerHeight,
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    headerText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.bold,
        color:color.tertiary
    },
    subText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.low,
        color:color.darkGray
    }
})

export default style;