import React from "react";
import {View,Text , ToastAndroid,PermissionsAndroid} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import Heder from "../../molecules/custom_heder/Heder";
import style from "./Style";
import Table from "../../organisms/table_select/Table";
import QRCode from 'react-native-qrcode-svg';
import Button from "../../atom/Button";
import RNFS from "react-native-fs";
import CameraRoll from "@react-native-community/cameraroll";


let logo = require('../../../../assets/whiteR.png');

const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
class Qrcode extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loadData:false,
            showQrcode:false,
            url:null,
            selectedTable:0,
            data:null
        }
    }

    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})},50)
    }

    generateQr=(id)=>{
        this.setState({showQrcode:false})
        setTimeout(()=>{
            this.setState({showQrcode:true,url:`https://restioco-af010.firebaseapp.com//?id=${global.rtoken}&tId=${id}`,selectedTable:id})
            this.requestCameraPermission()
        },10)
    }

    saveQrToDisk() {
        this.svg.toDataURL((data) => {
            RNFS.writeFile(RNFS.CachesDirectoryPath+`/Table_number${this.state.selectedTable}.png`, data, 'base64')
              .then((success) => {
                  return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath+`/Table_number${this.state.selectedTable}.png`, 'photo')
              })
              .then(() => {
                  ToastAndroid.show(`Table Number ${this.state.selectedTable} Qr-Code Saved to gallery !!`, ToastAndroid.SHORT)
              })
        })
   }
   
    requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Restio Need Storage Permission",
              message:
                "Restio App needs access to your Storage " ,
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.saveQrToDisk()
          } else {
            alert("Permission denied")
          }
        } catch (err) {
        //   console.warn(err);
        }
    };

    render(){
        const {loadData,showQrcode,selectedTable,url} = this.state
        return(
            <View style={style.container}>
                <Heder headerName="Generate QR-code"/>
                {
                    loadData && (
                        <>
                        <View style={style.qrView}>
                            {
                                showQrcode ?
                                    <>
                                    <View style={style.qr}>
                                        <QRCode
                                            getRef={(c) => (this.svg = c)}
                                            value={url}
                                            logo={logo}
                                            logoSize={30}
                                            size={350}
                                            backgroundColor={color.white}
                                            logoBackgroundColor={color.secondary}
                                            color={color.black}
                                            logoBorderRadius={15}
                                        />
                                    </View>
                                   
                                    <Text style={style.selectedId}>Table Number : {selectedTable}</Text>
                                    </>
                                    :
                                    <Text style={style.selectedId}>Select table number for generate Qr code</Text>
                            }
                            
                        </View>
                        
                            <Table  disabled = {false}
                                                    edit={false}
                                                    loadCount={this.generateQr}/>
                        </>
                    )
                }
            </View>
        )
    }
}

export default Qrcode