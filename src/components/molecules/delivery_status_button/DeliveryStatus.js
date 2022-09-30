import React from "react";
import {View,Text, TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import Button from "../../atom/Button";
import style from "./Style";
import Realm from "realm";
import { useIsFocused,useFocusEffect,useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import NetInfo from "@react-native-community/netinfo";
import { toast } from "../../../global_functions/toast_message/Toast";

const DeliveryStatus =(props)=>{
    const navigation = useNavigation()

    const [isOrderAssign,setIsOrderAssighn] = React.useState(false)
    const [status,setStatus] = React.useState("")
    const [staffName,setStaffName] = React.useState(null)
    const [deliveryId,setDeliveryId] = React.useState(null)
    const [deliverySchema,setDeliverySchema] = React.useState(null)
    const [staffId,setStaffId] = React.useState(null)
    const [isConnected,setisConnected] = React.useState(false)

    useFocusEffect(
        React.useCallback(() => {
            checkNetInfo()
            // updateStatus()
        }, [])
    );

    const checkNetInfo =()=>{
        const unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                checkDelivey()
                setisConnected(true)
               
            }else{
                setisConnected(false)
            }
          });
    }
    const sendDelivery =()=>{
        props.sendDelivery()
    }

    const checkDelivey =async()=>{
        let schema = {
            name:"delivery",
            properties:{
                delivery_id:"string",
                order_id:"string",
                staff_id:"string",
                restaurent_id:"string",
                order_time:"string",
                delivery_time:"string",
                name:"string",
                address:"string",
                number:"string",
                status:"string"
            }
        };

        const realm = await Realm.open({
            path: "delivery",
            schema: [schema]
        })
        setDeliverySchema(realm)
        const deliveryData = realm.objects("delivery");
        let id = JSON.stringify(props.ordedr_id)
        let data = deliveryData.filtered(`order_id == ${id}`);

        if(data.length !== 0){
            getStaffDetails(data[0].staff_id)
            setStatus(data[0].status)
            setDeliveryId(data[0].delivery_id)
            setStaffId(data[0].staff_id)
        }else{
            setIsOrderAssighn(false)
        }
    }

    const getStaffDetails =async(staff_id)=>{
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

        const staffData = realm.objects("staff");
        let id = JSON.stringify(staff_id)
        let data = staffData.filtered(`token == ${id}`);
        if(data.length !== 0){
            setIsOrderAssighn(true)
            setStaffName(data[0].name)
        }
    }

    // const updateStatus=()=>{
    //     props.deliveryChannel.on('newOrder',order => {
    //         if(props.ordedr_id == order.order.order_id){
    //             setStatus(order.order.status)
    //             updateOrderDataBase(order.order.status)
    //         }
    //     })

        // props.deliveryChannel.on('updateStatus',delivery => {
        //     if(props.ordedr_id == delivery.delivery.order_id){
        //         setStatus(delivery.delivery.status)
        //         updateLocalDatabaseStatus(delivery.delivery.delivery_id,delivery.delivery.status)
        //     }
        // })
    // }

    const updateOrderDataBase =async(deliveryStatus)=>{
        const deliveryData = deliverySchema.objects("delivery");
        let id = JSON.stringify(props.ordedr_id)
        let data = deliveryData.filtered(`order_id == ${id}`);

        deliveryData.write(() => {
            data[0].status = deliveryStatus
        })
    }

    const goDeliveryDetails =()=>{
        if(isConnected){
            navigation.navigate("DeliveryDetails",{ordedr_id:props.ordedr_id,staffId:staffId,deliveryId:deliveryId})
        }else{
            toast("No Internet Connection")
        }
    }

    const updateLocalDatabaseStatus=async(delivery_id,status)=>{
        let schema = {
            name:"delivery",
            properties:{
                delivery_id:"string",
                order_id:"string",
                staff_id:"string",
                restaurent_id:"string",
                order_time:"string",
                delivery_time:"string",
                name:"string",
                address:"string",
                number:"string",
                status:"string"
            }
        };

        const realm = await Realm.open({
            path: "delivery",
            schema: [schema]
        })

        const deliveryData = realm.objects("delivery");
        let id = JSON.stringify(delivery_id)
        let data = deliveryData.filtered(`delivery_id == ${id}`);
        realm.write(() => {
            data[0].status = status
        })
    }

    return(
        <View style={style.conntainer}>
            {
                isOrderAssign == true?
                <TouchableOpacity style={style.deliveryButton1} 
                                  onPress={()=>goDeliveryDetails()}>
                    <View style={style.textView}>
                        <Text style={style.staffNameText}> {staffName}</Text>
                        {
                          status == "Pending"  ?
                          <Text style={style.statusText}> Status : <Text style={[style.statusText,{color:color.primary,fontWeight:font.weight.semi}]}>Pending</Text></Text>
                          :
                          status == "Accept" ?
                          <Text style={style.statusText}> Status : <Text style={[style.statusText,{color:color.secondary,fontWeight:font.weight.semi}]}>Picked</Text></Text>
                          :
                          <Text style={style.statusText}> Status : <Text style={[style.statusText,{color:color.green,fontWeight:font.weight.semi}]}>Deliverd</Text></Text>
                        }
                        {
                            status == "Accept" ?
                            <Animatable.Text animation="fadeOutLeft" iterationCount={"infinite"} direction={"alternate"} style={style.status}>                           🛵</Animatable.Text>
                            :null
                        }
                    </View>
                    {/* {
                        props.from == "details"?
                        null:
                        <Button 
                            buttonStyle = {style.closeButton}
                            onPress = {()=>goDeliveryDetails()}
                            disabled = {false}
                            textStyle = {style.closButtonText}
                            text = {"Details"}
                            iconShow = {true}
                            iconName = {"information-circle"}
                            iconSize = {font.size.font18}
                            iconColor = {color.white}
                            style = {props.iconStyle}
                        />
                    } */}
                  <Text style={[style.staffNameText,{marginRight:5}]}>👨</Text>
                </TouchableOpacity>
                :
                <Button 
                    buttonStyle = {style.deliveryButton}
                    onPress = {()=>sendDelivery()}
                    disabled = {false}
                    textStyle = {style.deliveryText}
                    text = {"Delivery 👨"}
                    gradient = {true}
                    color1 = {color.white}
                    color3 = {color.white}
                    color2 = {color.white}
                />
            }
           
        </View>
    )
}

export default DeliveryStatus