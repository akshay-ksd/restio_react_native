import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window")
const halfHeight = height/3
const style = StyleSheet.create({
    container:{
        height:halfHeight-30,
        width:width,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'space-evenly',
        marginVertical:0
    },
    boxView:{
        height:halfHeight/3,
        width:width,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
    },
    box:{
        height:halfHeight/3.5,
        width:width/2-30,
        margin:5,
        borderRadius:5,
        borderWidth:1,
        borderColor:color.secondary,
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    dayText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.darkGray
    },
    priceText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    heading:{
        alignItems:'center',
        justifyContent:'center',
        marginVertical:20
    },
    headingText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor
    }
})

export default style