import { StyleSheet,Dimensions } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:font.headerHeight,
        width:width-15,
        margin:10,
        borderRadius:5,
        backgroundColor:color.white,
        shadowColor: color.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
        // bottom:30,
        // position:'absolute',
        borderWidth:0,
        borderColor:color.secondary,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    itemView:{
        height:font.headerHeight,
        alignItems:'center',
        justifyContent:'center',
        left:10
    },
    text:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    button:{
        height:font.headerHeight-10,
        width:width/2.5,
        borderRadius:5,
        backgroundColor:color.secondary,
        alignItems:'center',
        justifyContent:'center',
        right:4
    },
    buttonText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.full,
        color:color.white
    },
    orderplaceLoader:{
        alignItems:'center',
        justifyContent:'center',
        height:font.headerHeight
    },
    toggleView:{
        alignItems:'center',
        justifyContent:'center'
    },
    charge:{
        fontSize:font.size.font8,
        color:color.borderColor
    }
})

export default style;