import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height-(font.headerHeight*3),
        width:width,
        backgroundColor:color.backgroundColor
    },
    footer:{
        width:width,
        height:font.headerHeight,
        backgroundColor:color.backgroundColor
    },
    categoryListView:{
        height:font.headerHeight,
        width:width-10,
        margin:5,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        borderRadius:5,
        shadowColor: color.borderColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation:2,
        // borderWidth:0.2,
        borderColor:color.secondary,
        flexDirection:'row'
    },
    categoryText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:15,
        width:width-font.headerHeight-10
    },
    iconStyle:{
        margin:5
    },
    categoryeditButton:{
        height:font.headerHeight+10,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row'
    },
    buttonView:{
        height:font.headerHeight-10,
        paddingHorizontal:20,
        borderRadius:5,
        backgroundColor:color.backgroundColor,
        alignItems:"center",
        justifyContent:'space-evenly',
        flexDirection:'row',
        shadowColor: color.borderColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation:4,
    },
    buttonText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    selectedCategory:{
        height:font.headerHeight/2,
        width:width-10,
        backgroundColor:color.secondary,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:2,
        marginLeft:5,
        marginBottom:2
    },
    selectedCategoryText:{
        fontSize:font.size.font18,
        color:color.white,
        fontWeight:font.weight.low
    },
    categoryUploadLoaderView:{
        alignItems:'center',
        justifyContent:'center',
        marginLeft:5
    },
    categoryUploadText:{
        fontSize:font.size.font8,
        fontWeight:font.weight.semi,
        color:color.darkGray,
        marginVertical:1
    }
})

export default style