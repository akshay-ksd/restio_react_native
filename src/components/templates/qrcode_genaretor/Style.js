import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window')

const style = StyleSheet.create({
    container:{
        width:width,
        height:height,
        backgroundColor:color.white
    },
    qrView:{
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        height:height/2.5
    },
    selectedId:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginVertical:10
    },
    qr:{
        padding:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        backgroundColor:color.white,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
    },
    button:{
        width:font.headerHeight*2,
        height:font.headerHeight-15,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:3,
        backgroundColor:color.tertiary,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row'
    },
    buttonText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.white
    }
})

export default style;