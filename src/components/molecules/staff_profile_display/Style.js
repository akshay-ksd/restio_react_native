import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');
const avathar = font.headerHeight+10
const style = StyleSheet.create({
    container:{
        height:font.headerHeight*2,
        width:width-10,
        backgroundColor:color.backgroundColor,
        borderRadius:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:0,
        alignItems:'center',
        flexDirection:'row',
        // borderWidth:2
    },
    avathar:{
        width:font.headerHeight-20,
        height:font.headerHeight-20,
        borderRadius:avathar/2,
        borderWidth:2.5,
        borderColor:color.secondary,
        alignItems:'center',
        justifyContent:'center',
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:20,
        backgroundColor:color.tertiary,
    },
    nameText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor,
    },
    access:{
        fontSize:font.size.font8,
        fontWeight:font.weight.low,
        color:color.darkGray,
    },
    nameTextView:{
        width:width/2.1,
    },
    avatharText:{
        fontSize:font.size.font14,
        color:color.borderColor
    },
    offlineView:{
        height:font.headerHeight,
        width:font.headerHeight*2,
        alignItems:'center',
        justifyContent:'center'
    },
    offlineText:{
        fontSize:font.size.font8,
        fontWeight:font.weight.semi,
        color:color.primary,
        marginVertical:2
    }
})

export default style