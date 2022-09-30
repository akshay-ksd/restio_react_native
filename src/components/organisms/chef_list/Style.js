import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');
const containerHeight = (height/2)-(font.headerHeight*2)
const style = StyleSheet.create({
    container:{
        width:width-10,
        height:(height/2)-(font.headerHeight*2.3),
        margin:5,
        borderRadius:5,
        shadowColor: color.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:0,
        backgroundColor:color.backgroundColor
    },
    heading:{
        width:width,
        alignItems:'center',
        // justifyContent:'space-evenly',
        flexDirection:'row',
        marginVertical:4
    },
    stick:{
        height:font.size.font6-5,
        width:width/4,
        backgroundColor:color.darkGray
    },
    headerText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.low,
        color:color.darkGray,
        marginLeft:20
    },
    staffBox:{
        height:containerHeight/2-30,
        width:width/3-20,
        borderRadius:5,
        margin:5,
        backgroundColor:color.gray,
        alignItems:'center',
        justifyContent:'center',
        borderColor:color.white,
        borderWidth:1.5,
        shadowColor: color.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
    },
    listContainer:{
        width:width-10,
        height:(height/2)-(font.headerHeight*2.5),
        padding:5
    },
    name:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginVertical:1
    },
    assignedView:{
        height:20,
        padding:3,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.green,
        borderRadius:3,
        top:10,
        paddingHorizontal:5
    },
    assignText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.gray
    }
})

export default style