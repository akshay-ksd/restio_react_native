import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:font.headerHeight*2,
        width:font.headerHeight*2,
        borderRadius:5,
        backgroundColor:color.gray,
        borderWidth:2,
        borderColor:color.white,
        alignItems:'center',
        justifyContent:'center',
        shadowColor:color.darkGray,
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.2,
        shadowRadius:100,
        elevation:2,
        margin:5
    },
    plan:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.primary,
        margin:5
    },
    priceText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.darkGray
    }
})

export default style