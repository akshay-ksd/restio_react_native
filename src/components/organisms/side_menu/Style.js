import { StyleSheet, Dimensions } from "react-native";
import color from '../../../theme/colors';
import font from '../../../theme/font';

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width/3,
        backgroundColor:color.backgroundColor,
        // borderRadius:5,
        // shadowColor: color.darkGray,
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation:3,
        // marginHorizontal:10,
        flex:1
    },
    categoryList:{
        height:font.categoryHeight-20,
        width:width/3.5,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:4,
        marginTop:10,
        backgroundColor:color.white,
        borderWidth:2
    },
    categoryText:{
        fontSize:font.size.font12,
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
        marginVertical:10
    },
    editIconView:{
        marginHorizontal:10
    }
})

export default style