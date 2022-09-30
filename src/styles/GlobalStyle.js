import { StyleSheet,Dimensions } from "react-native";
const {width,height} = Dimensions.get("window")

const global_style = StyleSheet.create({
    center:{
        alignItems:'center',
        justifyContent:'center'
    },
    spaceBeteween:{
        alignItems:'center',
        justifyContent:'space-between'
    },
    spaceEvenly:{
        alignItems:'center',
        justifyContent:'space-evenly'
    }
})