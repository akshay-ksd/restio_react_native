import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    filterButton:{
        height:font.headerHeight-10,
        paddingHorizontal:10,
        backgroundColor:color.white,
        borderRadius:5,
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
        borderWidth:1.5
    },
    filterText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    }
})

export default style