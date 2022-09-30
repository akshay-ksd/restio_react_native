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
    addStaffButtonView:{
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    addStaffButton:{
        height:font.headerHeight-10,
        width:width-10,
        borderRadius:5,
        backgroundColor:color.primary,
        alignItems:'center',
        justifyContent:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
        flexDirection:'row'
    },
    addStaffText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.white,
        marginLeft:10
    },
    iconStyle:{
        marginHorizontal:10
    },
    staffList:{
        height:height-font.headerHeight*2,
        width:width,
        backgroundColor:color.backgroundColor,
        marginTop:10
    }
})

export default style