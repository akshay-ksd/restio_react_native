import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width,
        backgroundColor:color.backgroundColor,
        padding:15,
    },
    planView:{
        backgroundColor:color.white
    },
    loader:{
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default style