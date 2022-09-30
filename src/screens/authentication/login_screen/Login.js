import React from "react";
import {View,
        Text,
        ActivityIndicator,
        ToastAndroid,
        Platform,
        AlertIOS, } from "react-native";
import Style from "./Style"
import Textinput from "../../../components/atom/TextInput";
import Button from "../../../components/atom/Button";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import { connect } from 'react-redux'
import {toast} from "../../../global_functions/toast_message/Toast"
import Realm from "realm";
import style from "./Style";
import Image from "../../../components/atom/Image"

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
         phone_number: "",
         password: "",
         loader:false
        }
    }
    
    login(){
        if(this.state.phone_number.length !==0 & this.state.password.length !== 0){
            this.setState({loader:true})
            fetch(global.url+'api/authentication',{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number:this.state.phone_number,
                    password:this.state.password
                })
            }).then(res => res.json())
                .then(async(res) => {
                    if(res.Status == true){
                        this.create_user_schema(res)
                    }else if(res.Status == "No_mathch"){
                        this.setState({loader:false})
                        toast("Incorrect Password")
                    }else{
                        this.setState({loader:false})
                        toast("Mobile Number Not Match")
                    }
                })
        }
    }

    load_data=(data,type)=>{
        if(type == "phone"){
            this.setState({phone_number:data})
        }else{
            this.setState({password:data})
        }
    }

    async create_user_schema(res){
        global.name = res.name
        global.access = res.access
        global.utoken = res.utoken
        global.rtoken =  res.rtoken
        this.setState({loader:false})
        this.goInitializePage(res.access,res.name)
    }

    goInitializePage =(access,name)=>{
        if(access == "ALL"){
            this.props.navigation.navigate("AllInitialize",{name:name})
        }else if(access == "DELIVERY"){
            this.props.navigation.navigate("DeliveryInitialize",{name:name})
        }else if(access == "KITCHEN"){
            this.props.navigation.navigate("KichenInitialize",{name:name})
        }
    }

    varifyNumber =()=>{
        if(this.Number_validation() == true){
            this.props.navigation.navigate("Varify",{number:this.state.phone_number})
        }else{
            alert("Mobile number not valid")
        }
    }

    Number_validation = ()=>{
        var regexp = /^([0|+[0-9]{1,5})?([6-9][0-9]{9})$/
        return regexp.test(this.state.phone_number)
      }

    render(){
        const {loader} = this.state
        return(
          <View style = {Style.container}>
               <Button
                  buttonStyle = {Style.headingStyle}
                  onPress = {"lll"}
                  disabled = {true}
                  textStyle = {Style.headerTextStyle}
                  text = {"Login"}
              />
              <View style={Style.subHeading1}>
                 <Text style={Style.subText}>Phone Number</Text>
              </View>
              <View style={Style.subHeading}>
                    <Textinput 
                        inputViewStyle = {Style.inputViewStyle}
                        inputStyle = {Style.inputStyle}
                        placeHolder = {"Enter Phone Number"}
                        iconShow = {false}
                        keyboardType = {"number-pad"}
                        secureTextEntry = {false}
                        maxLength = {10}
                        load_data = {this.load_data}
                        type = {"phone"}/>
              </View>
              <View style={Style.loginButtonView}>
                    <Button 
                        buttonStyle = {Style.loginButton}
                        onPress = {()=>this.varifyNumber()}
                        disabled = {false}
                        textStyle = {Style.textStyle}
                        text = {"LOGIN"}/>
              </View>
              <View style={Style.orView}>
                  <Text style={style.orText}>OR</Text>
              </View>
              <View style={style.registerView}>
                    <Button 
                        buttonStyle = {Style.registerButton}
                        onPress = {()=>this.login()}
                        disabled = {false}
                        textStyle = {Style.rtextStyle}
                        text = {"REGISTER"}/>
              </View>
                
              {/*

            <View style = {Style.inputContainer}>
              <Textinput 
                  inputViewStyle = {Style.inputViewStyle}
                  inputStyle = {Style.inputStyle}
                  placeHolder = {"Enter Phone Number"}
                  iconShow = {true}
                  iconName = {"phone-portrait"}
                  iconColor = {color.primary}
                  iconSize = {font.size.font16}
                  iconStyle = {Style.iconStyle}
                  keyboardType = {"number-pad"}
                  secureTextEntry = {false}
                  maxLength = {10}
                  load_data = {this.load_data}
                  type = {"phone"}/>

              <Textinput 
                  inputViewStyle = {Style.inputViewStyle}
                  inputStyle = {Style.inputStyle}
                  placeHolder = {"Enter Password"}
                  iconShow = {true}
                  iconName = {"lock-closed"}
                  iconColor = {color.primary}
                  iconSize = {font.size.font16}
                  iconStyle = {Style.iconStyle}
                  secureTextEntry = {true}
                  maxLength = {10}
                  load_data = {this.load_data}
                  type = {"password"}/>
            </View>

            <View style={Style.loginButtonView}>
              <Button 
                  buttonStyle = {Style.loginButton}
                  onPress = {()=>this.login()}
                  disabled = {false}
                  textStyle = {Style.textStyle}
                  text = {"Login"}/>
            </View>
            {
               loader == true ?
                 <ActivityIndicator size={font.size.font30} color={color.primary}/>
               :null

            } */}
          </View>
        )
    }
}

function mapStateToProps(state) {
    return {
      login_status: state.login_status
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
        login: () => dispatch({ type: 'LOGIN' }),
        logout: () => dispatch({ type: 'LOGOUT' }),
    }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(Login)