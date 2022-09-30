import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width,
        height:height,
        backgroundColor:color.backgroundColor
    },
    addProductView:{
        height:font.headerHeight,
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    addProductButton:{
        height:font.headerHeight-10,
        width:width-font.headerHeight,
        borderRadius:5,
        backgroundColor:color.primary,
        alignItems:'center',
        justifyContent:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        borderWidth:1.5,
        borderColor:color.white
    },
    addText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    },
    productListView:{
        width:width,
        height:height-font.headerHeight*2
    },
    modelView:{
        height:height,
        width:width,
        backgroundColor:color.tranceparrent,
        padding:10,
        alignItems:'center',
        justifyContent:'center'
    },
    tableView:{
        height:height/2,
        width:width-20,
        borderRadius:5
    },
    selectTextView:{
        width:width,
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center'
    },
    selectText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.gray
    },
    footer:{
        height:height/2
    }
})

export default style