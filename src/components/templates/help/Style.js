import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    button:{
        height:font.headerHeight,
        width:width-10,
        margin:5,
        borderRadius:2,
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:color.backgroundColor,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation:1,
    },
    buttonTextStyle:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:15
    },
    iconStyle:{
        marginLeft:10
    }
})

export default style