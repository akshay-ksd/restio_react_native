import React from "react";
import {View,Text, TouchableOpacity,Switch} from "react-native";
import style from "./Style";
import Icons from "../../atom/Icon";
import font from "../../../theme/font";
import color from "../../../theme/colors";
import AddButton from "../add_button/AddButton";

const ProductDisplay = (props) =>{
    const [isEnabled,setisEnabled] = React.useState(props.isHide == 1?false:true)
    const loadCount=(count)=>{
        props.loadProductCount(count,props.product_id,props.price,props.productName,props.isVeg,props.category_id)
    }

    const onPrees=()=>{
        props.onPress()
    }

    const editProduct=()=>{
        let orderData = {
            id:props.id,
            productName:props.productName,
            about:props.about,
            isVeg:props.isVeg,
            price:props.price,
            isHide:props.isHide,
            categoryId:props.categoryId
        }
        props.editProduct(orderData)
    }

    const deleteProduct=()=>{
        props.deleteProduct(props.id)
    }

    const toggleSwitch=()=>{
        setisEnabled(previousState => !previousState)
        props.updateStock(props.productName,props.about,props.isVeg,props.price,!isEnabled,props.categoryId,props.id)
    }
    return(
        <View style={[style.container,{backgroundColor: isEnabled == false?color.gray:color.backgroundColor}]}
                          onPress={()=>editProduct()}
                          disabled = {props.from == "edit"?false:true}
                          >
            <View style={style.productDetailsView}>
                <Text style={style.productName}>{props.productName}</Text>
                <Text style={style.productDetails}>{props.about}</Text>
                <View style={style.iconTextView}>
                    <Icons iconName = {"radio-button-on-outline"}
                        iconSize = {font.size.font12}
                        iconColor = {props.isVeg == 1 ? color.green : color.secondary}
                        iconStyle = {style.iconstyle}/>
                     <Text style={style.price}>{"₹ " + props.price}</Text>
                </View>
                {
                            isEnabled == false ?
                                <Text style={[style.productDetails,{color:isEnabled ? color.tertiary:color.secondary}]}>Out Of Stock</Text>
                            :
                                <Text style={[style.productDetails,{color:isEnabled ? color.tertiary:color.secondary}]}>Available</Text>
                }
            </View>
            {
                props.from == "edit"?
                   <TouchableOpacity style={style.editButton}
                                      onPress={()=>editProduct()}>
                        <Icons  iconName = {"create"}
                                iconSize = {font.size.font16}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconstyle}/>
                        <Text style={style.delete}>Edit</Text>
                    </TouchableOpacity>
                :null
             }

             {
                props.from == "edit"?
                    <View style={style.toggle}>
                        <TouchableOpacity style={style.editButton}
                                      onPress={()=>toggleSwitch()}>
                            <Icons  iconName = {isEnabled == true ? "radio-button-on-outline":"radio-button-off-outline"}
                                    iconSize = {font.size.font20}
                                    iconColor = {isEnabled == true ? color.tertiary:color.darkGray}
                                    iconStyle = {style.iconstyle}/>
                        </TouchableOpacity>
                    </View>
                :null
            }
            
           
            {
                props.edit == true?
                props.index == props.selectedIndex?
                <View style={style.editButtonView}>
                    {/* <TouchableOpacity style={style.editButton}
                                      onPress={()=>deleteProduct()}>
                        <Icons  iconName = {"trash-bin"}
                                iconSize = {font.size.font16}
                                iconColor = {color.primary}
                                iconStyle = {style.iconstyle}/>
                        <Text style={style.delete}>Delete</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={style.editButton}
                                      onPress={()=>editProduct()}>
                        <Icons  iconName = {"create"}
                                iconSize = {font.size.font16}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconstyle}/>
                        <Text style={style.delete}>Edit</Text>
                    </TouchableOpacity> */}
                </View>
                :null
                :
                 <AddButton count = {props.count}
                       value = {loadCount}/>
            }
             
           
        </View>
    )
}
// name={props.iconName} 
//                 size={props.iconSize} 
//                 color={props.iconColor}
//                 style = {props.iconStyle}
export default ProductDisplay