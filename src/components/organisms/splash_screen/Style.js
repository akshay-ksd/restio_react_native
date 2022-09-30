import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:color.secondary,
        alignItems:'center',
        justifyContent:'center'
    },
    logo:{
        height:font.headerHeight*4,
        width:font.headerHeight*4,
    },
    loaderView:{
        height:font.headerHeight,
        width:width,
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    }
})

export default style