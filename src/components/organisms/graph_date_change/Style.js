import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height/3,
        width:width,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    buttonView:{
        height:font.headerHeight,
        width:width,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:color.white,
        marginLeft:20
    },
    buttonText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:10
    },
    iconStyle:{
        margin:0
    },
    applyButton:{
        height:font.headerHeight-10,
        width:font.headerHeight*2,
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
        elevation:5,
        marginBottom:10
    },
    applyButtonText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    },
    applyView:{
        alignItems:'center',
        justifyContent:'center',
        marginBottom:15
    }
})

export default style;