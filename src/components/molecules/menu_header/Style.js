import { StyleSheet,Dimensions} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor,
        flexDirection:'row',
        alignItems:'center',
    },
    IconView:{
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:10
    },
    iconStyle:{
        margin:5,
        marginLeft:15
    },
    buttoView:{
        height:font.headerHeight,
        width:width-font.size.font30,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    button:{
        height:font.headerHeight-10,
        // width:font.headerHeight-10,
        alignItems:'center',
        justifyContent:'center',
        borderColor:color.primary
    },
    buttonTextStyle:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    button1:{
        height:font.headerHeight-10,
        // width:font.headerHeight-10,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center',
        borderColor:color.secondary
    },
    buttonTextStyle1:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    inputViewStyle:{
        height:font.headerHeight-13,
        width:width-(font.headerHeight-10*3+font.size.font30*4),
        borderWidth:0.5,
        borderColor:color.gray,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row',
        backgroundColor:color.gray
    },
    inputStyle:{
        fontSize:font.size.font12,
        fontWeight:font.weight.normal,
        width:width-(font.headerHeight-10*2+font.size.font30*5.5),
        height:font.headerHeight-10
    },
    iconStyle:{
        marginVertical:5
    }
})

export default style