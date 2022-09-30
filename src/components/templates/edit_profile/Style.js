import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window")
const profileImage = height/5
const style = StyleSheet.create({
    container:{
        width:width,
        height:height,
        backgroundColor:color.backgroundColor
    },
    editSectionView:{
        height:height-font.headerHeight,
        width:width,
        backgroundColor:color.backgroundColor
    },
    profilePictureView:{
        height:height/5,
        width:width,
        alignItems:'center',
        justifyContent:'center',
        marginTop:40
    },
    profilePictureUrl:{
        height:height/5,
        width:height/5,
        borderRadius:profileImage/2
    },
    profileEditButton:{
        height:40,
        width:40,
        borderRadius:20,
        backgroundColor:color.primary,
        alignItems:'center',
        justifyContent:'center',
        bottom:35,
        borderWidth:3,
        borderColor:color.white,
        left:40
    },
    iconStyle:{margin:0},
    profileInputView:{
        height:font.headerHeight+10,
        width:width,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.backgroundColor,
        marginTop:30
    },
    inputView:{
        height:font.headerHeight,
        width:width-50,
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:1,
        borderColor:color.primary,
        borderStyle:'dashed'
    },
    inputStyle:{
        fontSize:font.size.font20,
        color:color.black,
        height:font.headerHeight,
        width:width-50
    },
    hotelHeadingView:{
        width:width
    },
    hotelText:{
        marginLeft:30
    },
    saveButton:{
        height:font.headerHeight-10,
        width:font.headerHeight*2,
        borderRadius:5,
        backgroundColor:color.secondary,
        alignItems:'center',
        justifyContent:'center',
        marginTop:20
    },
    icomeText:{
        fontSize:font.size.font20,
        fontWeight:font.weight.semi,
        color:color.white
    },
    saveButtonView:{
        width:width,
        alignItems:'center',
        justifyContent:'center',
        marginTop:50
    }
})

export default style