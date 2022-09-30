import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get("window");

const style = StyleSheet.create({
    container:{
        height:height,
        width:width,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'center'
    },
    centerText: {
       fontSize:font.size.font16,
       fontWeight:font.weight.semi,
       color:color.secondary
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        padding: 16
      },
      buttonStyle:{
          height:font.headerHeight,
          width:font.headerHeight,
          borderRadius:(font.headerHeight/1.2)/1.2,
          alignItems:'center',
          justifyContent:'center',
          backgroundColor:color.secondary,
          // marginTop:font.headerHeight+10
      },
      textStyle:{
          fontSize:font.size.font10,
          fontWeight:font.weight.semi,
          color:color.white
      },
      authView:{
        flex:1,
        backgroundColor:color.backgroundColor,
        alignItems:'center',
        justifyContent:'center'
      },
      authText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
      }
})

export default style;