import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        margin:5
    },
    emoji:{
        fontSize:font.size.font20*2.5,
        fontWeight:font.weight.semi,
        color:color.borderColor
    }
})

export default style