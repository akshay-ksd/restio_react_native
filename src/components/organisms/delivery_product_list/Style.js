import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width-10,
        margin:5,
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
    },
    productView:{
        width:width-10,
        margin:5,
        backgroundColor:color.white,
        flexDirection:'row',
        alignItems:'center',
        marginVertical:5,
        marginLeft:20
    },
    vegIconView:{
        marginHorizontal:10
    },
    productDetailsView:{
        width:width-190,
    },
    countView:{
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:10
    },
    iconstyle:{
        // margin:5
    },
    productNameText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginVertical:3
    },
    productDetailsText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.normal,
        color:color.darkGray,
        marginVertical:3
    },
    countText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.primary
    },
    totalView:{
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:10,
        marginLeft:30
    },
    totalText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    headingView:{
        alignItems:'center',
        flexDirection:'row'
    },
    itemTextView:{
        marginLeft:15,
        width:width-210,
    },
    itemText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.low,
        color:color.darkGray,
        margin:5
    },
    quantytyView:{
        alignItems:'center',
        justifyContent:'center',
        marginLeft:20
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
        elevation:0,
        alignItems:'center',
        justifyContent:'center',
        marginTop:5

    },
    totalViews:{
        // width:width/1.5,
        // marginLeft:50,
        backgroundColor:color.gray,
        borderRadius:5
    },
    totalCuntent:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:8,
        marginHorizontal:20
    },
    totalSubCuntent:{
        width:(width/2-5)/1.5
    },
    totalSubCuntent1:{
        marginLeft:10
    },
    gstText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.low,
        color:color.darkGray
    },
    Totaltext:{
        fontSize:font.size.font16,
        fontWeight:font.weight.bold,
        color:color.borderColor
    },
    customerDetailsView:{
        width:width-10,
        backgroundColor:color.gray,
        marginTop:10,
        borderWidth:0.1,
        borderRadius:5,
        borderColor:color.darkGray,
        borderStyle:'dashed',
        padding:5
    },
    customerTextView:{
        width:width-10,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:5
    },
    customerText:{
        fontSize:font.size.font18,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        bottom:5
    },
    nameView:{
        flexDirection:'row',
        marginVertical:15,
        marginHorizontal:5
    },
    nameContentView:{
        width:width/3,
        marginLeft:5,
        flexDirection:'row',
        alignItems:'center'
    },
    nameText:{
        fontSize:font.size.font18,
        fontWeight:font.weight.semi,
        color:color.darkGray
    },
    nameText1:{
        fontSize:font.size.font18,
        fontWeight:font.weight.low,
        color:color.primary
    },
    nameContentView1:{
        marginLeft:5,
        flexDirection:'row',
        alignItems:'center'
    },
    buttonView:{
        // height:font.headerHeight+10,
        width:width-10,
        alignItems:'center',
        justifyContent:'center'
    },
    button:{
        height:font.headerHeight-10,
        width:width/2.5,
        borderRadius:5,
        backgroundColor:color.secondary,
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
        marginHorizontal:15,
        marginVertical:5,
        flexDirection:'row'
    },
    buttonTextStyle:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white,
        marginHorizontal:0
    },
    addressView:{
        // width:width,
        backgroundColor:color.white,
        // bottom:40,
        padding:10,
        margin:10,
        borderWidth:0.5,
        borderRadius:5,
        borderColor:color.darkGray,
        borderStyle:'dashed',
        marginTop:10
    },
    header:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:10
    },
    subHead:{
        marginLeft:10,
        marginTop:5,
        color:color.darkGray,
        fontSize:font.size.font12
    },
    name:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.black,
        marginLeft:10,
        marginTop:5
    },
    headerView:{
        alignItems:'center',
        justifyContent:'center'
    },
    nameBox:{
        marginTop:10
    },
    completedView:{
        height:font.headerHeight-10,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:5,
        borderWidth:0.5,
        borderRadius:5,
        paddingHorizontal:10,
        borderColor:color.darkGray,
        backgroundColor:color.white,
        borderStyle:'dashed'
    },
    completedText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.bold,
        color:color.tertiary
    },
    loader:{
        width:width,
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center'
    },
    iconStyle:{
        marginLeft:15
    },
    iconTextView:{
        alignItems:'center',
        flexDirection:'row'
    },
    addresscontainer:{
        // width:width,
        backgroundColor:color.white,
        padding:10,
        margin:10,
        borderWidth:1,
        borderRadius:5,
        borderColor:color.darkGray,
        borderStyle:'dashed'
    },
    header:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:10
    },
    subHead:{
        marginLeft:10,
        marginTop:20,
        fontSize:font.size.font10
    },
    name:{
        fontSize:font.size.font14,
        fontWeight:font.weight.low,
        color:color.black,
        marginLeft:10,
        marginTop:5
    },
    headerView:{
        alignItems:'center',
        justifyContent:'center'
    },
    editButtonView:{
        alignItems:'flex-end',
        justifyContent:'center',
        backgroundColor:color.gray,
        marginTop:5,
        borderRadius:5
    },
    editButton:{
        height:font.headerHeight-20,
        width:font.headerHeight+10,
        borderRadius:5,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center',
        margin:5,
        marginLeft:60,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
    },
    editBttonText:{
        fontSize:font.size.font20,
        fontWeight:font.weight.bold,
        color:color.white
    },
    number:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:10,
        marginTop:5
    },
    numberView:{
        height:font.headerHeight/2,
        width:width-20,
        alignItems:"center",
        flexDirection:'row'
    }
})

export default style