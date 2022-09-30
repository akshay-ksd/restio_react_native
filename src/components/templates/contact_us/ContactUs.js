import React from "react";
import {View,Text,Linking,Platform} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Header from "../../molecules/custom_heder/Heder"
import Button from "../../atom/Button"; 
import Textinput from "../../atom/TextInput"
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../no_internet_view/NoInternet";
const ContactUs =(props)=>{
    const [loadData,setLoadData] = React.useState(false)
    const [text,setText] = React.useState("")
    const [isConnected,setisConnected] = React.useState(false)

    React.useEffect(()=>{
        checkNetInfo()
        setTimeout(()=>{setLoadData(true)},100)
    },[])

    const checkNetInfo =()=>{
        const unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                setisConnected(true)
            }else{
                setisConnected(false)
            }
          });
    }

    const loadText =(text,type)=>{
        setText(text)
    }

    const sendWhatsaap=()=>{
        let msg = text;
        let phoneWithCountryCode = '918157896995';
    
        let mobile = Platform.OS == 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
        if (mobile) {
          if (msg) {
            let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
            Linking.openURL(url).then((data) => {
            //   console.log('WhatsApp Opened');
            }).catch(() => {
              alert('Make sure WhatsApp installed on your device');
            });
          } else {
            alert('Please insert message to send');
          }
        } else {
          alert('Please insert mobile no');
        }
    }

    return(
        <View style={style.container}>
            {
                loadData == true ?
                <>
                {
                    isConnected?
                    <>
                        <Header headerName={"Contact Us"}/>

                        <View style={style.inPutView}>
                            <Textinput 
                                inputViewStyle = {style.inputViewStyle}
                                inputStyle = {style.inputStyle}
                                placeHolder = {props.route.params.type == "p"?"Describe Your Problem":"Describe Your Suggestion"}
                                iconShow = {false}
                                keyboardType = {"default"}
                                secureTextEntry = {false}
                                maxLength = {100}
                                load_data = {loadText}
                                type = {"default"}
                            />
                        </View>
                        <View style={style.whatsAppButtonView}>
                            <Text style={style.sendthroughtext}>Send Through WhatsApp</Text>
                            <Button 
                                buttonStyle = {style.whatsAppButton}
                                onPress = {()=>sendWhatsaap()}
                                disabled = {false}
                                textStyle = {style.whatsAppButtonText}
                                text = {"Send"}
                                iconShow = {true}
                                iconName = {"logo-whatsapp"}
                                iconSize = {font.size.font16}
                                iconColor = {color.white}
                                style = {style.iconStyle}
                            />
                        </View>
                    </>
                    :<NoInternet/>
                }
                    
                </>
                :null
            }
            
        </View>
    )
}

export default ContactUs