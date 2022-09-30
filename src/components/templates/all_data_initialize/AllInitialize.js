import React, { useState } from "react";
import {View,Text, ActivityIndicator} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style"
import {socket_connect} from "../../../global_functions/socket/Socket"
import Realm from "realm";
import { connect } from 'react-redux';
import {orderMasterSchema} from "../../../global_functions/realm_database/Realm"


class Initialize extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            channel:null,
            master_data:[]
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
        const phxChannel = socket.channel('all:' + global.utoken,{data:data})

        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
            this.downloadData("Staff")
        })

        phxChannel.on('getData',data => {
           if(data.data.section == "Staff"){
               if(data.data.data !== false){
                    this.storeStaffData(data.data.data)
               }else{
                this.downloadData("Menu")
               }
           }else if(data.data.section == "Menu"){
                if(data.data.data !== false){
                    this.storeMenuData(data.data.data)
                }else{
                    this.downloadData("Product")
                }
           }else if(data.data.section == "Product"){
                if(data.data.data !== false){
                    this.storeProductData(data.data.data)
                }else{
                    this.downloadData("OrderMaster")
                }
           }else if(data.data.section == "OrderMaster"){
                if(data.data.data !== false){
                    this.storeOrderMasterData(data.data.data,data.data.order_details_data)
                }else{
                    this.storemasterDatareal()
                }
           }else if(data.data.section == "Order"){
                if(data.data.data !== false){
                   this.storeOrderData(data.data.data)
                }else{
                    this.downloadData("Delivery")
                }
           }else if(data.data.section == "Delivery"){
                if(data.data.data !== false){
                    this.storeDeliveryData(data.data.data)
                }else{
                    this.downloadData("Kitchen")
                }
           }else if(data.data.section == "Kitchen"){
                if(data.data.data !== false){
                    this.storeKitchenData(data.data.data)
                }else{
                    this.downloadData("KitchenDetails")
                }
           }else if(data.data.section == "KitchenDetails"){
                if(data.data.data !== false){
                    this.storeKitchenDetailsData(data.data.data)
                }else{
                    this.downloadData("Expence")
                }
           }else if(data.data.section == "Expence"){
                if(data.data.data !== false){
                    this.storeExpenceData(data.data.data)
                }else{
                    this.downloadData("Attendence")
                }
           }else if(data.data.section == "Attendence"){
               if(data.data.data !== false){
                    this.storeAttendenceData(data.data.data)
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

    storeStaffData =async(data)=>{
        let schema = {
            name:"staff",
            properties:{
                name:"string",
                access:"string",
                number:"string",
                password:"string",
                restaurent_token:"string",
                token:"string",
                is_active:"int",
            }
        };

        const realm = await Realm.open({
            path: "staff",
            schema: [schema]
        })
        let staffData = realm.objects("staff");
        
        if(staffData.length == 0){
            for(let i = 0; i < data.length; i ++){
                let task1;
                let is_active = data[i].is_active == true?1:0
                realm.write(()=>{
                    task1 = realm.create("staff",{
                        name:data[i].name,
                        access:data[i].access,
                        number:data[i].number,
                        password:data[i].password == null ? "0000":data[i].password,
                        restaurent_token:data[i].restaurent_token,
                        token:data[i].token,
                        is_active:is_active
                    })
                })

                if(i == data.length-1){
                    this.downloadData("Menu")
                }
            }
        }else{
            realm.write(() => {
                realm.delete(staffData)
            })
            for(let i = 0; i < data.length; i ++){
                let task1;
                let is_active = data[i].is_active == true?1:0
                realm.write(()=>{
                    task1 = realm.create("staff",{
                        name:data[i].name,
                        access:data[i].access,
                        number:data[i].number,
                        password:data[i].password,
                        restaurent_token:data[i].restaurent_token,
                        token:data[i].token,
                        is_active:is_active  
                    })
                })
                if(i == data.length-1){
                    this.downloadData("Menu")
                }
            }
        }
    }

    storeMenuData =async(data)=>{
        let schema = {
            name:"category",
            properties:{
                category_id:"string",
                categoryName:"string",
                is_upload:"int"
            }
        };

        const realm = await Realm.open({
            path: "category",
            schema: [schema]
        })

        let categorydata = realm.objects("category")

        if(categorydata.length == 0){
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(()=>{
                    task1 = realm.create("category",{
                        category_id:data[i].category_id,
                        categoryName:data[i].categoryName,
                        is_upload:1, 
                    })
                })
                if(i == data.length-1){
                    this.downloadData("Product")
                }
            }
        }else{
            realm.write(() => {
                realm.delete(categorydata)
            })
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(()=>{
                    task1 = realm.create("category",{
                        category_id:data[i].category_id,
                        categoryName:data[i].categoryName,
                        is_upload:1, 
                    })
                })
                if(i == data.length-1){
                    this.downloadData("Product")
                }
            }
        }
    }

    storeProductData =async(data)=>{
        let schema = {
            name:"product",
            properties:{
                category_id:"string",
                product_id:"string",
                name:"string",
                description:"string",
                price:"int",
                stock:"int",
                is_veg:"int",
                quantity:"int",
                isHide:"int"
            }
        };

        const realm = await Realm.open({
            path: "product",
            schema: [schema]
        })

        let product_data = realm.objects("product")

        if(product_data.length == 0){
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(()=>{
                    task1 = realm.create("product",{
                        category_id:data[i].category_id,
                        product_id:data[i].product_id,
                        name:data[i].name,
                        description:data[i].description,
                        price:parseInt(data[i].price),
                        stock:parseInt(data[i].stock),
                        is_veg:parseInt(data[i].is_veg),
                        quantity:0,
                        isHide:data[i].isHide == false ? 1 : 0
                    })
                })
                if(i == data.length-1){
                    this.downloadData("OrderMaster")
                }
            }
        }else{
            realm.write(() => {
                realm.delete(product_data)
            })
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(()=>{
                    task1 = realm.create("product",{
                        category_id:data[i].category_id,
                        product_id:data[i].product_id,
                        name:data[i].name,
                        description:data[i].description,
                        price:parseInt(data[i].price),
                        stock:parseInt(data[i].stock),
                        is_veg:parseInt(data[i].is_veg),
                        quantity:0,
                        isHide:data[i].isHide == false ? 1 : 0
                    })
                })
                if(i == data.length-1){
                    this.downloadData("OrderMaster")
                }
            }
        }
    }

    storeOrderMasterData =async(data,order_details_data)=>{
        // var month = new Date().getMonth() + 1; //To get the Current Month
        // var year = new Date().getFullYear(); 
        // this.state.master_data.push({
        //     order_id:data.order_id,
        //     time:data.time,
        //     date:data.order_date,
        //     month:month,
        //     year:year,
        //     status:data.status,
        //     user_id:data.user_id,
        //     is_upload:1,
        //     gst:data.gst == null?0:data.gst,
        //     sgst:data.sgst,
        //     charge:data.charge,
        //     tableNumber:data.tableNumber == null ? 0 : data.tableNumber,
        //     orderDetails:order_details_data,
        // })
        this.downloadData("Delivery")
    }

    async storemasterDatareal(){
        if(this.state.master_data.length !== 0){
           
            const realm = await orderMasterSchema()

            let order_master_data = realm.objects("order_master");
            if(order_master_data.length == 0){
                for(let i = 0;i<this.state.master_data.length;i++){
                    let order = []
                    for(let j = 0; j < this.state.master_data[i].orderDetails.length; j ++){
                        order.push({
                            isVeg:this.state.master_data[i].orderDetails[j].isVeg == null ? 0:this.state.master_data[i].orderDetails[j].isVeg,
                            name:this.state.master_data[i].orderDetails[j].name == null ? "0":this.state.master_data[i].orderDetails[j].name,
                            order_detail_id:this.state.master_data[i].orderDetails[j].order_detail_id,
                            order_id:this.state.master_data[i].orderDetails[j].order_id,
                            price:this.state.master_data[i].orderDetails[j].price,
                            product_id:this.state.master_data[i].orderDetails[j].product_id,
                            quantity:this.state.master_data[i].orderDetails[j].quantity,
                            restaurent_id:this.state.master_data[i].orderDetails[j].restaurent_id,
                            total:this.state.master_data[i].orderDetails[j].total,
                        })
                       if(j == this.state.master_data[i].orderDetails.length-1){
                        let task1;
                        realm.write(() => {
                            task1 = realm.create("order_master", {
                                        order_id:this.state.master_data[i].order_id,
                                        time:this.state.master_data[i].time,
                                        date:this.state.master_data[i].date == null ? new Date():this.state.master_data[i].date,
                                        status:this.state.master_data[i].status,
                                        user_id:this.state.master_data[i].user_id,
                                        is_upload:1,
                                        gst:this.state.master_data[i].gst,
                                        sgst:this.state.master_data[i].sgst == null ? 0 : this.state.master_data[i].sgst,
                                        charge:this.state.master_data[i].charge,
                                        tableNumber:this.state.master_data[i].tableNumber == null ? 0 : this.state.master_data[i].tableNumber,
                                        orderDetails:order
                                    })
                        })
                       }
                    }
                    if(i == this.state.master_data.length-1){
                        this.downloadData("Delivery")
                    }
                }
            }
            else{
                realm.write(() => {
                    realm.delete(order_master_data)
                })
                for(let i = 0;i<this.state.master_data.length;i++){
                    let order = []
                    for(let j = 0; j < this.state.master_data[i].orderDetails.length; j ++){
                        order.push({
                            isVeg:this.state.master_data[i].orderDetails[j].isVeg == null ? 0:this.state.master_data[i].orderDetails[j].isVeg,
                            name:this.state.master_data[i].orderDetails[j].name == null ? "0":this.state.master_data[i].orderDetails[j].name,
                            order_detail_id:this.state.master_data[i].orderDetails[j].order_detail_id,
                            order_id:this.state.master_data[i].orderDetails[j].order_id,
                            price:this.state.master_data[i].orderDetails[j].price,
                            product_id:this.state.master_data[i].orderDetails[j].product_id,
                            quantity:this.state.master_data[i].orderDetails[j].quantity,
                            restaurent_id:this.state.master_data[i].orderDetails[j].restaurent_id,
                            total:this.state.master_data[i].orderDetails[j].total,
                        })
                       if(j == this.state.master_data[i].orderDetails.length-1){
                        let task1;
                        realm.write(() => {
                            task1 = realm.create("order_master", {
                                        order_id:this.state.master_data[i].order_id,
                                        time:this.state.master_data[i].time,
                                        date:this.state.master_data[i].date == null ? new Date():this.state.master_data[i].date,
                                        status:this.state.master_data[i].status,
                                        user_id:this.state.master_data[i].user_id,
                                        is_upload:1,
                                        gst:this.state.master_data[i].gst,
                                        sgst:this.state.master_data[i].sgst == null ? 0 : this.state.master_data[i].sgst,
                                        charge:this.state.master_data[i].charge,
                                        tableNumber:this.state.master_data[i].tableNumber == null ? 0 : this.state.master_data[i].tableNumber,
                                        orderDetails:order
                                    })
                        })
                       }
                    }
                    if(i == this.state.master_data.length-1){
                        this.downloadData("Delivery")
                    }
                }
            }
        }else{
            this.downloadData("Delivery")
        }
    }

    storeOrderData =async(data)=>{
        let schema = {
            name:"order",
            properties:{
                order_detail_id:"string",
                order_id:"string",
                product_id:"string",
                quantity:"int",
                price:"int",
                status:"int"
            }
        };

        const realm = await Realm.open({
            path: "order",
            schema: [schema]
        })

        let order_data = realm.objects("order")

        if(order_data.length == 0){
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 = realm.create("order", {
                                    order_detail_id:data[i].order_detail_id,
                                    order_id:data[i].order_id,
                                    product_id:data[i].product_id,
                                    quantity:data[i].quantity,
                                    price:data[i].price,
                                    status:0
                            })
                })

                if(i == data.length - 1){
                    this.downloadData("Delivery")
                }
            }
        }else{
            realm.write(()=>{
                realm.delete(order_data)
            })

            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 = realm.create("order", {
                                    order_detail_id:data[i].order_detail_id,
                                    order_id:data[i].order_id,
                                    product_id:data[i].product_id,
                                    quantity:data[i].quantity,
                                    price:data[i].price,
                                    status:0
                            })
                })

                if(i == data.length - 1){
                    this.downloadData("Delivery")
                }
            }
        }
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
                status:"string"
            }
        };

        const realm = await Realm.open({
            path: "delivery",
            schema: [schema]
        })

        let delivery_data = realm.objects("delivery")

        if(delivery_data.length == 0){
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 =  realm.create("delivery", {
                        delivery_id:data[i].delivery_id,
                        order_id:data[i].order_id == null ? "555555":data[i].order_id,
                        staff_id:data[i].staff_id,
                        restaurent_id:data[i].restaurent_id,
                        order_time:data[i].order_time,
                        delivery_time:data[i].delivery_time,
                        name:data[i].name,
                        address:data[i].address,
                        number:data[i].number,
                        status:data[i].status
                    })
                })

                if(i == data.length - 1){
                    this.downloadData("Kitchen")
                }
            }
        }else{
            realm.write(()=>{
                realm.delete(delivery_data)
            })
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 =  realm.create("delivery", {
                        delivery_id:data[i].delivery_id,
                        order_id:data[i].order_id,
                        staff_id:data[i].staff_id,
                        restaurent_id:data[i].restaurent_id,
                        order_time:data[i].order_time,
                        delivery_time:data[i].delivery_time,
                        name:data[i].name,
                        address:data[i].address,
                        number:data[i].number,
                        status:data[i].status
                    })
                })

                if(i == data.length - 1){
                    this.downloadData("Kitchen")
                }
            }
        }
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
              productId:"string",
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
                                productId:data[i].id,
                                quantity:data[i].quantity,
                                name:data[i].name,
                                kitchen_details:data[i].kitchen_details
                            })
                })
                if(i == data.length - 1){
                    this.downloadData("Expence")
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
                    this.downloadData("Expence")
                }
            }
        }
    }

    storeExpenceData =async(data)=>{
        let schema = {
            name:"expence",
            properties:{
               id:"string",
               amount:"int",
               category:"string",
               paymentType:"int",
               date:"string",
               month:"int",
               year:"int",
            }
        };

        const realm = await Realm.open({
            path: "expence",
            schema: [schema]
        })

        const expence_data = realm.objects("expence")

        if(expence_data.length == 0){
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 = realm.create("expence", {
                                   id:data[i].expenceId,
                                   amount:data[i].amount,
                                   category:data[i].category,
                                   paymentType:data[i].paymentType,
                                   date:data[i].date,
                                   month:data[i].month,
                                   year:data[i].year
                            })
                })
                if(i == data.length - 1){
                    this.downloadData("Attendence")
                }
            }
        }else{
            realm.write(()=>{
                realm.delete(expence_data)
            })
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 = realm.create("expence", {
                                   id:data[i].expenceId,
                                   amount:data[i].amount,
                                   category:data[i].category,
                                   paymentType:data[i].paymentType,
                                   date:data[i].date,
                                   month:data[i].month,
                                   year:data[i].year
                            })
                })

                if(i == data.length - 1){
                    this.downloadData("Attendence")
                }
            }
        }
    }

    storeAttendenceData =async(data)=>{
        let schema = {
            name:"attendence",
            properties:{
               id:"int",
               name:"string",
               staffId:"string",
               present:"int",
               date:"date"
            }
        };

        const realm = await Realm.open({
            path: "attendence",
            schema: [schema]
        })

        let atendence_data = realm.objects("attendence")

        if(atendence_data.length == 0){
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 = realm.create("attendence", {
                                id:data[i].id,
                                name:data[i].name,
                                staffId:data[i].staffId,
                                present:data[i].present == true?1:0,
                                date:data[i].date
                            })
                })
                if(i == data.length - 1){
                   this.storeUserDetailsAndLogIn()
                }
            }
        }else{
            realm.write(()=>{
                realm.delete(atendence_data)
            })
            for(let i = 0; i < data.length; i ++){
                let task1;
                realm.write(() => {
                    task1 = realm.create("attendence", {
                                id:data[i].id,
                                name:data[i].name,
                                staffId:data[i].staffId,
                                present:data[i].present == true?1:0,
                                date:data[i].date
                            })
                })
                if(i == data.length - 1){
                   this.storeUserDetailsAndLogIn()
                }
            }
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
  
  export default connect(mapStateToProps,mapDispatchToProps)(Initialize)
