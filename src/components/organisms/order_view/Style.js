import { Dimensions, StyleSheet } from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";

const {width,height} = Dimensions.get('window');

const style = StyleSheet.create({
    container:{
        // height:height/3,
        width:width/2-10,
        margin:5,
        borderRadius:10,
        padding:10,
        backgroundColor:color.white,
        shadowColor: color.darkGray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:1,
        borderWidth:1
    },
    header:{
        height:font.headerHeight/4,
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row',
        backgroundColor:color.gray,
        borderRadius:10
    },
    headingText:{
        fontSize:font.size.font8,
        color:color.darkGray,
        fontWeight:font.weight.semi
    },
    productView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        marginTop:5,
    },
    productNameView:{
        width:((width/2-10)-(width/2-10)/3),
        justifyContent:'center',
    },
    productCountView:{
        width:(width/2-10)/3,
        justifyContent:'center',
    },
    productText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.borderColor,
        left:10
    },
    productListView:{
        height:(height/3)-font.headerHeight*1.5,
        width:(width/2)-30, 
        overflow:"hidden"
    },
    productListView1:{
        width:(width/2)-30, 
    },
    footer:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    tableNumber:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.secondary
    },
    orderPerson:{
        fontSize:font.size.font12,
        fontWeight:font.weight.semi,
        color:color.tertiary
    },
    seeMoreText:{
        fontSize:font.size.font12,
        fontWeight:font.weight.bold,
        color:color.darkGray,
        left:2
    },
    seeMore:{
        width:font.headerHeight*2,
        padding:2,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    }
})

export default style