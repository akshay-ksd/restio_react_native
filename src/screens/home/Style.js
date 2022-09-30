import { StyleSheet, Dimensions } from "react-native";
import color from '../../theme/colors'
import font from "../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
   container:{
    height:height,
    width:width,
    backgroundColor:color.backgroundColor
   },
   imageView:{
      height:height/2.5,
      width:width
   },
   loader:{
      width:width,
      height:height,
      backgroundColor:color.backgroundColor,
      alignItems:'center',
      justifyContent:'center'
   },
   expairedView:{
      width:width,
      alignItems:'center',
      justifyContent:'center',
      height:height/2
   },
   expairedText:{
      fontSize:font.size.font14,
      fontWeight:font.weight.semi,
      color:color.borderColor
   },
   contactus:{
      fontSize:font.size.font16,
      fontWeight:font.weight.full,
      color:color.secondary,
      textDecorationLine: 'underline',
      margin:5
   }
})

export default style