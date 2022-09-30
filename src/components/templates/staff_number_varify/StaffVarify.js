import React from "react";
import {View,Text, ActivityIndicator, TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import auth from '@react-native-firebase/auth';
import style from "./Style";
import Textinput from "../../atom/TextInput";
import Button from "../../atom/Button";
import Heder from "../../molecules/custom_heder/Heder"
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../no_internet_view/NoInternet";
import {toast} from "../../../global_functions/toast_message/Toast"

class StaffVarify extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            confirmResult:null,
            otp:null,
            timer:60,
            resend:false,
            loader:false,
            isConnected:false,
            channel:null,
            staffSchema:null
        }
    }
    
    componentDidMount(){
        this.checkNetInfo()
        setTimeout(()=>{this.setState({loadData:true})},100)
        this.signInWithPhoneNumber()
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                this.socketConnect()
                this.loadSchema()
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    async loadSchema(){
        let schema = {
            name:"staff",
            properties:{
                name:"string",
                access:"string",
                number:"string",
                password:"string",
                restaurent_token:"string",
                token:"string",
                is_active:"int"
            }
        };

        const realm = await Realm.open({
            path: "staff",
            schema: [schema]
        })

        this.setState({staffSchema:realm})
    }

    async socketConnect(){
        const phxChannel = global.socket.channel('staff:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
        })

        phxChannel.on('addStaff',staff => {
            let name = staff.staff.name
            let access = staff.staff.access
            let number = staff.staff.number
            let password = staff.staff.password
            let restaurent_token = staff.staff.restaurent_token
            let token = staff.staff.token
            let is_active = staff.staff.is_active
           this.storeLocalDatabse(name,access,number,password,restaurent_token,token,is_active)
        })

        // phxChannel.on('updateStaff',staff => {
        //    let staff_data = staff.staff
        //    this.updateLocalDatabase(staff_data)
        // })
    }

    storeLocalDatabse=async(name,access,number,password,restaurent_token,token,is_active)=>{
        let task1;
                this.state.staffSchema.write(() => {
                    task1 =  this.state.staffSchema.create("staff", {
                                name:name,
                                access:access,
                                number:number,
                                password:password,
                                restaurent_token:global.rtoken,
                                token:token,
                                is_active:is_active == true ? 1 : 0  
                            })
                    toast(`${name} Registerd`)
                    let mdata = {
                        uToken: global.utoken,
                        rToken: global.rtoken,
                        accessid: token,
                        task: "DELETE"
                    }
                    this.state.channel.push("deleteQue", {data: mdata})
                this.props.navigation.pop(2)
                })
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
              let uid = user.user.uid
              if(uid){
                this.storeInServerDatabase()
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

    storeInServerDatabase=()=>{
        const {name,number,password,access,utoken,isEnabled} = this.props.route.params
        if(name !== null & number !== null & access !== null){
        let staff = {
                    name:name,
                    number:number,
                    password:"password",
                    access:access,
                    restaurent_token:global.rtoken,
                    token:utoken,
                    is_active:isEnabled
                }
                this.state.channel.push('addStaff', { staff: staff})
        }else{
            toast("Please fill all staff details")
        }
      
    }


    render(){
        const {loadData,confirmResult,resend,timer,otp,loader,isConnected} = this.state

        return(
            <View style={style.container}>
                <Heder headerName={"Varify"}/>
                {
                    loadData &&(
                        <>
                         {
                        isConnected?
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
                        :
                            <NoInternet/>
                        }
                        </>
                    )
                }
            </View>
        )
    }
}

export default StaffVarify