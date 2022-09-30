import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.gray
    },
    orderListView:{
        width:width,
        height:height-font.headerHeight*2+10,
    },
    orderView:{
        width:width-10,
        margin:5,
        backgroundColor:color.white,
        borderRadius:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
    },
    footer:{
        height:font.headerHeight*3,
        alignItems:'center',
        justifyContent:'center'
    },
    emptyOrderView:{
        width:width,
        height:height-font.headerHeight*2+10,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center'
    },
    emptyOrderText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    printerConnectionView:{
        width:width,
        height:(font.headerHeight/2)+10,
        alignItems:'center',
        justifyContent:'center'
    },
    priterConnectionButton:{
        height:font.headerHeight/2,
        width:width-(font.headerHeight*2),
        margin:5,
        alignItems:'center',
        justifyContent:'space-between',
        borderRadius:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        flexDirection:'row',
        paddingHorizontal:10
    },
    connectText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.white
    },
    closeButton:{
        height:font.headerHeight/2.2,
        width:font.headerHeight/2.2,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:font.headerHeight/2.2,
        backgroundColor:color.white
    }
})

export default style