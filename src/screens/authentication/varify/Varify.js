import React from "react";
import {View,Text, ActivityIndicator, TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import auth from '@react-native-firebase/auth';
import style from "./Style";
import Textinput from "../../../components/atom/TextInput";
import Button from "../../../components/atom/Button";
import Heder from "../../../components/molecules/custom_heder/Heder"
import moment from "moment";
import {shatoken} from "../../../global_functions/shaToken/shaToken"

class Varify extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            confirmResult:null,
            otp:null,
            timer:60,
            resend:false,
            loader:false
        }
    }
    
    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})},100)
        this.signInWithPhoneNumber()
        auth().onAuthStateChanged((user) => {
            if(user !== null){
                let number = '+91'+this.props.route.params.number
                if(user.phoneNumber == number){
                    this.login()
                }
            }  
        });
    }

    signInWithPhoneNumber () {
        let phoneNumber = parseInt(this.props.route.params.number)
         auth()
        .signInWithPhoneNumber('+91'+phoneNumber)
        .then(confirmResult => {
          this.setState({confirmResult:confirmResult})   

          const intervel = setInterval(() => {
            this.setState({timer:this.state.timer-1})
            if(this.state.timer == 0){
                clearInterval(intervel)
                this.setState({timer:60,resend:true})
            }
        }, 1000); 
         })
        .catch(error => {
          alert(error.message)
          console.log(error)
        })
       
      }

      load_data=(data,type)=>{
        if(type == "phone"){
            this.setState({otp:data})
        }
    }

    verify(){
        this.setState({loader:true})
        var confirmation = this.state.confirmResult
        if (this.state.otp.length == 6) {
          confirmation
            .confirm(this.state.otp)
            .then(user => {
              uid = user.user.uid
              if(uid){
                this.login()
              }
            })
            .catch(error => {
              alert(error.message)
              console.log(error)
            })
        } else {
          alert('Please enter a 6 digit OTP code.')
        }
      }

      async login(){
        let data = this.props.route.params.number+moment().format('MMMM Do YYYY, h:mm:ss a')
        let active_token = await shatoken(data)
            fetch(global.url+'api/authentication',{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number:this.props.route.params.number,
                    active_token:active_token
                })
            }).then(res => res.json())
                .then(async(res) => {
                    if(res.Status == true){
                        this.create_user_schema(res,active_token)
                    }else{
                        toast("Mobile Number Not Match")
                    }
                })
        }

        async create_user_schema(res,active_token){
            global.name = res.name
            global.access = res.access
            global.utoken = res.utoken
            global.rtoken =  res.rtoken
            global.active_token = active_token
            // this.setState({loader:false})
            this.goInitializePage(res.access,res.name)
        }

        goInitializePage =(access,name)=>{
            this.setState({loader:false})
            if(access == "ALL" || access == "MENU" || access == "ORDER"){
                this.props.navigation.navigate("AllInitialize",{name:name})
            }else if(access == "DELIVERY"){
                this.props.navigation.navigate("DeliveryInitialize",{name:name})
            }else if(access == "KITCHEN"){
                this.props.navigation.navigate("KichenInitialize",{name:name})
            }
        }


    render(){
        const {loadData,confirmResult,resend,timer,otp,loader} = this.state

        return(
            <View style={style.container}>
                <Heder headerName={"Varify"}/>
                {
                    loadData &&(
                        <>
                        {
                            confirmResult == null?
                            <View style={style.loaderView}>
                                <ActivityIndicator size={font.size.font16} color={color.secondary}/>
                                <Text style={style.authtext}>Authenticating</Text>
                            </View>
                            :
                            <View style={style.container}>
                                <View style={style.heading}> 
                                    <Text style={style.headingText}>We send a verification code to {this.props.route.params.number}</Text>
                                </View>
                                <View style={style.otpView}>
                                    <Textinput 
                                        inputViewStyle = {style.inputViewStyle}
                                        inputStyle = {style.inputStyle}
                                        placeHolder = {"Enter OTP"}
                                        iconShow = {false}
                                        keyboardType = {"number-pad"}
                                        secureTextEntry = {false}
                                        maxLength = {6}
                                        load_data = {this.load_data}
                                        type = {"phone"}/>
                                </View>
                                <View style={style.timerView}>
                                    {
                                        resend == false?
                                            <Text style={style.headingText}>{timer} sec</Text>
                                            :
                                            <TouchableOpacity onPress={()=>this.signInWithPhoneNumber()}>
                                                <Text style={style.resend} under>Resend code</Text>
                                            </TouchableOpacity>

                                    }
                                </View>
                                <View style={style.verifyView}>
                                   {
                                       otp !== null?
                                       <>                                 
                                       <Button 
                                            buttonStyle = {style.varifyButton}
                                            onPress = {()=>this.verify()}
                                            disabled = {false}
                                            textStyle = {style.textStyle}
                                            text = {"VERIFY"}/>
                                        {
                                           loader ?
                                           <View style={style.loader}>
                                               <ActivityIndicator size={font.size.font14} color={color.secondary}/>
                                           </View>
                                           :null
                                        }    
                                       </>                                     
                                       :null
                                   }
                                </View>
                               
                            </View>
                        }
                        </>
                    )
                }
            </View>
        )
    }
}

export default Varify