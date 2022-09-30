import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width,
        height:height,
        backgroundColor:color.backgroundColor
    },
    currentStepView:{
        width:width-0,
        height:font.headerHeight-10,
        // alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:1,
        borderColor:color.primary,
        borderStyle:'dashed',
        marginHorizontal:5
    },
    stepText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:15
    },
    categoryselectView:{
        width:width,
        height:height - (font.headerHeight*3),
        backgroundColor:color.backgroundColor,
    },
    buttonView:{
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.backgroundColor,
        bottom:20
    },
    nextButton:{
        height:font.headerHeight-10,
        width:font.headerHeight*2,
        borderRadius:5,
        backgroundColor:color.tertiary,
        alignItems:"center",
        justifyContent:'center'
    },
    nextButtonText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.white
    },
    productAddView:{
        width:width,
        height:height - (font.headerHeight*3),
        backgroundColor:color.backgroundColor,
    }
})

export default style