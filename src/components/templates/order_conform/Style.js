import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'center',
        bottom:0,
        position:'absolute'
    },
    buttonView:{
        width:width-10,
        // height:font.headerHeight,
        borderRadius:10,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        borderWidth:2,
        borderColor:color.secondary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
    },
    orderText:{
        fontSize:font.size.font16,
        color:color.white,
        fontWeight:font.weight.semi,
        marginLeft:20
    },
    iconStyle:{
        marginRight:20
    },
    input:{
        width:width-100,
        margin:5,
        fontSize:font.size.font16,
        color:color.borderColor,
        fontWeight:font.weight.semi
    }

})

export default style