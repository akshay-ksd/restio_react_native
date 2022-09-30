import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        width:width-10,
        height:font.headerHeight,
        borderRadius:5,
        marginHorizontal:5,
        shadowColor: color.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
        backgroundColor:color.secondary,
        borderWidth:2,
        borderColor:color.white,
        padding:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        paddingHorizontal:20
    },
    sendText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    }
})

export default style