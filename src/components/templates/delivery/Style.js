import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {height,width} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    orderListView:{
        width:width,
        height:height-font.headerHeight*2+10
    },
    orderView:{
        width:width-10,
        margin:5,
        backgroundColor:color.white,
        borderRadius:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
    },
    footer:{
        height:font.headerHeight
    },
    emptyOrder:{
        width:width,
        height:height-font.headerHeight*2.3,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'center'
    },
    emptyOrderText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.bold,
        color:color.borderColor
    },
    loader:{
        width:width,
        height:font.headerHeight-10,
        alignItems:'center',
        justifyContent:'center',
        zIndex:1000,
        bottom:height/2,
        position:'absolute'
    }
})

export default style