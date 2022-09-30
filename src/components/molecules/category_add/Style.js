import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');
const radius = font.headerHeight/2
const style = StyleSheet.create({
    container:{
        height:font.headerHeight+10,
        width:width,
        backgroundColor:color.backgroundColor,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    inputView:{
        height:font.headerHeight,
        width:width-(font.headerHeight*2),
        borderWidth:1,
        borderRadius:5,
        flexDirection:'row',
        borderColor:color.tertiary,
    },
    inputStyle:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:10
    },
    buttonView:{
        height:font.headerHeight-10,
        width:font.headerHeight*1.5,
        borderRadius:5,
        backgroundColor:color.tertiary,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:5
    },
    buttonText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    }
})

export default style