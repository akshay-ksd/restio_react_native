import React from "react";
import {Text, View} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Textinput from "../../atom/TextInput"
import Button from "../../atom/Button"
import { useNavigation } from '@react-navigation/native';
import { toast } from "../../../global_functions/toast_message/Toast";

const CustomerInput =(props)=>{
    const navigation = useNavigation()
    const [name,setName] = React.useState(null)
    const [address,setAddress] = React.useState(null)
    const [number,setNumber] = React.useState(null)

    const goStaffList=()=>{
        let oredrData = {
            order_id:props.orderId,
            name:name,
            address:address,
            number:number,
            gst:props.gst,
            charge:props.charge
        }
        if(name !== null & address !== null & number !== null){
             navigation.navigate("StaffList",{oredrData:oredrData})
        }else{
            toast("Please Fill All Details")
        }
    }

    const loadData=(text,type)=>{
        if(type == "name"){
            setName(text)
        }else if(type == "address"){
            setAddress(text)
        }else if(type == "number"){
            setNumber(text)
        }
    }

    return(
        <View style={style.container}>   
            <View style={style.inputContainer}>
                <View>
                    <Text style={style.heading}>Name</Text>
                    <Textinput 
                        inputViewStyle = {style.inputView}
                        inputStyle = {style.inputStyle}
                        placeHolder = {""}
                        iconShow = {false}
                        keyboardType = {"default"}
                        secureTextEntry = {false}
                        maxLength = {100}
                        load_data = {loadData}
                        type = {"name"}
                        value = {name}
                    /> 
                </View>

                <View>
                    <Text style={style.heading}>Address</Text>
                    <Textinput 
                        inputViewStyle = {[style.inputView,{height:font.headerHeight*2,justifyContent:'flex-start'}]}
                        inputStyle = {style.inputStyle}
                        placeHolder = {""}
                        iconShow = {false}
                        keyboardType = {"default"}
                        secureTextEntry = {false}
                        maxLength = {100}
                        load_data = {loadData}
                        type = {"address"}
                        value = {address}
                        multiline = {true}
                    /> 
                </View>
               
               <View>
                    <Text style={style.heading}>Phone Number</Text>
                    <Textinput 
                        inputViewStyle = {style.inputView}
                        inputStyle = {style.inputStyle}
                        placeHolder = {""}
                        iconShow = {false}
                        keyboardType = {"number-pad"}
                        secureTextEntry = {false}
                        maxLength = {100}
                        load_data = {loadData}
                        type = {"number"}
                        value = {number}
                    />  
               </View>
                
            </View>
            <View style={style.buttonView}>
                <Button 
                    buttonStyle = {style.sellectStaffButton}
                    onPress = {()=>goStaffList()}
                    disabled = {false}
                    textStyle = {style.selctStaffText}
                    text = {"NEXT"}
                    iconShow = {false}
                />    
            </View>  
             
            
        </View>
    )
}

export default CustomerInput