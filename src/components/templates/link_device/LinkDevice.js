import React from "react";
import {View,Text,StyleSheet,TouchableOpacity, ActivityIndicator} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Heder from "../../molecules/custom_heder/Heder";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Button from "../../atom/Button";
import {toast} from "../../../global_functions/toast_message/Toast"

class LinkDevice extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            flashMode:RNCamera.Constants.FlashMode.off,
            splash:false,
            loadData:false,
            authenticate:false,
        }
    }

    componentDidMount(){
       setTimeout(()=>{this.setState({loadData:true})},50)
    }

    connectSocket(qr_id){
      this.setState({authenticate:true})
      let data = {
            rtoken:global.rtoken,
            utoken:global.utoken,
            active_token:global.active_token,
            qr_id:qr_id
      }
      global.socket.connect()

      const phxChannel = socket.channel('windows_app:' + qr_id)
        phxChannel.join().receive('ok',response => {
            phxChannel.push("widows_auth",{data:data})
        })

        phxChannel.on("login_complete",data=>{
            let id = data.data.qr_id
            if(id == qr_id){
                this.setState({authenticate:false})
                toast("Login Completed")
                this.props.navigation.goBack()
            }
        })
    }

    onSuccess = e => {
       this.connectSocket(e.data)
    };

    onPress = ()=>{
       if(this.state.splash == false){
           this.setState({splash:true,flashMode:RNCamera.Constants.FlashMode.torch})
       }else{
           this.setState({splash:false,flashMode:RNCamera.Constants.FlashMode.off})
       }
    }

    render(){
        const {flashMode,splash,loadData,authenticate} = this.state
        return(
            <>
            {
                loadData && (
                <View style={style.container}>
                    <Heder headerName={"Scan QR Code"}/>
                    {
                        authenticate ?
                        <View style={style.authView}>
                            <ActivityIndicator size={font.size.font16} color={color.secondary}/>
                            <Text style={style.authText}>Authenticate</Text>
                        </View>
                        :
                        <QRCodeScanner
                            onRead={this.onSuccess}
                            flashMode={flashMode}
                            showMarker={true}

                            topContent={
                                <Text style={style.centerText}>Scan QR Code On Your Computer</Text>
                            }

                            bottomContent={
                            <Button buttonStyle={style.buttonStyle}
                                    text={splash ?"ON":"OFF"}
                                    iconShow={true}
                                    iconName={splash? "flash":"flash-off"}
                                    iconColor={color.white}
                                    iconSize={font.size.font16}
                                    textStyle={style.textStyle}
                                    onPress={()=>this.onPress()}
                                    />
                            }
                        />
                    }
                   
                </View>
                )
            }
            </>
        )
    }
}
  
export default LinkDevice;