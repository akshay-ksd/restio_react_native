import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window")

const style = StyleSheet.create({
    container:{
        height:font.headerHeight+10,
        width:width,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:1,
    },
    filterView:{
        height:font.categoryHeight-20,
        alignItems:'center',
        justifyContent:'center',
        margin:2.5,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
        margin:5,
        backgroundColor:color.white,
        borderColor:color.borderColor,
        borderWidth:1.5,
        paddingHorizontal:20
    },
    filterText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.bold,
        color:color.white,
        // marginHorizontal:5
    },
})

export default style;