import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window")

const style = StyleSheet.create({
    container:{
        // height:font.headerHeight,
        // width:width-10,
        backgroundColor:color.gray,
        // alignItems:'center',
        // justifyContent:'center',
        paddingHorizontal:20,
        borderRadius:8,
        margin:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:0.5,
    },
    text:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,    },
    text1:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginVertical:10
    }
})

export default style