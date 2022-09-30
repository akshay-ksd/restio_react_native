import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width-10,
        margin:5,
        backgroundColor:color.white,
        borderRadius:5,
        shadowColor: color.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
    },
    productView:{
        width:width-10,
        margin:5,
        backgroundColor:color.white,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginVertical:10,
        paddingHorizontal:20
    },
    vegIconView:{
        marginHorizontal:10
    },
    productDetailsView:{
        width:width-100,

    },
    countView:{
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:10
    },
    iconstyle:{
        margin:5
    },
    productNameText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginVertical:3
    },
    productDetailsText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.normal,
        color:color.darkGray,
        marginVertical:2
    },
    countText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    buttonView:{
        height:font.headerHeight,
        width:width-10,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:10,
        flexDirection:'row'
    },
    button:{
        height:font.headerHeight-15,
        borderRadius:5,
        backgroundColor:color.tertiary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:15,
        width:width-font.headerHeight*3,
    },
    buttonTextStyle:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white,
        marginHorizontal:15
    },
    noteView:{
        marginLeft:25
    },
    note:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.secondary,
    },
    header:{
        paddingVertical:10,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        paddingHorizontal:20
    },
    id:{
        fontSize:font.size.font8,
        fontWeight:font.weight.low,
        color:color.darkGray,
        width:width/3
    },
    time:{
        fontSize:font.size.font8,
        color:color.darkGray,
        fontWeight:font.weight.low
    },
    button1:{
        height:font.headerHeight-15,
        borderRadius:5,
        backgroundColor:color.primary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:15,
        width:width-font.headerHeight*3,
    },
    taskComplete:{
        alignItems:'center',
        justifyContent:'center',
    },
    completeText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.secondary
    },
    loader:{
        top:font.size.font16,
        position:'absolute',
        zIndex:100
    },
    pbutton:{
        width:font.headerHeight+30,
        height:font.headerHeight-15,
        borderRadius:5,
        backgroundColor:color.primary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row',
        padding:5
    },
    pText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white,
    },
    connectedDevice:{
        width:width,
        height:font.headerHeight/2,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        marginBottom:10
    },
    connectDeviceText:{
        fontSize:font.size.font12,
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
    }
})

export default style