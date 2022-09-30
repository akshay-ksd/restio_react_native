import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:font.headerHeight-10,
        width:width,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row'
    },
    box:{
        height:font.headerHeight-15,
        width:font.headerHeight*2.5,
        alignItems:'center',
        justifyContent:"center",
        borderRadius:5,
        backgroundColor:color.backgroundColor,
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
    boxText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    }
})

export default style