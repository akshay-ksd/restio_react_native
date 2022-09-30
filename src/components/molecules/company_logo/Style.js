import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window')

const style = StyleSheet.create({
    container:{
       height:font.headerHeight,
       width:width,
       alignItems:'center',
       justifyContent:'center',
       backgroundColor:color.backgroundColor ,
       marginBottom:5
    },
    logoText:{
        fontSize:font.size.font10,
        fontWeight:font.weight.semi,
        color:color.black,
        marginTop:1
    },
    headingText:{
        fontSize:font.size.font8,
        color:color.darkGray
    }
})

export default style