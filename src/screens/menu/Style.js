import { StyleSheet,Dimensions } from "react-native";
import color from "../../theme/colors";
import font from "../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    productListView:{
        height:height-(font.headerHeight*2),
        width:width-(width/3),
        backgroundColor:color.gray,
    },
    footer:{
        height:height/2
    },
    emptyProductView:{
        height:height-(font.headerHeight*2),
        width:width-(width/3),
        backgroundColor:color.backgroundColor,
        alignItems:"center",
        justifyContent:'center'
    },
    emptyProductText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    emptyMenu:{
        width:width,
        height:font.headerHeight
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
    product_menu_view:{
        width:width,
        flex:1,
        flexDirection:'row'
    },
    sidemenuView:{
        width:width/3,
        flex:1
    },
    selectedcategoryName:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.secondary
    },
    selectedcategoryNameView:{
        width:width-(width/3),
        height:font.headerHeight/2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.white
    }
})

export default style