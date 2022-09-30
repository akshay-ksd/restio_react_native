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
    printBox:{
        width:width-40,
        height:height-font.headerHeight*3,
        borderRadius:1,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        // justifyContent:'space-evenly',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:1,
        margin:20
    },
    restNameInputView:{
        height:font.headerHeight,
        width:width-font.headerHeight*2,
        justifyContent:'center',
        borderColor:color.gray,
        borderWidth:1,
        borderRadius:5,
        marginVertical:10
    },
    addressnputView:{
        height:font.headerHeight*2,
        width:width-font.headerHeight*2,
        borderColor:color.gray,
        borderWidth:1,
        borderRadius:5,
        marginVertical:10,
        padding:5
    },
    restInput:{
        fontSize:font.size.font14,
        fontWeight:font.weight.low,
        color:color.borderColor
    },
    updateButtonView:{
        height:font.headerHeight*3,
        alignItems:"flex-end",
        justifyContent:"center"
    },
    button:{
        height:font.headerHeight-5,
        width:font.headerHeight*3,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.primary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:1,
    },
    buttonText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    }
})

export default style