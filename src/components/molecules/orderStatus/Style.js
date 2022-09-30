import { StyleSheet,Dimension, Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window')

const style = StyleSheet.create({
    container:{
        height:height/12,
        width:width-60,
        margin:5,
        borderRadius:10,
        backgroundColor:color.primary,
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        fontSize:font.size.font16,
        fontWeight:font.weight.normal,
        color:color.white
    },
    subText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.normal,
        color:color.borderColor,
        margin:5
    }
})

export default style