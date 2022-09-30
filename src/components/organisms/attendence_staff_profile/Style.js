import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:font.headerHeight*1.5,
        width:width-15,
        backgroundColor:color.backgroundColor,
        margin:7.5,
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
        flexDirection:'row'
    },
    avatharView:{
        height:font.headerHeight-10,
        width:font.headerHeight-10,
        borderRadius:font.headerHeight-10/2,
        borderWidth:1,
        borderColor:color.gray,
        margin:5,
        alignItems:'center',
        justifyContent:'center'
    },
    avatharText:{
        fontSize:font.size.font16,
        color:color.borderColor
    },
    nameView:{
        height:font.headerHeight-10,
        width:width/1.8,
        justifyContent:'space-evenly',
        paddingLeft:10
    },
    name:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    access:{
        fontSize:font.size.font8,
        fontWeight:font.weight.semi,
        color:color.darkGray
    }
})

export default style