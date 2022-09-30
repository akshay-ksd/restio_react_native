import { StyleSheet,Dimensions } from "react-native";
import color from '../../../theme/colors'
import font from  '../../../theme/font'

const {width,height} = Dimensions.get('window')

const style = StyleSheet.create({
    container:{
        width:width-font.headerHeight-10,
        height:font.headerHeight*2-10,
        backgroundColor:color.white,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'space-evenly',
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:1.5,
    },
    currentPlanText:{
        fontSize:font.size.font10,
        color:color.borderColor,
        // margin:5
    },
    currentPlanView:{
        width:width-font.headerHeight-10,
        alignItems:'center',
        justifyContent:'center'
    },
    currPlane:{
        fontSize:font.size.font12,
        fontWeight:font.weight.full,
        color:color.tertiary,
        margin:0
    },
    planDetailsView:{
        width:width-font.headerHeight,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    subView:{
        width:(width-font.headerHeight)/2.2,
        backgroundColor:color.white,
        borderRadius:5,
        height:font.headerHeight,
    },
    validText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        margin:5
    },
    date:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.darkGray,
        marginLeft:8
    },
    notRechargeView:{
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    noRechargeText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    loader:{
        width:width,
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default style