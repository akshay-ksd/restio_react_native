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
    productListView:{
        width:width-(width/3),
        height:height-font.headerHeight,
        backgroundColor:color.gray
    },
    noProductFoundView:{
        width:width-(width/3),
        height:height-font.headerHeight*2,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'center'
    },
    emptyText:{
        fontSize:font.size.font14,
        color:color.borderColor,
        fontWeight:font.weight.semi
    },
    blankView:{
        height:font.headerHeight,
        width:width
    },
    productmenuView:{
        width:width,
        height:height-font.headerHeight,
        flexDirection:'row'
    }
})

export default style