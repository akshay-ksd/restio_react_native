import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window')

const style = StyleSheet.create({
    container:{
        width:width,
        height:height,
        backgroundColor:color.backgroundColor
    },
    SendBox:{
        zIndex:5
    },
    inputView:{
        height:font.headerHeight,
        width:width-10,
        margin:5,
        borderColor:color.gray,
        borderWidth:1,
        borderRadius:5,
        justifyContent:'center',
        backgroundColor:color.gray
    },
    inputStyle:{
        marginLeft:15,
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    }
})

export default style