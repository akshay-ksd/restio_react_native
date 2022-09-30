import React from "react";
import {View} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import Button from "../../atom/Button";
import Textinput from "../../atom/TextInput";
import style from "./Style";
import Realm from "realm";
import { toast } from "../../../global_functions/toast_message/Toast";
import moment from "moment";
import { shatoken } from "../../../global_functions/shaToken/shaToken";

const CategoryAdd =(props)=>{
    const [loadData,setLoadData] = React.useState(false)
    const [category,setCategory] = React.useState("")
    const [valueChange,setValue] = React.useState(false)

    React.useEffect(()=>{
        loadDatas()
    },[])

    const loadDatas =()=>{
        setTimeout(()=>{setLoadData(true)},100)
    }
    
    const addCategory =async()=>{
       const data = global.rtoken+moment().format('MMMM Do YYYY, h:mm:ss a')
       let category_id = await shatoken(data)

       let categoryData = {
                restaurent_id:global.rtoken,
                category_id:category_id,
                categoryName:category
       }

       storeCategoryLocally(categoryData)
       props.channel.push('addCategory', { category: categoryData})
    }

    const load_data =(text)=>{
        setCategory(text)
    }

    const storeCategoryLocally =async(categoryData)=>{

        let task1;
        props.schema.write(() => {
            task1 = props.schema.create("category", {
                category_id:categoryData.category_id,
                categoryName:categoryData.categoryName,
                is_upload:0
            })
            props.categoryLoad(categoryData.category_id,categoryData.categoryName)
            toast("Menu Added")
        })
    }
    
    return(
        <View style={style.container}>
            {
                loadData == true ?
                <>
                    <Textinput 
                        inputViewStyle = {style.inputView}
                        inputStyle = {style.inputStyle}
                        placeHolder = {"Category Name"}
                        iconShow = {false}
                        keyboardType = {"default"}
                        secureTextEntry = {false}
                        maxLength = {100}
                        load_data = {load_data}
                        type = {"default"}
                        autoFocus = {true}
                    />
                    <Button 
                        buttonStyle = {style.buttonView}
                        onPress = {()=>addCategory()}
                        disabled = {false}
                        textStyle = {style.buttonText}
                        text = {"ADD"}
                        iconShow = {false}
                        iconName = {"trash"}
                        iconSize = {font.size.font25}
                        iconColor = {color.primary}
                        style = {style.iconStyle}
                    />
                </>
                :null
            }
           
        </View>
    )
}

export default CategoryAdd;