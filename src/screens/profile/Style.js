import { Dimensions, StyleSheet } from "react-native";
import color from "../../theme/colors";
import font from "../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor
    },
    buttonView:{
        height:height-font.headerHeight*2,
        width:width,
        backgroundColor:color.backgroundColor,
        // alignItems:'center',
    },
    button:{
        height:font.headerHeight+20,
        width:width-10,
        margin:8,
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
        elevation:0.5,
        borderRadius:10,
        marginTop:10,
        paddingHorizontal:10
    },
    buttonText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:20
    },
    iconStyle:{
        marginLeft:10
    }
})

export default style