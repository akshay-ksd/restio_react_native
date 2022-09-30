import React, { useEffect, useState } from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Heder from "../../molecules/custom_heder/Heder";
import Textinput from "../../atom/TextInput";
import Button from "../../atom/Button";
import Realm from "realm";
import { useNavigation } from "@react-navigation/native";
import { toast } from "../../../global_functions/toast_message/Toast";
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../no_internet_view/NoInternet";

const Charges =(props)=>{
    const [loadData,setLoadData] = useState(false)
    const [gst,setGst] = useState(0)
    const [sgst,setsgst] = useState(0)
    const [charge,setCharge] = useState(0)
    const [channel,setchannel] = useState("")
    const [isConnected,setisConnected] = React.useState(false)

    const navigation = useNavigation()
    useEffect(()=>{
        setTimeout(()=>{setLoadData(true)},100)
        checkNetInfo()
    },[])

    const checkNetInfo =()=>{
        const unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                setisConnected(true)
                socketConnect()
                loadrestaurentData()
            }else{
                setisConnected(false)
            }
          });
    }

    const loadText =(text,type) =>{
        if(type == "charge"){
            setCharge(text)
        }else if(type == "gst"){
            setGst(text)
        }else if(type == "sgst"){
            setsgst(text)
        }
    }

  
    const socketConnect=async()=>{
        const phxChannel = global.socket.channel('restaurent:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            setchannel(phxChannel)
        })
        phxChannel.on("updateCharges",data=> {
            storeLocalDatabase(data.data)
        })
    }

    const update =()=>{
        if(isConnected){
            let data = {
                sgst:0,
                gst:parseInt(gst),
                charge:parseInt(charge),
                token:global.rtoken,
            }
        
            channel.push('updateCharges', { data: data})   
        }else{
            toast("No Internet Connection")
        }
       
    }

    const loadrestaurentData =async()=>{
        let schema = {
            name: "restaurent",
            properties: {
                gst:"int",
                charge:"int",
                sgst:"int"
            },
        };

        const realm = await Realm.open({
            path: "restaurent",
            schema: [schema],
        });

        const data = realm.objects("restaurent");
        if(data.length !== 0){
            setGst(data[0].gst)
            setCharge(data[0].charge)
        }
    }

    const storeLocalDatabase =async(data)=>{
        let schema = {
            name: "restaurent",
            properties: {
                gst:"int",
                charge:"int",
                sgst:"int"
            },
        };

        const realm = await Realm.open({
            path: "restaurent",
            schema: [schema],
        });

        const datas = realm.objects("restaurent");
        if(datas.length !== 0){
            realm.write(()=>{
                for(let i = 0; i < datas.length; i ++){
                    datas[i].gst = data.gst
                    datas[i].charge = data.charge
                    datas[i].sgst = 0
                }
            })
        }else{
            let task1;
            realm.write(() => {
                task1 = realm.create("restaurent", {
                             gst:data.gst,
                             charge:data.charge,
                             sgst:0
                        })
            })
        }

       navigation.pop(1)
        toast("Charges Updated")
    }

    return(
        <View style={style.container}>
            <Heder headerName={"Charges"}/>
            {
                loadData &&(
                    <>
                    {
                        isConnected?
                        <>
                        <View style={style.input}>
                            <View style={style.textView}>
                                <Text style={style.text}>Packing Charges :</Text>
                            </View>
                            <Textinput 
                                inputViewStyle = {style.inputViewStyle}
                                inputStyle = {style.inputStyle}
                                placeHolder = {""}
                                iconShow = {false}
                                keyboardType = {"number-pad"}
                                secureTextEntry = {false}
                                maxLength = {100}
                                load_data = {loadText}
                                type = {"charge"}
                                value = {charge.toString()}
                            />
                        </View>
                        <View style={style.input}>
                            <View style={style.textView}>
                                <Text style={style.text}>GST :</Text>
                            </View>
                            <View style={style.gstView}>
                                <Textinput 
                                    inputViewStyle = {style.inputViewStyle}
                                    inputStyle = {style.inputStyle}
                                    placeHolder = {""}
                                    iconShow = {false}
                                    keyboardType = {"number-pad"}
                                    secureTextEntry = {false}
                                    maxLength = {100}
                                    load_data = {loadText}
                                    type = {"gst"}
                                    value = {gst.toString()}
                                />
                                <Text style={style.percentage}>%</Text>
                            </View>
                           
                        </View>
                        {/* <View style={style.input}>
                            <View style={style.textView}>
                                <Text style={style.text}>SGST :</Text>
                            </View>
                            <View style={style.gstView}>
                                <Textinput 
                                    inputViewStyle = {style.inputViewStyle}
                                    inputStyle = {style.inputStyle}
                                    placeHolder = {""}
                                    iconShow = {false}
                                    keyboardType = {"number-pad"}
                                    secureTextEntry = {false}
                                    maxLength = {100}
                                    load_data = {loadText}
                                    type = {"sgst"}
                                    value = {sgst.toString()}
                                />
                                <Text style={style.percentage}>%</Text>
                            </View>
                           
                        </View> */}
                        <View style={style.buttonVie}>
                            <Button 
                                buttonStyle = {style.updateButton}
                                onPress = {()=>update()}
                                disabled = {false}
                                textStyle = {style.updateText}
                                text = {"UPDATE"}
                                iconShow = {false}
                            />
                        </View>
                        </>
                        :<NoInternet/>
                    }
                        
                    </>
                )
            }
           
        </View>
    )
}

export default Charges