import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height-font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor,
    },
    inputContainer:{
        width:width,
        marginTop:20,
        alignItems:'center',
        justifyContent:'center'
    },
    heading:{
        fontSize:font.size.font10,
        fontWeight:font.weight.low,
        color:color.borderColor,
        marginLeft:5,
        marginBottom:2
    },
    inputView:{
        height:font.headerHeight,
        width:width-font.headerHeight,
        borderRadius:5,
        borderWidth:0.5,
        borderColor:color.borderColor,
        backgroundColor:color.backgroundColor,
        justifyContent:'center',
        marginVertical:2
    },
    inputStyle:{
        fontSize:font.size.font12,
        fontWeight:font.weight.low,
        color:color.borderColor,
        marginLeft:5
    },
    departMentsView:{
        width:width,
        backgroundColor:color.backgroundColor
    },
    status:{
        width:width,
        height:font.headerHeight*1.5,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    textStatus:{
        fontSize:font.size.font8,
        fontWeight:font.weight.semi,
        color:color.darkGray
    },
    statusText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.darkGray,
        marginVertical:5
    },
    headingView:{
        width:width-font.headerHeight
    }
    
})

export default style