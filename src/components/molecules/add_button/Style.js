import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:font.headerHeight,
        // width:font.headerHeight*2,
        // backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center',
        top:font.headerHeight/4
    },
    addButton:{
        height:font.headerHeight-15,
        width:font.headerHeight*2-20,
        backgroundColor:color.white,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'space-evenly',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        margin:5,
        flexDirection:'row'
    },
    addText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.secondary
    },
    iconStyle:{
        marginHorizontal:5
    },
    pluseButton:{
        height:font.headerHeight-15,
        width:font.headerHeight*2.7,
        flexDirection:'row',
        backgroundColor:color.white,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'space-evenly',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        margin:5,
        borderWidth:0,
        borderColor:color.primary
    },
    iconView:{
        width:(font.headerHeight*2-20)/3,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    countText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    }
})

export default style