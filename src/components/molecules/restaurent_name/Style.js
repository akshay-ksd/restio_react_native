import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window")

const style = StyleSheet.create({
    container:{
        width:width,
        height:font.headerHeight-20,
        alignItems:'center',
        justifyContent:'center'
    },
    nameText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    }
})

export default style