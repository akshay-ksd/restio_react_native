import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window')

const style = StyleSheet.create({
    container:{
        width:width,
        backgroundColor:color.backgroundColor,
        marginVertical:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
    },
    productView:{
        width:width/2.5,
        height:font.headerHeight,
        justifyContent:'center'
    },
    productName:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    priceView:{
        flexDirection:'row',
        marginTop:5
    }
})

export default style