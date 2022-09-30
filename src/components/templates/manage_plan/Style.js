import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    patmentDetailsView:{
        width:width,
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:1,
        borderColor:color.primaryLight,
        borderStyle:"dashed",
        height:font.headerHeight*2.5,
    },
    currentPlanView:{
        width:width,
        alignItems:'center',
        justifyContent:'center',
    },
    currentPlanText:{
        fontSize:font.size.font20,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginTop:10
    },
    otherPlan:{
        width:width,
    },
    otherPlanText:{
        fontSize:font.size.font20,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginTop:20
    },
    allPlansView:{
        width:width,
        // height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center',
        marginTop:15
    },
    plansText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.darkGray
    }
})

export default style