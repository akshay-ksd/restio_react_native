import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window")

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:color.backgroundColor,
        padding:10,
        alignItems:'center',
        paddingVertical:25,
        borderRadius:5
    },
    box:{
        height:width/3-25,
        width:width/3-25,
        borderRadius:5,
        backgroundColor:"#FFCCCB",
        margin:5,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2.5,
        alignItems:"center",
        justifyContent:'center'
    },
    tableText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.bold,
        color:color.borderColor
    },
    tableTextName:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.darkGray
    },
    loaderView:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default style