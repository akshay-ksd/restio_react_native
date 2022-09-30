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
    heading:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
    },
    categoryView:{
        width:width/2,
        height:font.headerHeight,
        justifyContent:'center',
    },
    priceView:{
        height:font.headerHeight,
        width:font.headerHeight,
        justifyContent:'center',
    },
    footer:{
        height:font.headerHeight
    },
    totalView:{
        width:width,
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.gray
    },
    totalText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.primary
    }
})

export default style;