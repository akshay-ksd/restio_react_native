import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";

const {height,width} = Dimensions.get('window')

const style = StyleSheet.create({
    container:{
        height:height/10,
        width:width,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.white
    }
})

export default style