import { Dimensions, StyleSheet } from "react-native";
import color from "../../theme/colors";
import font from "../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.gray
    },
    buttonView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        marginTop:10,
        padding:5
    },
    button:{
        width:width/2.6,
        height:width/2.6,
        borderRadius:3,
        backgroundColor:color.white,
        shadowColor: color.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 100,
        elevation:1,
        alignItems:'center',
        justifyContent:'space-evenly',
        padding:25,
        borderWidth:0.2,
        borderColor:color.gray
    },
    buttonHeaderVie:{
        alignItems:'center',
        justifyContent:'center',
        padding:5,
    },
    buttonHeadingText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        margin:5,
    },
    amountView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        padding:5
    },
    amountText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    dateDisplya:{
        width:width,
        alignItems:'center',
        justifyContent:'center',
        padding:20
    },
    dateText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    expenceButtonView:{
        alignItems:'center',
        justifyContent:'center'
    },
    expenceButton:{
        height:font.headerHeight-10,
        width:width-font.headerHeight*2,
        borderRadius:10,
        backgroundColor:color.secondary,
        alignItems:'center',
        justifyContent:'center',
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 100,
        elevation:2,
    },
    expenceButtonText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.white
    },
    datePickerView:{
        height:font.headerHeight,
        width:width,
        alignItems:"center",
        justifyContent:"space-evenly",
        flexDirection:'row'
    },
    datePicker:{
        height:font.headerHeight-20,
        paddingHorizontal:10,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'space-evenly',
        backgroundColor:color.tertiary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        flexDirection:'row'
    },
    boxText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.white
    },
})

export default style