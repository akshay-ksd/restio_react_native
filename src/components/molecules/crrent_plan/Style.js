import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:font.headerHeight+10,
        width:width-60,
        margin:10,
        borderRadius:5,
        backgroundColor:color.borderColor,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row',
    },
    block:{
        alignItems:'center',
        justifyContent:'space-evenly',
    },
    blockText:{
        fontSize:font.size.font16,
        color:color.white,
        fontWeight:font.weight.low,
        marginVertical:2
    }
})

export default style