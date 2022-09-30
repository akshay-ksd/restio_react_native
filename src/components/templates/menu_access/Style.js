import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:color.backgroundColor,
    },
    menuContainer:{
        height:font.headerHeight,
        width:width-10,
        margin:5,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'space-between',
        padding:10,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
        backgroundColor:color.backgroundColor,
        flexDirection:'row',
        paddingHorizontal:font.headerHeight
    },
    menuName:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    menuListView:{
        flex:1,
        backgroundColor:color.white
    }
})

export default style