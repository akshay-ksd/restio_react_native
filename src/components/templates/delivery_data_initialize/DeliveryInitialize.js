import React, { useState } from "react";
import {View,Text, ActivityIndicator} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style"
import {socket_connect} from "../../../global_functions/socket/Socket"
import Realm from "realm";
import { connect } from 'react-redux'


class DeliveryInitialize extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            channel:null
        }
    }
   componentDidMount(){
        this.connectSocket()
   }

   connectSocket =async()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken
        }
        const socket = await socket_connect()
        const phxChannel = socket.channel('deliveryData:' + global.utoken,{data:data})

        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
            this.checkDeliveryDataBase()
        })

        phxChannel.on('getData',data => {
            if(data.data.data !== false){
                this.storeDeliveryData(data.data.data)
            }else{
                this.storeUserDetailsAndLogIn()
            }
        })
    }

    downloadData =(section)=>{
        let data = {
            rtoken: global.rtoken,
            utoken: global.utoken,
            section: section,
            access: global.access
        }
        this.state.channel.push("getData", {data: data})
    }

    storeDeliveryData =async(data)=>{
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
                status:"string",
                gst:"string",
                charge:"string"
            }
        };

        const realm = await Realm.open({
            path: "delivery",
            schema: [schema]
        })

            let gst = data.order_details.gst == null ? "":data.order_details.gst.toString()
            let charge = data.order_details.charge == null ? "":data.order_details.charge.toString()
            let task1;
            realm.write(()=>{
                task1 = realm.create("delivery", {
                    delivery_id:data.order_details.delivery_id,
                    order_id:data.order_details.order_id,
                    staff_id:data.order_details.staff_id,
                    restaurent_id:data.order_details.restaurent_id,
                    order_time:data.order_details.order_time,
                    delivery_time:"data.delivery_time",
                    name:data.order_details.name,
                    address:data.order_details.address,
                    number:data.order_details.number,
                    status:data.order_details.status,
                    gst:gst,
                    charge:charge
                })
                this.storeProductData(data.productDetails,data.order_details.delivery_id)
            })
    }

    async storeProductData(data,delivery_id){
        let schema = {
            name:"d_product",
            properties:{
               product_id:"string",
               is_veg:"int",
               name:"string",
               discription:"string",
               price:"int",
               quantity:"int",
               total:"int",
               delivery_id:"string"
            }
        };

        const realm = await Realm.open({
            path: "d_product",
            schema: [schema]
        })

            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 =  realm.create("d_product", {
                                product_id:data[i].product_id,
                                is_veg:data[i].is_veg,
                                name:data[i].name,
                                discription:data[i].description,
                                price:data[i].price,
                                quantity:data[i].quantity,
                                total:data[i].total,
                                delivery_id:delivery_id
                            })
                })
            }       
    }

    checkDeliveryDataBase =async()=>{
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
                status:"string",
                gst:"string",
                charge:"string"
            }
        };

        const realm = await Realm.open({
            path: "delivery",
            schema: [schema]
        })

        let deliveryData = realm.objects("delivery")

        if(deliveryData.length !== 0){
            realm.write(()=>{
                realm.delete(deliveryData)
            })
            this.checkProductDatabase()
        }else{
            this.checkProductDatabase()
        }
    }

    checkProductDatabase =async()=>{
        let schema = {
            name:"d_product",
            properties:{
               product_id:"string",
               is_veg:"int",
               name:"string",
               discription:"string",
               price:"int",
               quantity:"int",
               total:"int",
               delivery_id:"string"
            }
        };

        const realm = await Realm.open({
            path: "d_product",
            schema: [schema]
        })

        let product_data = realm.objects("d_product")

        if(product_data.length !== 0){
            realm.write(()=>{
                realm.delete(product_data)
            })
            this.downloadData("Delivery")
        }else{
            this.downloadData("Delivery")
        }
    }

    storeUserDetailsAndLogIn=async()=>{
        let schema = {
            name: "user",
            properties: {
            name: "string",
            utoken: "string",
            rtoken: "string",
            access: "string",
            is_loged: "int",
            active_token:"string"
            },
        };

        const realm = await Realm.open({
            path: "myrealm",
            schema: [schema],
        });

        let task1;
        realm.write(() => {
            task1 = realm.create("user", {
                name: global.name,
                utoken: global.utoken,
                rtoken: global.rtoken,
                access: global.access,
                is_loged: 1,
                active_token: global.active_token
            });
            this.props.login()
        });
    }

    componentWillUnmount(){
        this.state.channel.leave().receive('ok',response => {
        })
    }


    render(){
        return(
            <View style={style.container}>
                <View style={style.textView}>
                    <Text style={style.text}>Hai {this.props.route.params.name}      🖐</Text>
                    <Text style={style.text}>Downloading Data ... <ActivityIndicator size={font.size.font16} color={color.white}/></Text>
                    <Text style={style.subText}>Do not go back or close the app.Please Wait ..</Text>
                </View>
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
  
  export default connect(mapStateToProps,mapDispatchToProps)(DeliveryInitialize)
