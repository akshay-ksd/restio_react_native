import { StyleSheet,Dimensions } from "react-native";
import color from "../../theme/colors";
import font from "../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height,width:width,
        backgroundColor:color.backgroundColor
    }
})

export default style