import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Header from "../../molecules/custom_heder/Heder"
import ChefList from "../../organisms/chef_list/ChefList";
import ProductList from "../../organisms/product_list/ProductList";
import SendBox from "../../molecules/send_box/SendBox";
import Textinput from "../../atom/TextInput";
import { shatoken } from "../../../global_functions/shaToken/shaToken";
import moment from "moment";
import { toast } from "../../../global_functions/toast_message/Toast";
import {Presence} from 'phoenix'
import NoInternet from "../no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";


var Sound = require('react-native-sound');

class Kitchen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            selectedChefId:null,
            productId:[{id:1,quantity:0}],
            selctStaffName:"",
            showSendBox:false,
            note:"",
            channel:null,
            loader:false,
            loadProduct:false,
            presences:{},
            RoomData:[],
            kitchenId:null,
            loadCheff:false,
            isConnected:false
        }
    }

    componentDidMount(){
        this.checkNetInfo()
        setTimeout(()=>{this.setState({loadData:true,loadProduct:true})},100)
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                this.connectSocket()
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    selectedChef=(chefId,name)=>{
        this.setState({selectedChefId:chefId,selctStaffName:name,loadProduct:false})
        setTimeout(()=>{this.setState({loadProduct:true})},10)
    }

    selectProduct=async(pId,isSelected,quantity,name)=>{
        let index = this.state.productId.findIndex((x)=>x.id == pId)
        let data = global.rtoken+this.state.selectedChefId+pId+moment().format('MMMM Do YYYY, h:mm:ss a')
        let kitchen_details_id = await shatoken(data)
        if(isSelected == true){
            if(index == -1){
                this.state.productId.push({
                    id:pId,
                    quantity:quantity,
                    name:name,
                    kitchen_details:kitchen_details_id
                })
            }    
        }else{
            if(index !== -1){
                this.state.productId.splice(index, 1);
            }   
        }
        if(this.state.productId.length !== 1){
            this.setState({showSendBox:true})
        }else{
            this.setState({showSendBox:false})
        }
    }

    loadNote=(note)=>{
        this.setState({note:note})
    }

    sendToChef=async()=>{
      setTimeout(()=>{this.loadSchema()},50)
    }

    loadSchema =async()=>{
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

        const data = realm.objects("kitchen");
        const oId = JSON.stringify(this.props.route.params.ordedr_id)
        const staff = data.filtered(`orderId == ${oId}`)
        const id = JSON.stringify(this.state.selectedChefId)
        const staffData = staff.filtered(`stafId == ${id}`)
        if(staffData.length == 0){
            this.sendToServer()
        }else{
            this.updateProductToServer(staffData[0].kitchenId)
        }
    }

    sendToServer=async()=>{
        if(this.state.isConnected){
            this.setState({loader:true})
            let index = this.state.productId.findIndex((x)=>x.id == 1)
            this.state.productId.splice(index, 1);
    
            let data = global.rtoken+this.state.selectedChefId+moment().format('MMMM Do YYYY, h:mm:ss a')
            var date = new Date().getDate(); //To get the Current Date
            var month = new Date().getMonth() + 1; //To get the Current Month
            var year = new Date().getFullYear(); //To get the Current Year
            let dayTime = JSON.parse(`${date}${month}${year}`)
            let kitchenId = await shatoken(data)
    
            this.setState({kitchenId:kitchenId})
            let order = {
                kitchenId:kitchenId,
                time:new Date(),
                date:dayTime,
                staffId:this.state.selectedChefId,
                note:this.state.note.length == 0?"Table Number : " + this.props.route.params.table_no:"Table Number : " + this.props.route.params.table_no+"Note: "+this.state.note,
                status:"Pending",
                restaurentId:global.rtoken,
                productId:this.state.productId,
                order_id:this.props.route.params.ordedr_id
            }
            this.state.channel.push('order', { order: order})
        }else{
            this.setState({isConnected:false})
        }
       
    }

    updateProductToServer=async(kitchenId)=>{
        if(this.state.isConnected){
            this.setState({loader:true})
            let index = this.state.productId.findIndex((x)=>x.id == 1)
            this.state.productId.splice(index, 1);
            this.setState({kitchenId:kitchenId})

            var date = new Date().getDate(); //To get the Current Date
            var month = new Date().getMonth() + 1; //To get the Current Month
            var year = new Date().getFullYear(); //To get the Current Year
            let dayTime = JSON.parse(`${date}${month}${year}`)
            let order = {
                kitchenId:kitchenId,
                time:new Date(),
                date:dayTime,
                staffId:this.state.selectedChefId,
                note:this.state.note.length == 0?"Table Number : " + this.props.route.params.table_no:"Table Number : " + this.props.route.params.table_no+"Note: "+this.state.note,
                status:"Pending",
                restaurentId:global.rtoken,
                productId:this.state.productId,
                order_id:this.props.route.params.ordedr_id
            }

            this.state.channel.push('addProduct', { order: order})
        }else{
            this.setState({isConnected:false}) 
        }
    }

    connectSocket=()=>{
        const phxChannel = global.socket.channel('chef:' + global.rtoken,{userId:global.utoken})
        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
            this.checkAddQue()
        })

        phxChannel.on('order',order => {
            // console.log("checkdelete",order.kitchenId == this.state.kitchenId)
            // if(order.kitchenId == this.state.kitchenId){
                this.loadProduct(order)
            // }
        })

        phxChannel.on("presence_diff",response => {
            let syncedPresence = Presence.syncDiff(this.state.presences, response)
            this.setState({presences:syncedPresence,RoomData:[]})
            this.setState({RoomData:Presence.list(this.state.presences)
              .filter(presences => ! !presences.metas)
              .map(presences => presences.metas[0]),loadindicator:false})
              this.loadProduct(this.state.RoomData)
              this.updatecheffStatus(this.state.RoomData)
              this.setState({loadCheff:false})
              setTimeout(()=>{this.setState({loadCheff:true})},100)
        })
          
        phxChannel.on("presence_state",state => {
            let syncedPresence = Presence.syncState(this.state.presences, state)
            this.setState({presences:syncedPresence})
            this.setState({RoomData:Presence.list(this.state.presences)
              .filter(presences => ! !presences.metas)
              .map(presences => presences.metas[0]),loadindicator:false})
              this.loadProduct(this.state.RoomData)
              this.updatecheffStatus(this.state.RoomData)
              this.setState({loadCheff:false})
              setTimeout(()=>{this.setState({loadCheff:true})},100)
        })

        phxChannel.on("checkQueue",data => {
            if(data.data.staffId == global.utoken){
                if(data.data.task == "ADD"){
                    if(data.data.section == "Kitchen"){
                        if(data.data.kitchen !== false){
                            this.newOrderQueDataStoreLocally(data.data.kitchen,data.data.kitchen_details)
                        }else{
                            this.checkUpdateQue()
                            this.checkAddProductQue()
                        }
                    }
                    else{
                        if(data.data.kitchen_details !== false){
                            this.newOrderProductQueStoreLocally(data.data.kitchen_details,"ADD")
                        }else{
                            this.checkDeleteProductQue()
                        } 
                    }    
                }
                else if(data.data.task == "UPDATE"){
                    if(data.data.kitchen !== false){
                        this.updatequeOrderStatus(data.data.kitchen)
                    }
                }
                else if(data.data.task == "DELETE"){
                    if(data.data.kitchen_details !== false){
                        this.loadDeleteQueTask(data.data.kitchen_details)
                    }
                }  
            }
         })
    }

    componentWillUnmount(){
        this.unsubscribe()
        this.state.channel.leave().receive('ok',response => {
        })
    }

    loadProduct=(data)=>{
            if(data.type == "newOrder"){
                this.setState({showSendBox:false,productId:[{id:1,quantity:0}],loader:false,selectedChefId:null,selctStaffName:null})
                let kitchenData = data.order
                this.storeLocalDataBase(kitchenData)
                toast("Order Successfully Sended ")
            }
            else if(data.type == "addProduct"){
                this.setState({productId:[{id:1,quantity:0}],showSendBox:false})
                let kitchenData = data.order
                this.storeProduct(kitchenData,"ADD")
                toast("Product Successfully Sended")
                this.setState({loader:false,selectedChefId:null})
            }
            else if(data.type == "deleteProduct"){
                let kitchenId = data.kitchenId
                let productId = data.productId
                let kitchen_details = data.kitchen_details
                this.delteProduct(kitchenId,productId,kitchen_details)
            }
            else if(data.type == "updateStatus"){
                if(data.status == "itemReady"){
                    this.orderNotification()
                }
                this.updateOrderStatus(data.kitchenId,data.status)
            }
    } 

    async storeLocalDataBase(data){
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

        let task1;
        realm.write(() => {
            task1 =  realm.create("kitchen", {
                        kitchenId:data.kitchenId,
                        orderId:data.order_id,
                        restaurentId:data.restaurentId,
                        stafId:data.staffId,
                        note:data.note,
                        date:data.date,
                        time:data.time,
                        status:data.status
                    })
            this.storeProduct(data,"NEW")
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: data.kitchenId,
                task: "ADD"
            }

            this.state.channel.push("deleteQue", {data: mdata})
        })
    }

    async storeProduct(data,task){
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

        for(let i = 0; i < data.productId.length; i ++){
            let task1;
            realm.write(() => {
                task1 =  realm.create("kitchenProduct", {
                            kitchenId:data.kitchenId,
                            productId:data.productId[i].id,
                            quantity:data.productId[i].quantity,
                            name:data.productId[i].name,
                            kitchen_details:data.productId[i].kitchen_details
                        })
            })

            if(task == "ADD"){
                let mdata = {
                    uToken: global.utoken,
                    rToken: global.rtoken,
                    accessid: data.productId[i].kitchen_details,
                    task: "ADD"
                }
    
                this.state.channel.push("deleteQue", {data: mdata})
            }

            let schema1 = {
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
    
            const realm1 = await Realm.open({
                path: "order",
                schema: [schema1]
            })

            const deliveryData = realm1.objects("order");
            let productId = JSON.stringify(data.productId[i].id)
            let order_id = JSON.stringify(this.props.route.params.ordedr_id)
            let Ddata = deliveryData.filtered(`order_id == ${order_id}`);
            let deliData = Ddata.filtered(`product_id == ${productId}`);
            realm1.write(() => {
               deliData[0].status = 1
            })

            if(i == data.productId.length - 1){
                this.setState({loadData:false})
                setTimeout(()=>{this.setState({loadData:true})},10)
            }
        }
    }

    getKitchenDetailsId =async(product_id,staffData)=>{
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
        const data = realm.objects("kitchenProduct");
        let kId = JSON.stringify(staffData[0].kitchenId)
        let pId = JSON.stringify(product_id)
        const pData = data.filtered(`kitchenId == ${kId} && productId == ${pId}`)


        let order = {
            kitchenId:staffData[0].kitchenId,
            staffId:staffData[0].stafId,
            restaurentId:global.rtoken,
            productId:product_id,
            kitchen_details:pData[0].kitchen_details
        }
        this.state.channel.push('deleteProduct', { order: order})
    }

    cancelProduct =async(product_id)=>{
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

        const data = realm.objects("kitchen");

        const oId = JSON.stringify(this.props.route.params.ordedr_id)
        const staff = data.filtered(`orderId == ${oId}`)
        const id = JSON.stringify(this.state.selectedChefId)
        const staffData = staff.filtered(`stafId == ${id}`)
        
        this.getKitchenDetailsId(product_id,staffData)
    }

    delteProduct=async(kitchenId,productId,kitchen_details)=>{
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

        const data = realm.objects("kitchenProduct");

        let kId = JSON.stringify(kitchenId)
        let pId = JSON.stringify(productId)

        const pData = data.filtered(`kitchenId == ${kId} && productId == ${pId}`)

        realm.write(() => {
            realm.delete(pData);   
            this.updateProductStatus(productId)       
        });

        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: kitchen_details,
            task: "DELETE"
        }

        this.state.channel.push("deleteQue", {data: mdata})
    }

    updateProductStatus=async(productIds)=>{
        let schema1 = {
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

        const realm1 = await Realm.open({
            path: "order",
            schema: [schema1]
        })

        const deliveryData = realm1.objects("order");
        let productId = JSON.stringify(productIds)
        let order_id = JSON.stringify(this.props.route.params.ordedr_id)
        let Ddata = deliveryData.filtered(`order_id == ${order_id}`);
        let deliData = Ddata.filtered(`product_id == ${productId}`);
        realm1.write(() => {
           deliData[0].status = 0
           this.setState({loadData:false})
           setTimeout(()=>{this.setState({loadData:true})},10)
        })
    }

    updateOrderStatus =async(kitchenId,status)=>{
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

        const data = realm.objects("kitchen");
        let kId = JSON.stringify(kitchenId)
        let Ddata = data.filtered(`kitchenId == ${kId}`);
        realm.write(() => {
            Ddata[0].status = status
            this.setState({loadCheff:false,loadProduct:false})
            setTimeout(()=>{this.setState({loadCheff:true,loadProduct:true})},50)
        })
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: kitchenId,
            task: "UPDATE"
        }       
        this.state.channel.push("deleteQue", {data: mdata})
    }

    updatecheffStatus =async(data)=>{
      
        if(0 < data.length){
            let length = data.length-1
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
    
            const udata = realm.objects("staff");
            const id = JSON.stringify("KITCHEN")
            const staff = udata.filtered(`access == ${id}`)
            const uid = JSON.stringify(data[length].userId)
            let staffData = staff.filtered(`token == ${uid}`)
            if(staffData.length !== 0){
                toast(staffData[0].name+" Is Now Online")
            }
        }      
    }
    orderNotification =()=>{
        var whoosh = new Sound('when.mp3', Sound.MAIN_BUNDLE, (error) => {
           
            whoosh.play((success) => {
            });
        });
        whoosh.play();
    }

    checkAddQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Kitchen",
            task:"ADD"
        }
        this.state.channel.push("checkQueue", {data: data})
    }

    updatequeOrderStatus =async(kitchen)=>{
        if(kitchen.length !== 0){
            for(let i = 0; i < kitchen.length; i ++){
                this.updateOrderStatus(kitchen[i].kitchenId,kitchen[i].status)
            }
        }
    }

    newOrderQueDataStoreLocally =async(kitchen,kitchen_details)=>{
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
        for(let i = 0; i < kitchen.length; i ++){
            let task1;
            realm.write(() => {
                task1 =  realm.create("kitchen", {
                            kitchenId:kitchen[i].kitchenId,
                            orderId:kitchen[i].orderId,
                            restaurentId:kitchen[i].restaurentId,
                            stafId:kitchen[i].stafId,
                            note:kitchen[i].note,
                            date:kitchen[i].date,
                            time:kitchen[i].time,
                            status:kitchen[i].status
                        })
                this.newOrderProductQueStoreLocally(kitchen_details,"NEW")
                let mdata = {
                    uToken: global.utoken,
                    rToken: global.rtoken,
                    accessid: kitchen[i].kitchenId,
                    task: "ADD"
                }

                this.state.channel.push("deleteQue", {data: mdata})
            })
        }
        this.checkAddProductQue()
        this.checkUpdateQue()
    }

    newOrderProductQueStoreLocally=async(kitchen_details,task)=>{
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

        for(let i = 0; i < kitchen_details.length; i ++){
            let task1;
            realm.write(() => {
                task1 =  realm.create("kitchenProduct", {
                            kitchenId:kitchen_details[i].kitchenId,
                            productId:kitchen_details[i].id,
                            quantity:kitchen_details[i].quantity,
                            name:kitchen_details[i].name,
                            kitchen_details:kitchen_details[i].kitchen_details
                        })
            })

            let schema1 = {
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
    
            const realm1 = await Realm.open({
                path: "order",
                schema: [schema1]
            })

            const deliveryData = realm1.objects("order");
            let productId = JSON.stringify(kitchen_details[i].id)
            let order_id = JSON.stringify(this.props.route.params.ordedr_id)
            let Ddata = deliveryData.filtered(`order_id == ${order_id}`);
            let deliData = Ddata.filtered(`product_id == ${productId}`);
            for(let d = 0; d < deliData.length; d ++){
                realm1.write(() => {
                    deliData[d].status = 1
                 })     
            }
            if(task == "ADD"){
                let mdata = {
                    uToken: global.utoken,
                    rToken: global.rtoken,
                    accessid: kitchen_details[i].kitchen_details,
                    task: "ADD"
                }
    
                this.state.channel.push("deleteQue", {data: mdata})
            }
            if(i == kitchen_details.length - 1){
                this.setState({loadData:false})
                setTimeout(()=>{this.setState({loadData:true})},50)
                this.checkDeleteProductQue()
            }
            
        }
    }

    checkAddProductQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"kitchen_details",
            task:"ADD"
        }
        this.state.channel.push("checkQueue", {data: data})
    }

    checkDeleteProductQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"kitchen_details",
            task:"DELETE"
        }

        this.state.channel.push("checkQueue", {data: data})
    }

    checkUpdateQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Kitchen",
            task:"UPDATE"
        }
        this.state.channel.push("checkQueue", {data: data}) 
    }

    loadDeleteQueTask =async(kitchen_details)=>{
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

        const data = realm.objects("kitchenProduct");

        let kId = JSON.stringify(kitchen_details)

        const pData = data.filtered(`kitchen_details == ${kId}`)
        if(pData.length !== 0){
            let productId = pData[0].productId
                realm.write(() => {
                    realm.delete(pData);   
                    this.updateProductStatus(productId)       
                });
        }
       

        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: kitchen_details,
            task: "DELETE"
        }

        this.state.channel.push("deleteQue", {data: mdata})
    }


    render(){
        const {loadData,selectedChefId,selctStaffName,showSendBox,phxChannel,loader,loadProduct,loadCheff,isConnected} = this.state
        return(
            <View style={style.container}>
                {
                    phxChannel !== null?
                    loadData == true?
                    <>
                    {
                        isConnected ?
                        <>
                             <Header headerName={"Kitchen"}/>
                                {
                                    loadCheff && (
                                        <ChefList selectedChef = {this.selectedChef}
                                                order_id = {this.props.route.params.ordedr_id}
                                                onlinechef = {this.state.RoomData}/>
                                    )
                                }
                            
                                <Textinput 
                                    inputViewStyle = {style.inputView}
                                    inputStyle = {style.inputStyle}
                                    placeHolder = {"Note for Chef Eg : less spicy"}
                                    iconShow = {false}
                                    keyboardType = {"default"}
                                    secureTextEntry = {false}
                                    maxLength = {100}
                                    load_data = {this.loadNote}
                                    type = {"name"}
                                    value = {this.state.note}
                                />
                                {
                                    loadProduct && (
                                        <ProductList order_id = {this.props.route.params.ordedr_id}
                                                    selectedChefId = {selectedChefId}
                                                    selectProduct = {this.selectProduct}
                                                    cancelProduct = {this.cancelProduct}/>
                                    )
                                }
                            
                                {
                                    showSendBox && (
                                        <View style={style.SendBox}>
                                            <SendBox name={selctStaffName}
                                                    sendToChef={()=>this.sendToChef()}
                                                    loader={loader}/>
                                        </View>
                                    )
                                }               
                        </>
                        :<NoInternet/>
                    }
                              
                    </>
                    :null
                    :null
                }
            </View>
        )
    }
}

export default Kitchen