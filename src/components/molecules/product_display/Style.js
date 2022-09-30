import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        width:width-(width/2.5),
        backgroundColor:color.white,
        flexDirection:'row',
        margin:5,
        marginVertical:10,
        borderRadius:10,
        borderWidth:1.5,
        borderColor:color.gray,
        left:10
    },
    vegView:{
        margin:5,
        alignItems:'center',
        justifyContent:'center'
    },
    productDetailsView:{
        margin:5,
        width:width/4,
        marginLeft:20
    },
    productName:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.black,
        marginLeft:5
    },
    productDetails:{
        fontSize:font.size.font8,
        fontWeight:font.weight.low,
        color:color.darkGray,
        marginVertical:5,
    },
    price:{
        fontSize:font.size.font12,
        fontWeight:font.weight.bold,
        color:color.borderColor,
        marginLeft:10
    },
    editButtonView:{
        height:font.headerHeight,
        flexDirection:'row',
        width:font.headerHeight*2.4,
        alignItems:'center',
        justifyContent:'space-evenly',
        marginLeft:10
    },
    editButton:{
        alignItems:'center',
        justifyContent:'center',
    },
    iconTextView:{
        flexDirection:'row',
        alignItems:'center',
    },
    iconstyle:{
        marginLeft:2
    },
    delete:{
        fontSize:font.size.font8,
        color:color.darkGray
    },
    toggle:{
        marginLeft:20,
        alignItems:'center',
        justifyContent:'center',
    }
})

export default style