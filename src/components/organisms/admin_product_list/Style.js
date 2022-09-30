import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width-10,
        margin:5,
        backgroundColor:color.white,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        marginTop:15
    },
    productView:{
        width:width-15,
        margin:5,
        backgroundColor:color.white,
        flexDirection:'row',
        alignItems:'center',
        marginVertical:10,
    },
    vegIconView:{
        marginHorizontal:10
    },
    productDetailsView:{
        width:width-font.headerHeight*4.6,
        marginLeft:10
    },
    countView:{
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:0
    },
    iconstyle:{
        // margin:5
    },
    productNameText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginVertical:3,
    },
    productDetailsText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.normal,
        color:color.darkGray,
        marginVertical:2
    },
    countText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    totalView:{
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:10,
        marginLeft:font.headerHeight*1.3
    },
    totalText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    headingView:{
        alignItems:'center',
        flexDirection:'row',
        marginTop:5
    },
    itemTextView:{
        marginLeft:5,
        width:width-font.headerHeight*5,
    },
    itemText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.low,
        color:color.darkGray,
        margin:5,
        left:10
    },
    quantytyView:{
        alignItems:'center',
        justifyContent:'center',
        // marginLeft:10
    },
    gTotalView:{
        flexDirection:'row',
        width:width-10,
        backgroundColor:color.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:0
    },
    totalViews:{
        width:width/2-5
    },
    totalCuntent:{
        flexDirection:'row',
        // alignItems:'center',
        marginVertical:10,
    },
    totalSubCuntent:{
        width:(width/2-5)/1.8
    },
    totalSubCuntent1:{
        
    },
    gstText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.low,
        color:color.darkGray
    },
    Totaltext:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    deliveryButton:{
        height:font.headerHeight-10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.tertiary,
        borderRadius:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        marginLeft:35,
        marginVertical:10,
        marginRight:52,
        borderWidth:0,
        borderColor:color.tertiary,
    },
    deliveryText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.primary,
        marginHorizontal:5
    },
    bottomButton:{
        width:width-10,
        height:font.headerHeight+10,
        alignItems:'center',
        justifyContent:'space-evenly',
        backgroundColor:color.white,
        flexDirection:'row',
        marginVertical:10
    },
    payButton:{
        height:font.headerHeight-5,
        paddingHorizontal:10,
        backgroundColor:color.secondary,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        borderWidth:2,
        borderColor:color.white,
    },
    billText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.white,
        marginLeft:5
    },
    cancelledText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.primary
    },
    cancelButton:{
        height:font.headerHeight-5,
        width:font.headerHeight*2,
        backgroundColor:color.white,
        borderRadius:5,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row' ,
        borderWidth:0,
        borderColor:color.darkGray
    },
    billButton:{
        height:font.headerHeight-5,
        width:font.headerHeight*2,
        backgroundColor:color.white,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        alignItems:'center',
        justifyContent:'center' ,
        flexDirection:'row',
        borderWidth:2,
        borderColor:color.white
    },
    timeView:{
        height:font.headerHeight-15,
        width:width,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    timeText:{
        fontSize:font.size.font10
    },
    cancelledButton:{
        height:font.headerHeight-5,
        width:width-font.headerHeight,
        backgroundColor:color.white,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row' ,
        borderWidth:1,
        borderColor:color.primary,
        borderStyle:"dashed"
    },
    paidButton:{
        height:font.headerHeight-5,
        width:width/3,
        backgroundColor:color.white,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        borderWidth:1,
        borderColor:color.green,
        borderStyle:"dashed"
    },
    paidText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.full,
        color:color.borderColor,
        marginLeft:5
    },
    iconPriceView:{
        flexDirection:'row',
        alignItems:'center'
    },
    editText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.darkGray
    },
    tableView:{
        width:width-10,
        height:font.headerHeight-10,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row'
    },
    tableText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.bold,
        color:color.tertiary
    },
    tableTextse:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.darkGray
    },
    connectedDevice:{
        width:width,
        height:font.headerHeight/2,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    connectDeviceText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.darkGray,
        marginLeft:8,
        marginRight:22
    },
    btButton:{
        height:font.headerHeight/2,
        width:font.headerHeight/2,
        borderRadius:font.headerHeight/2,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:2,
        borderColor:color.gray
    },
    showMore:{
      height:font.headerHeight/2,
      borderRadius:10,
      alignItems:'center',
      justifyContent:'space-evenly',
      backgroundColor:color.secondary,
      paddingHorizontal:10,
      flexDirection:'row'
    },
    showText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.white,
        marginHorizontal:5
    },
    userView:{
        alignItems:'center',
        justifyContent:'center',
    },
    confirmButton:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.tertiary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        padding:5,
        paddingHorizontal:10,
        borderRadius:10,
        marginTop:5
    },
    confirmText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.white
    },
    list:{
        flex:1
    }
})

export default style