import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        width:width-10,
        height:height/2-font.headerHeight*1.2,
        marginHorizontal:5,
        borderRadius:5,
        backgroundColor:color.white,
        shadowColor: color.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:0,
    },
    header:{
        width:width,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:21,
    },
    headerText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.low,
        color:color.darkGray
    },
    productBox:{
        height:font.headerHeight,
        borderWidth:0,
        borderColor:color.gray,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        paddingHorizontal:20,
        borderRadius:5,
        margin:5,
    },
    name:{
        fontSize:font.size.font14,
        fontWeight:font.weight.semi,
        color:color.borderColor
    },
    nameView:{
        width:width/2,
        justifyContent:'center'
    },
    selectAllView:{
        alignItems:'center',
        justifyContent:'center',
    },
    selectAllText:{
        fontSize:font.size.font12,
        color:color.darkGray
    },
    assignedView:{
        alignItems:'center',
        justifyContent:'center',

    },
    assignText:{
        fontSize:font.size.font8,
        color:color.darkGray,
    },
    footer:{
        height:font.headerHeight*1.2
    }
})

export default style