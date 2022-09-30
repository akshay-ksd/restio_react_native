import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window")
const radius = height-font.headerHeight/2
const style = StyleSheet.create({
    container:{
        height:height-font.headerHeight*5,
        width:width,
        backgroundColor:color.backgroundColor
    },
    marker:{
        fontSize:font.size.font18,
        color:color.backgroundColor
    },
    markerView:{
        height:font.headerHeight-15,
        width:font.headerHeight-15,
        borderRadius:radius,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.tertiary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:10,
        borderWidth:2.5,
        borderColor:color.white
    },
    offLineView:{
        height:height-font.headerHeight*5,
        width:width,
        backgroundColor:color.gray,
        alignItems:'center',
        justifyContent:'center'
    },
    offlineText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    }
})

export default style