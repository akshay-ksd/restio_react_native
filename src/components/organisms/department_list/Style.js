import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width,
        backgroundColor:color.backgroundColor,
    },
    departmentHeadingView:{
        width:width,
        height:font.headerHeight-10,
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:1,
        borderColor:color.secondary,
        borderStyle:'dashed',
        marginVertical:10
    },
    departmentHeading:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.darkGray
    },
    departmentButtonView:{
        width:width,
        backgroundColor:color.backgroundColor,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        marginTop:20
    },
    button:{
        height:font.headerHeight,
        borderRadius:5,
        backgroundColor:color.white,
        flexDirection:'row',
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        width:font.headerHeight*2,
        justifyContent:'space-evenly'
    },
    buttonText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.secondary,
        marginHorizontal:10
    },
    addButtonView:{
        width:width,
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    },
    addButton:{
        height:font.headerHeight-10,
        width:font.headerHeight*3,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.tertiary,
        borderRadius:5,
    },
    addButtonText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.white
    }
})

export default style