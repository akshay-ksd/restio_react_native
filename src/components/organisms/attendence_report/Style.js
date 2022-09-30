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
    datePickerView:{
        height:font.headerHeight,
        width:width,
        alignItems:"center",
        justifyContent:"space-evenly",
        flexDirection:'row'
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
    loadButton:{
        height:font.headerHeight-20,
        width:font.headerHeight*1.5,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'space-evenly',
        backgroundColor:color.primary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        flexDirection:'row'
    }
})

export default style