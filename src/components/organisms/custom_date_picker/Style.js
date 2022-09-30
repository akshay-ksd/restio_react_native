import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {height,width} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        height:height/3,
        width:width,
        backgroundColor:color.white
    },
    incomeExpence:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        marginVertical:10
    },
    icomeButton:{
        height:font.headerHeight-10,
        width:font.headerHeight*2,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    icomeText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    iconStyle:{
        margin:0
    },
    datePicker:{
        height:font.headerHeight-10,
        width:font.headerHeight*2.5,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:5,
        backgroundColor:color.white,
        borderRadius:5,
        borderWidth:1,
        borderColor:color.secondary
    },
    datePickerText:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    amountView:{
        alignItems:'center',
        justifyContent:'center',
        marginVertical:20
    },
    amountText:{
        fontSize:font.size.font16,
        fontWeight:font.weight.full,
        color:color.borderColor,
    }
})

export default style;