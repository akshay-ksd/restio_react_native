import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height-font.headerHeight*2,
        width:width,
        backgroundColor:color.backgroundColor
    },
    dateButtonView:{
        height:font.headerHeight,
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    datePicker:{
        height:font.headerHeight-20,
        paddingHorizontal:10,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'space-evenly',
        backgroundColor:color.tertiary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        flexDirection:'row'
    },
    boxText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.white
    },
    staffList:{
        flex:1,
        backgroundColor:color.backgroundColor
    },
    updateButtonView:{
        height:font.headerHeight,
        width:width,
        alignItems:'center',
        justifyContent:'center',
        bottom:0,
        position:'absolute',
    },
    updateButton:{
        height:font.headerHeight-5,
        width:width-font.headerHeight*2,
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
        elevation:2,
    },
    footer:{
        width:width,
        height:font.headerHeight*1.5
    }
})

export default style