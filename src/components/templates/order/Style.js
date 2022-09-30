import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:color.backgroundColor,
    },
    loader:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    orderListView:{
        flex:1,
        backgroundColor:color.white
    },
    footer:{
        height:font.headerHeight*2,
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    orderView:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    noOrderText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    filterContainer:{
        height:height,
        width:width,
        position:'absolute',
        bottom:0,
        backgroundColor:color.tranceparrent,
        padding:20,
        alignItems:'flex-end',
        paddingTop:50
    },
    filterView:{
        width:height/5,
        justifyContent:'space-evenly',
        backgroundColor:color.white,
        borderRadius:10,
        padding:10
    },
    filterText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        // marginVertical:12
    },
    filtertView:{
        flexDirection:'row',
        width:height/7,
        padding:10,
        alignItems:'center',
        justifyContent:'space-between'
    },
    emptyOrder:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.white
    },
    emptyOrderText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    printerConnectionView:{
        width:width,
        height:(font.headerHeight/2)+10,
        alignItems:'center',
        justifyContent:'center',
        overflow:"hidden"
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
    },
    orderDetailsView:{
        height:height,
        width:width,
        position:'absolute',
        bottom:0,
        backgroundColor:color.tranceparrent
    },
    menuButton:{
        height:font.headerHeight,
        width:width,
        alignItems:'flex-end',
        justifyContent:'center',
        bottom:10,
        position:'absolute',
        paddingHorizontal:20
    },
  
})

export default style