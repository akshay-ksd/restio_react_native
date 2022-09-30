import React from "react";
import {View,Text, ActivityIndicator,Switch} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Textinput from "../../atom/TextInput";
import Button from "../../atom/Button";
import MenuCategory from "../../organisms/menu_category/MenuCategory"

const ProductAddView =(props)=>{
    const [is_veg,setIs_veg] = React.useState(props.from == "edit"?props.selectProduct.isVeg:1)
    const [isLoad,setIsLoad] = React.useState(false)
    const [name,setName] = React.useState(props.from == "edit"?props.selectProduct.productName:"")
    const [about,setAbout] = React.useState(props.from == "edit"?props.selectProduct.about:"")
    const [price,setPrice] = React.useState(props.from == "edit"?JSON.stringify(props.selectProduct.price):0)
    const [stock,setStock] = React.useState(0)
    const [isEnabled, setIsEnabled] = React.useState(props.from == "edit"?props.selectProduct.isHide == 1?false:true:true);
    const [selectedCategory,setselectedCategory] = React.useState(props.from == "edit"?props.selectProduct.categoryId:0)
    const changeCategory =()=>{
        props.changeCategory()
    }
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const loadData =(text,type)=>{
        props.loadUserData(text,type)
        if(type == "name"){
            setName(text)
        }else if(type == "description"){
            setAbout(text)
        }else if(type == "price"){
            setPrice(text)
        }else if(type == "stock"){
            setStock(text)
        }
    }

    const isveg =(data)=>{
        setIs_veg(data)
        props.loadUserData(data,"is_veg")
    }

    const update =()=>{
        setIsLoad(true)
        props.update(props.selectProduct.id,isEnabled,selectedCategory)
    }

    const chengeCategory =(category_id)=>{
        setselectedCategory(category_id)
    }

    return(
        <View style={style.container}>
            {
                props.from !== "edit" ?
                <View style={style.selectedCategory}>
                    <Text style={style.categoryText}>{props.categoryData.categoryName}</Text>
                    <Button
                        buttonStyle = {style.changeButton}
                        onPress = {()=>changeCategory()}
                        disabled = {false}
                        textStyle = {style.buttonText}
                        text = {"Change"}
                        iconShow = {false}
                    />
                </View>
                :null
            }
            {
                props.from == "edit" ?
                    <MenuCategory edit = {true}
                                  selectedCategory = {chengeCategory}
                                  categoryId = {props.selectProduct.categoryId}
                                  from = {"edit"}/>
                :null
            }
          
            <View style={style.detailsInputcontainer}>
                <Text style={style.headingText}>Product Name</Text>
                <Textinput 
                    inputViewStyle = {style.inputView}
                    inputStyle = {style.inputStyle}
                    placeHolder = {props.from == "edit"?props.selectProduct.productName:"Product Name"}
                    iconShow = {false}
                    keyboardType = {"default"}
                    secureTextEntry = {false}
                    maxLength = {100}
                    load_data = {loadData}
                    type = {"name"}
                    value = {name}
                />
            </View>

            <View style={[style.detailsInputcontainer,{height:font.headerHeight*2.5}]}>
                <Text style={style.headingText}>Product Description (Optional)</Text>
                <Textinput 
                    inputViewStyle = {style.inputViewDescription}
                    inputStyle = {style.inputStyle}
                    placeHolder = {props.from == "edit"?props.selectProduct.about:"Product Description"}
                    iconShow = {false}
                    keyboardType = {"default"}
                    secureTextEntry = {false}
                    maxLength = {200}
                    load_data = {loadData}
                    type = {"description"}
                    multiline = {true}
                    value = {about}
                />
            </View>

            <View style={style.priceView}>
                <View>
                    <Text style={style.headingText}>Price</Text>
                    <Textinput 
                        inputViewStyle = {style.inputViewPrice}
                        inputStyle = {style.inputStyle}
                        placeHolder = {props.from == "edit"?JSON.stringify(props.selectProduct.price):"price"}
                        iconShow = {false}
                        keyboardType = {"number-pad"}
                        secureTextEntry = {false}
                        maxLength = {100}
                        load_data = {loadData}
                        type = {"price"}
                        value = {price.toString()}
                    />
                </View>

                <View style={style.stockView}>
                    {/* <Text style={style.headingText}>Daily Stock (Optional)</Text>
                    <Textinput 
                        inputViewStyle = {style.inputViewPrice}
                        inputStyle = {style.inputStyle}
                        placeHolder = {"Stock"}
                        iconShow = {false}
                        keyboardType = {"number-pad"}
                        secureTextEntry = {false}
                        maxLength = {100}
                        load_data = {loadData}
                        type = {"stock"}
                        value = {stock.toString()}
                    /> */}
                     <Switch
                        trackColor={{ false: "#767577", true: color.tertiary }}
                        thumbColor={isEnabled ? color.tertiary : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        />
                    <Text style={style.headingText1}>{isEnabled == true ? "Available" : "Out of Stock"}</Text>
                </View>
            </View>

            <View style={style.priceView}>
                <Button 
                    buttonStyle = {style.isveg}
                    onPress = {()=>isveg(1)}
                    disabled = {false}
                    textStyle = {style.isvegText}
                    text = {"Veg"}
                    iconShow = {true}
                    iconName = {is_veg == 1 ? "radio-button-on" : "radio-button-off"}
                    iconSize = {font.size.font14}
                    iconColor = {color.green}
                    style = {style.iconStyle}
                />

                <Button 
                    buttonStyle = {style.isveg}
                    onPress = {()=>isveg(0)}
                    disabled = {false}
                    textStyle = {style.isvegText}
                    text = {"Non Veg"}
                    iconShow = {true}
                    iconName = {is_veg == 0 ? "radio-button-on" : "radio-button-off"}
                    iconSize = {font.size.font14}
                    iconColor = {color.primary}
                    style = {style.iconStyle}
                />
            </View>
            {
                props.from == "edit" ?
                <>
                {
                    isLoad && (
                        <View style={style.loader}>
                            <ActivityIndicator size={font.size.font16} color={color.white}/>
                        </View>
                    )                 
                }
                    <Button 
                        buttonStyle = {style.updateButton}
                        onPress = {()=>update()}
                        disabled = {false}
                        textStyle = {style.updateButtonText}
                        text = {"UPDATE"}
                        iconShow = {false}
                    />
                </>               
                :null
            }
            
        </View>
    )
}

export default ProductAddView