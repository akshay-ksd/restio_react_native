import React, { useState } from "react";
import {View,Text, ActivityIndicator} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style"
import {socket_connect} from "../../../global_functions/socket/Socket"
import Realm from "realm";
import { connect } from 'react-redux'


class KichenInitialize extends React.Component{
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
        const phxChannel = socket.channel('kichenData:' + global.utoken,{data:data})

        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
            this.downloadData("Kitchen")
        })

        phxChannel.on('getData',data => {
            if(data.data.section == "Kitchen"){
                if(data.data.data !== false){
                    this.storeKitchenData(data.data.data)
                }else{
                    this.downloadData("KitchenDetails")
                }
           }else if(data.data.section == "KitchenDetails"){
                if(data.data.data !== false){
                    this.storeKitchenDetailsData(data.data.data)
                }else{
                    this.storeUserDetailsAndLogIn()
                }
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

    storeKitchenData =async(data)=>{
        let schema = {
            name:"kitchen",
            properties:{
               kitchenId:"string",
               orderId:"string",
               restaurentId:"string",
               stafId:"string",
               note:"string",
               date:"int",
               time:"string",
               status:"string"
            }
        };

        const realm = await Realm.open({
            path: "kitchen",
            schema: [schema]
        })

        let kitchen_data = realm.objects("kitchen")

        if(kitchen_data.length == 0){
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 =  realm.create("kitchen", {
                                kitchenId:data[i].kitchenId,
                                orderId:data[i].orderId,
                                restaurentId:data[i].restaurentId,
                                stafId:data[i].stafId,
                                note:data[i].note,
                                date:data[i].date,
                                time:data[i].time,
                                status:data[i].status
                            })
                })

                if(i == data.length - 1){
                    this.downloadData("KitchenDetails")
                }
            }
        }else{
            realm.write(()=>{
                realm.delete(kitchen_data)
            })

            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 =  realm.create("kitchen", {
                                kitchenId:data[i].kitchenId,
                                orderId:data[i].orderId,
                                restaurentId:data[i].restaurentId,
                                stafId:data[i].stafId,
                                note:data[i].note,
                                date:data[i].date,
                                time:data[i].time,
                                status:data[i].status
                    })
                })

                if(i == data.length - 1){
                    this.downloadData("KitchenDetails")
                }
            }
        }
    }

    storeKitchenDetailsData =async(data)=>{
        let schema = {
            name:"kitchenProduct",
            properties:{
              kitchenId:"string",
              id:"string",
              quantity:"int",
              name:"string",
              kitchen_details:"string"
            }
        };

        const realm = await Realm.open({
            path: "kitchenProduct",
            schema: [schema]
        })

        let kitchen_details_data = realm.objects("kitchenProduct")

        if(kitchen_details_data.length == 0){
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 =  realm.create("kitchenProduct", {
                                kitchenId:data[i].kitchenId,
                                id:data[i].id,
                                quantity:data[i].quantity,
                                name:data[i].name,
                                kitchen_details:data[i].kitchen_details
                            })
                })
                if(i == data.length - 1){
                    this.storeUserDetailsAndLogIn()
                }
            }
        }else{
            realm.write(()=>{
                realm.delete(kitchen_details_data)
            })
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 =  realm.create("kitchenProduct", {
                                kitchenId:data[i].kitchenId,
                                productId:data[i].id,
                                quantity:data[i].quantity,
                                name:data[i].name,
                                kitchen_details:data[i].kitchen_details
                            })
                })

                if(i == data.length - 1){
                    this.storeUserDetailsAndLogIn()
                }
            }
        }
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
  
  export default connect(mapStateToProps,mapDispatchToProps)(KichenInitialize)
