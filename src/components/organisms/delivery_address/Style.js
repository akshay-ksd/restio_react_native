import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        // width:width,
        backgroundColor:color.white,
        bottom:40,
        padding:10,
        margin:10,
        borderWidth:1,
        borderRadius:5,
        borderColor:color.darkGray,
        borderStyle:'dashed'
    },
    header:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:10
    },
    subHead:{
        marginLeft:10,
        marginTop:20,
        fontSize:font.size.font10
    },
    name:{
        fontSize:font.size.font14,
        fontWeight:font.weight.low,
        color:color.black,
        marginLeft:10,
        marginTop:5
    },
    headerView:{
        alignItems:'center',
        justifyContent:'center'
    },
    editButtonView:{
        alignItems:'flex-end',
        justifyContent:'center',
        backgroundColor:color.gray,
        marginTop:5,
        borderRadius:5
    },
    editButton:{
        height:font.headerHeight-20,
        width:font.headerHeight+10,
        borderRadius:5,
        backgroundColor:color.white,
        alignItems:'center',
        justifyContent:'center',
        margin:5,
        marginLeft:60,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:2,
    },
    editBttonText:{
        fontSize:font.size.font20,
        fontWeight:font.weight.bold,
        color:color.white
    },
    number:{
        fontSize:font.size.font16,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        marginLeft:10,
        marginTop:5
    },
    numberView:{
        height:font.headerHeight/2,
        width:width-20,
        alignItems:"center",
        flexDirection:'row'
    }
})

export default style