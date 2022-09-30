import React from "react";
import {ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Header from "../../molecules/custom_heder/Heder"
import DeliveryProductList from "../../organisms/delivery_product_list/DeliveryProductList"
import Realm from "realm";
import StaffProfile from "../../molecules/staff_profile_display/StaffProfile"
import Button from "../../atom/Button"
import {shatoken} from "../../../global_functions/shaToken/shaToken"
import moment from "moment"
import { toast } from "../../../global_functions/toast_message/Toast";
import Icons from "../../atom/Icon";
import { useIsFocused,useFocusEffect,useNavigation } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";

const OrderConform =(props)=>{
    const navigation = useNavigation()
    const [loadData,setloadData] = React.useState(false)
    const [orderDetails,setorderDetails] = React.useState({})
    const [orderList,setorderList] = React.useState([])
    const [staffSchema,setstaffSchema] = React.useState({})
    const [staffProfile,setstaffProfile] = React.useState([])
    const [channel,setchannel] = React.useState("")
    const [staffName,setstaffName] = React.useState("")
    const [customerDetails,setcustomerDetails] = React.useState("")
    const [isConnected,setisConnected] = React.useState(false)

    React.useEffect(()=>{
        checkNetInfo()
    },[])

    const checkNetInfo =()=>{
        const unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                socketConnect()
                loadDatas()
                setisConnected(true)
               
            }else{
                setisConnected(false)
            }
          });
    }

    const loadDatas=()=>{
        let orderData = {
            order_id:props.oredrData.orderDetails.order_id,
            staffToken:props.oredrData.userToken,
            name:props.oredrData.orderDetails.name,
            address:props.oredrData.orderDetails.address,
            number:props.oredrData.orderDetails.number,
            gst:props.oredrData.orderDetails.gst,
            charge:props.oredrData.orderDetails.charge,
        }

        loadSchema(orderData.staffToken)
        setTimeout(()=>{setloadData(true),setorderDetails(orderData)},100)
    }

    const loadSchema =async(token)=>{
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
        const id = JSON.stringify(token)
        const staff = staffData.filtered(`token == ${id}`)
        setstaffName(staff[0].name)
    }


    const sendOrder =async()=>{
        if(isConnected){
            var date = new Date().getDate(); //To get the Current Date
            var month = new Date().getMonth() + 1; //To get the Current Month
            var year = new Date().getFullYear(); 
            let cDate = `${date}${month}${year}`
            let data = global.rtoken+orderDetails.order_id+orderDetails.staffToken
            let dtoken = await shatoken(data)
            let order = {
                delivery_id:dtoken,
                order_id:orderDetails.order_id,
                staff_id:orderDetails.staffToken,
                restaurent_token:global.rtoken,
                order_time:new Date().toISOString().slice(0, 10),
                delivery_time:"",
                name:"false",
                number:"false",
                address:customerDetails,
                gst:parseFloat(orderDetails.gst),
                charge:parseFloat(orderDetails.charge),
                status:"Pending",
            }
            channel.push('newOrder', { order: order})
        }else{
            toast("No Internet Connection")
        }
    }

    const socketConnect =()=>{
        let position = { latitude:12.504137,
            longitude:74.984195,
            uToken:global.utoken}
        const phxChannel = global.socket.channel('delivery:' + global.rtoken,{position:position})

        phxChannel.join().receive('ok',response => {
            setchannel(phxChannel)
        })

        phxChannel.on('newOrder',order => {
            storeLocalDatabase(order,phxChannel)
        })
    }

    const storeLocalDatabase =async(data,phxChannel)=>{      
        
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

        let task1;
        realm.write(() => {
            task1 =  realm.create("delivery", {
                        delivery_id:data.delivery_id,
                        order_id:data.order_id,
                        staff_id:data.staff_id,
                        restaurent_id:data.restaurent_id,
                        order_time:data.order_time,
                        delivery_time:data.delivery_time,
                        name:data.name,
                        address:data.address,
                        number:data.number,
                        status:"Pending"
                    })
                let mdata = {
                    uToken: global.utoken,
                    rToken: global.rtoken,
                    accessid: data.delivery_id,
                    task: "DELETE"
                }
                
                phxChannel.push('deleteQue', {data: mdata})
                if(task1.length !== 0){

                    toast("Order Successfully Sended")
                    navigation.pop(1)
                }
        })
    }

        return(
            <View style={style.container}>
                <View style={style.buttonView} 
                                  >
                    {/* <Text style={style.orderText}>Send To {staffName}</Text> */}
                    <TextInput placeholder="Enter customer details"
                               style={style.input}
                               multiline={true}
                               value={customerDetails}
                               onChangeText={(text)=>setcustomerDetails(text)}
                               autoFocus={true}
                               />
                               {
                                    customerDetails.length !== 0?
                                        <TouchableOpacity onPress={()=>sendOrder()}>
                                            <Icons iconName={"send"} 
                                                    iconSize={font.size.font25} 
                                                    iconColor={color.secondary}
                                                    iconStyle = {style.iconStyle}/> 
                                        </TouchableOpacity>  
                                    :null       
                               }
                              
                </View>
                
            </View>
        )
    }

export default OrderConform