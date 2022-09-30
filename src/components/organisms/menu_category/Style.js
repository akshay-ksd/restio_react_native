import { StyleSheet, Dimensions } from "react-native";
import color from '../../../theme/colors';
import font from '../../../theme/font';

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:font.categoryHeight,
        width:width-20,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        borderRadius:5,
        flexDirection:'row',
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
        marginHorizontal:10
    },
    categoryList:{
        height:font.categoryHeight-20,
        alignItems:'center',
        justifyContent:'center',
        margin:2.5,
        borderRadius:5,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        margin:5,
        backgroundColor:color.white,
        borderWidth:0,
        borderColor:color.secondary,
        borderWidth:1.5
    },
    categoryText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white,
        marginHorizontal:10
    },
    more:{
        height:font.categoryHeight-30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
        margin:5,
        backgroundColor:color.primary,
        flexDirection:'row'
    },
    moreText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.full,
        color:color.white,
        marginHorizontal:5
    },
    iconStyle:{
        margin:5
    },
    verticalMenuView:{
        height:height,
        width:width,
        zIndex:1,
        backgroundColor:color.tranceparrent,
        bottom:0,
    },
    categoryView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        marginHorizontal:5,
        
    },
    editIconView:{
        marginHorizontal:10
    }
})

export default style