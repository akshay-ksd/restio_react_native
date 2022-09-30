import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    pContainer:{
        height:font.headerHeight/2,
        paddingHorizontal:10,
        borderRadius:5,
        backgroundColor:color.secondary,
        alignItems:'center',
        justifyContent:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:1,
    },
    pText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.white
    },
    pressent:{
        height:font.headerHeight/2,
        paddingHorizontal:10,
        borderRadius:5,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:color.green,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:1
    },
    presentText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    }
})

export default style