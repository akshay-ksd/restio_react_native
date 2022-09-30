import React from "react";
import {View,Text,Switch} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Textinput from "../../atom/TextInput";
import DepartmetList from "../../organisms/department_list/DepartmentList";

const StaffRegister =(props)=>{
    const [name,setName] = React.useState(props.updateData.name)
    const [number,setNumber] = React.useState(props.updateData.number)
    const [password,setPassword] = React.useState(props.updateData.password)
    const [access,setAccess] = React.useState(props.updateData.access)
    const [isEnabled, setIsEnabled] = React.useState(props.updateData.is_active == 1 ? true:false);
    const addStaffDetails=()=>{
        props.addStaffDetails(name,number,password,access,isEnabled)
    }

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const load_data=(text,type)=>{
        if(type == "name"){
            setName(text)
        }else if(type == "phone"){
            setNumber(text)
        }else if(type == "password"){
            setPassword(text)
        }
    }

    const selectDepartMent=(access)=>{
        setAccess(access)
    }

    const updateData=()=>{
        props.update(name,number,password,access,isEnabled)
    }

    return(
        <View style={style.container}>
            <View style={style.inputContainer}>
                <View style={style.headingView}>
                    <Text style={style.heading}>Staff Name</Text>
                </View>

                <Textinput 
                    inputViewStyle = {style.inputView}
                    inputStyle = {style.inputStyle}
                    placeHolder = {"Enter Staff Name"}
                    iconShow = {false}
                    keyboardType = {"default"}
                    secureTextEntry = {false}
                    maxLength = {100}
                    load_data = {load_data}
                    type = {"name"}
                    value = {name}
                />
            </View>
            {
                props.purpose == "ADD" ?
                    <View style={style.inputContainer}>
                        <View style={style.headingView}>
                            <Text style={style.heading}>Phone Number</Text>
                        </View>

                        <Textinput 
                            inputViewStyle = {style.inputView}
                            inputStyle = {style.inputStyle}
                            placeHolder = {"Enter Phone Number"}
                            iconShow = {false}
                            keyboardType = {"number-pad"}
                            secureTextEntry = {false}
                            maxLength = {100}
                            load_data = {load_data}
                            type = {"phone"}
                            value = {number}
                        />
                    </View>
                :null
            }
           

            {/* <View style={style.inputContainer}>
                <Text style={style.heading}>Password</Text>

                <Textinput 
                    inputViewStyle = {style.inputView}
                    inputStyle = {style.inputStyle}
                    placeHolder = {"Enter Password"}
                    iconShow = {false}
                    keyboardType = {"default"}
                    secureTextEntry = {true}
                    maxLength = {100}
                    load_data = {load_data}
                    type = {"password"}
                    value = {password}
                />
            </View> */}
            <View style={style.status}>
                <Text style={style.statusText}>Staff Status</Text>
                <Switch
                    trackColor={{ false: "#767577", true: color.tertiary }}
                    thumbColor={isEnabled ? color.tertiary : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
                <Text style={style.textStatus}>{isEnabled == true ? "Online" : "Offline"}</Text>
            </View>

            <View style={style.departMentsView}>
                <DepartmetList selectDepartMent = {selectDepartMent}
                               access = {access}
                               purpose = {props.purpose}
                               conform = {()=>addStaffDetails()}
                               updateData = {()=>updateData()}/>
            </View>
        </View>
    )
}

export default StaffRegister;