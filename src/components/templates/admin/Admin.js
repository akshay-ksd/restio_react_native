import React from "react";
import {View,Dimensions,Text, ActivityIndicator,DeviceEventEmitter, TouchableOpacity,} from "react-native";
import style from "./Style";
import Header from "../../molecules/order_header/Header"
import OrderFilter from "../../organisms/order_filter/OrderFilter";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import AdminProductList from "../../organisms/admin_product_list/AdminProductList"
import Realm from "realm";
import { toast } from "../../../global_functions/toast_message/Toast";
import font from "../../../theme/font";
import color from "../../../theme/colors";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import Share from 'react-native-share';
import ScreenFocus from "../../../global_functions/screen_focus/ScreenFocus";
import NoInternet from "../../templates/no_internet_view/NoInternet"
import NetInfo from "@react-native-community/netinfo";
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from '@brooons/react-native-bluetooth-escpos-printer';
import Icons from "../../atom/Icon";
import RBSheet from "react-native-raw-bottom-sheet";
import BillType from "../../molecules/bill_type/BillType";
import {orderMasterSchema} from "../../../global_functions/realm_database/Realm"
const {width,height} = Dimensions.get('window');


var Sound = require('react-native-sound');

moment().format('MMMM Do YYYY, h:mm:ss a')
const year = moment().format('YYYY')
const month = moment().format('MMMM')
const day = moment().format('Do')

function sortFunction(a,b){  
    var dateA = new Date(a.date).getTime();
    var dateB = new Date(b.date).getTime();
    return dateA > dateB ? 1 : -1;  
}; 

class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
              }),
            orderList:[],
            emptyOrder:true,
            filterType:0,
            loader:false,
            date:new Date(Date.now()),
            mode:"date",
            show:false,
            channel:"",
            deliveryChannel:"",
            loadStatus:false,
            extendState:{ordedr_id:null,load:false},
            loadData:false,
            isConnected:false,
            btDevices:[],
            print_data:[],
            isPrinterConnected:false,
            printerName:"",
            startingCount:0,
            endingCount:3,
            filterType:1,
            cdate:new Date(Date.now()),
            noOrders:true,
            kitchenName:[],
            loading:true
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = Dimensions.get('window').height; 
          })
    }

    async componentDidMount(){
        const devices = await this.checkAvailableDevice()
        this.setState({btDevices:devices})
        this.getDetailsPrint()
        this.checkIsPrinterConnected()
        this.checkConnection()
        this.getRestaurentDataLocally()
    }


    async checkAvailableDevice(){
        const devices = await BluetoothManager.enableBluetooth();

        return devices
        .reduce((acc, device) => {
            try {
            return [...acc, JSON.parse(device)];
            } catch (e) {
            return acc;
            }
        }, [])
        .filter((device) => device.address);
    }

    showListOrUnpaired(isPrinterConnected){
        if(isPrinterConnected){
            this.unpairPrinter()
        }else{
            this.RBSheet.open()
        }
    }

    checkIsPrinterConnected=async()=>{
        const c_device = await BluetoothManager.getConnectedDeviceAddress();
        if(c_device.length !== 0){
            const index = this.state.btDevices.findIndex((x)=>x.address == c_device)
            if(index !== -1){
            const name = this.state.btDevices[index].name
            this.setState({isPrinterConnected:true,printerName:name})
            }
        }else{
            this.setState({isPrinterConnected:false})
        }
    }

    connectPrinter=async(address)=>{
        await BluetoothManager.connect(address);
        const index = this.state.btDevices.findIndex((x)=>x.address == address)
        const name = this.state.btDevices[index].name
        this.setState({isPrinterConnected:true,printerName:name})
        this.RBSheet.close()
        toast(name+" Connected")
    }

    unpairPrinter=async()=>{
        const c_device = await BluetoothManager.getConnectedDeviceAddress();
        const d_divice =  await BluetoothManager.unpair(c_device)
        const index = this.state.btDevices.findIndex((x)=>x.address == d_divice)
        const name = this.state.btDevices[index].name
        toast(name+" Is Disconnected")
        this.setState({isPrinterConnected:false})
    }

    checkConnection =async()=>{
        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_CONNECTION_LOST, (response) => {
                if(this.state.isPrinterConnected == true){
                    this.unpairPrinter()
                }
            }
        );

        DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_UNABLE_CONNECT, (response) => {
            toast("Unable to connect")
        }
        );

        DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, (response) => {
                toast("Not Support")
            }
        );
        
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                this.socketConnect()
                // this.getOrderMaster(1)
                this.setState({startingCount:0,endingCount:3})
            }else{
                this.setState({isConnected:false})
            }
          });
    }

      
    loadData=()=>{
        for(let i = 0; i < data.length; i ++){
            this.state.orderList.push({
                type: 'NORMAL',
                item: {
                    ordedr_id:data[i].ordedr_id,
                    time:data[i].time,
                    status:data[i].status,
                    product:data[i].product
                }
            })
            if(i == data.length - 1){
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList)})
            }
        }
    }

    getOrderMaster=async(id,task,from)=>{
        const realm = await orderMasterSchema()

        if(this.state.filterType == 0){
            const master_datas = realm.objects("order_master").sorted("date",true)

            let master_data = master_datas.slice(this.state.startingCount, this.state.endingCount);
            let data = master_data.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.order_id === thing.order_id
            )))

            if(data.length == 0){
                if(from !== "pagination"){
                    this.setState({emptyOrder:true,loader:false})
                }else{
                    this.setState({noOrders:true})
                }
            }else{
                if(from !== "pagination"){
                    this.loadOrders(data,id,task)
                }else{
                    this.loadPaginationData(data,"home")
                }
            }
        }else if(this.state.filterType == 1){
            
            const sort = realm.objects("order_master")
            const master_datas = sort.filtered(`status == 0 || status == 5`);
            const datas = master_datas.sorted("date",true)
            let master_data = datas.slice(this.state.startingCount, this.state.endingCount);
            let data = master_data.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.order_id === thing.order_id
            )))

            if(data.length == 0){
                if(from !== "pagination"){
                    this.setState({emptyOrder:true,loader:false,loading:false})
                }else{
                    this.setState({noOrders:true,loading:false})
                }
            }else{
                if(from !== "pagination"){
                    this.loadOrders(data,id,task)
                }else{
                    this.loadPaginationData(data,"home")
                }
            }
        }
        else if(this.state.filterType == 2){
            const sort = realm.objects("order_master")
            const datas = sort.filtered(`status > 0 && status < 4`);
            const master_datas = datas.sorted("date",true)

            let master_data = master_datas.slice(this.state.startingCount, this.state.endingCount);
            
            let data = master_data.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.order_id === thing.order_id
            )))

            if(data.length == 0){
                if(from !== "pagination"){
                    this.setState({emptyOrder:true,loader:false})
                }else{
                    this.setState({noOrders:true})
                }
            }else{
                if(from !== "pagination"){
                    this.loadOrders(data,id,task)
                }else{
                    this.loadPaginationData(data,"home")
                }
            }
        }else if(this.state.filterType == 3){
            const datas = realm.objects("order_master").sorted("date",true)
            const master_datas = datas.filter(x=>x.date.getFullYear() == this.state.cdate.getFullYear() & x.date.getMonth() == this.state.cdate.getMonth() & x.date.getDate() == this.state.cdate.getDate())
            let master_data = master_datas.slice(this.state.startingCount, this.state.endingCount);

            let data = master_data.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.order_id === thing.order_id
            )))

            if(data.length == 0){
                if(from !== "pagination"){
                    this.setState({emptyOrder:true,loader:false})
                }else{
                    this.setState({noOrders:true})
                }
            }else{
                if(from !== "pagination"){
                    this.loadOrders(data,id,task)
                }else{
                    this.loadPaginationData(data,"home")
                }
            }
        }
        
    }

    getOrders=async(master_data)=>{
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
        const orders = realm.objects("order");
        let order = orders.slice(0, 5);
        let data = order.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.order_detail_id === thing.order_detail_id
        )))
        this.getProductDetails(data,master_data)
    }

    getProductDetails=async(master_data,from)=>{
        // let schema = {
        //     name:"product",
        //     properties:{
        //         category_id:"string",
        //         product_id:"string",
        //         name:"string",
        //         description:"string",
        //         price:"int",
        //         stock:"int",
        //         is_veg:"int",
        //         quantity:"int",
        //         isHide:"int"
        //     }
        // };

        // const realm = await Realm.open({
        //     path: "product",
        //     schema: [schema]
        // })

        // const product = realm.objects("product");
        // if(from == "queue"){
            this.loadQueData(master_data,order_data,product)
        // }else{
        //     this.loadOrders(master_data,product)
        // }
    }

    loadOrders=(master_data,id,task)=>{
        this.state.orderList.splice(0,this.state.orderList.length)
        for(let i = 0; i < master_data.length; i ++){
            let products = [];
            let Total = 0;
            for(let j = 0; j < master_data[i].orderDetails.length;j++){
                let subTotal = master_data[i].orderDetails[j].quantity*master_data[i].orderDetails[j].price
                    if(id !== master_data[i].orderDetails[j].order_detail_id){
                        products.push({
                            id:master_data[i].orderDetails[j].product_id,
                            productName:master_data[i].orderDetails[j].name,
                            description:"description",
                            is_veg:master_data[i].orderDetails[j].isVeg,
                            count:master_data[i].orderDetails[j].quantity,
                            price:master_data[i].orderDetails[j].price.toFixed(2),
                            total:subTotal.toFixed(2),
                        })
                    }else{
                        
                    }

                        Total += subTotal
                        if(j == master_data[i].orderDetails.length-1){
                            let sgst = master_data[i].gst/2
                            let cgst = master_data[i].gst/2
                            let gstPercentage = cgst + "%"
                            let sgstPercentage = sgst + "%"

                            let gstCharge = (Total * parseFloat(gstPercentage))/100
                            let sgstCharge = (Total * parseFloat(sgstPercentage))/100

                            let total = gstCharge+master_data[i].charge+Total+sgstCharge
                            this.state.orderList.push({
                                    type: 'NORMAL',
                                    item: {
                                        id:i+master_data[i].order_id[0]+master_data[i].order_id[1],
                                        ordedr_id:master_data[i].order_id,
                                        time:master_data[i].date,
                                        status:master_data[i].status,
                                        user_id:master_data[i].user_id,
                                        product:products,
                                        gTotal:total.toFixed(2),
                                        delivery:false,
                                        deliveryStaffName:"",
                                        deliveryId:"",
                                        charge:master_data[i].charge.toFixed(2),
                                        gst:gstCharge.toFixed(2),
                                        sgst:sgstCharge.toFixed(2),
                                        tableNumber:master_data[i].tableNumber
                                    }
                            })
                            if(i == master_data.length-1){    
                                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList),emptyOrder:false,
                                                startingCount:this.state.startingCount+3,endingCount:this.state.endingCount+3,loading:false})
                            }          
                        }         
            }
        }
    }

    loadPaginationData=(master_data)=>{
        for(let i = 0; i < master_data.length; i ++){
            let products = [];
            let Total = 0;
            for(let j = 0; j < master_data[i].orderDetails.length;j++){
                let subTotal = master_data[i].orderDetails[j].quantity*master_data[i].orderDetails[j].price

                    products.push({
                        id:master_data[i].orderDetails[j].product_id,
                        productName:master_data[i].orderDetails[j].name,
                        description:"description",
                        is_veg:master_data[i].orderDetails[j].isVeg,
                        count:master_data[i].orderDetails[j].quantity,
                        price:master_data[i].orderDetails[j].price.toFixed(2),
                        total:subTotal.toFixed(2),
                    })

                        Total += subTotal
                        if(j == master_data[i].orderDetails.length-1){
                            let sgst = master_data[i].gst/2
                            let cgst = master_data[i].gst/2
                            let gstPercentage = cgst + "%"
                            let sgstPercentage = sgst + "%"

                            let gstCharge = (Total * parseFloat(gstPercentage))/100
                            let sgstCharge = (Total * parseFloat(sgstPercentage))/100
                            let total = gstCharge+master_data[i].charge+Total+sgstCharge
                            this.state.orderList.push({
                                    type: 'NORMAL',
                                    item: {
                                        id:i+master_data[i].order_id[0]+master_data[i].order_id[1],
                                        ordedr_id:master_data[i].order_id,
                                        time:master_data[i].date,
                                        status:master_data[i].status,
                                        user_id:master_data[i].user_id,
                                        product:products,
                                        gTotal:total.toFixed(2),
                                        delivery:false,
                                        deliveryStaffName:"",
                                        deliveryId:"",
                                        charge:master_data[i].charge.toFixed(2),
                                        gst:gstCharge.toFixed(2),
                                        sgst:sgstCharge.toFixed(2),
                                        tableNumber:master_data[i].tableNumber
                                    }
                            })
                            if(i == master_data.length-1){
                                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList),emptyOrder:false,
                                                startingCount:this.state.startingCount+3,endingCount:this.state.endingCount+3})
                            }     
                        }  
            
            }
        } 
    }

    paymentConform=async(type,ordedr_id)=>{
        if(this.state.isConnected){
            let order_data ={
                type:"update",
                order_id:ordedr_id,
                status:type,
                restaurent_id:global.rtoken
            }
    
            this.state.channel.push('updateStatus', { order_data: order_data})      
        }else{
            this.setState({isConnected:false})
        }       
    }

    removeOrder=async(ordedr_id)=>{
        const index = this.state.orderList.findIndex(data => data.item.ordedr_id === ordedr_id);
        this.state.orderList.splice(index, 1);
        if(this.state.orderList.length == 0){
            this.setState({emptyOrder:true,noOrders:true})
        }
        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList)})      
        this.setState({orderList:this.state.orderList})
    }

    changeFilter=(filterType)=>{
        this.setState({startingCount:0,endingCount:3,emptyOrder:true,loader:true,filterType:filterType})
        setTimeout(()=>{this.getOrderMaster(filterType)},10)
    }

    showDatePicker=(data)=>{
        this.setState({show:true})
        
    }

    onChange=(onchange)=>{
        this.setState({show:false,emptyOrder:true,loader:true,filterType:3})
        if(onchange.type == "set"){
            var cdate = onchange.nativeEvent.timestamp
            this.setState({startingCount:0,endingCount:3,cdate:cdate})
            setTimeout(()=>{this.getOrderMaster(3,cdate,"home")},10)
        }
    }

    async socketConnect(){
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

        const product = realm.objects("product");

        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Order",
            task:"ADD"
        }

        const phxChannel = global.socket.channel('order:' + global.rtoken)

        this.connectDeliverySocket()
        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
            phxChannel.push("checkQueue", {data: data})
        })

        phxChannel.on('addOrder',order => {
            let order_ide = order.product.order_id
            let type = order.product.type
            let status = order.product.status
            if(type == "update"){
                if(this.state.filterType == 1){
                    setTimeout(()=>{this.removeOrder(order_ide)},100)
                }
                toast(status !== 4?"Order Closed":"Order Canceled")
                this.updateLocalDataBase(order_ide,status)
            }else{
                this.storeOrderDetailsLocalysocket(order.product)
            } 
        }) 

        phxChannel.on("updateOrder",product => {
            this.realTimeUpdateOrderDetails(product.product)
            this.NewNotification()
        })
        
        phxChannel.on("checkQueue",data => {
           if(data.staffId == global.utoken){
                    if(data.task == "ADD"){
                            if(data.order !== false){
                                this.storeOrderDetailsLocaly(data.order_details,data.order)
                            }else{
                                this.checkUpdateQue()
                            }
                    }else if(data.task == "UPDATE"){
                            if(data.order !== false){
                                for(let i = 0; i < data.order.length; i ++){
                                        // setTimeout(()=>{this.removeOrder(data.order[i].order_id),
                                        // toast(data.order[i].status !== 4?"Order Closed":"Order Canceled")},100)
                                        this.updateLocalDataBase(data.order[i].order_id,data.order[i].status)
                                }
                            }else{
                                this.checkProductAddQue()
                            }
                    }
                    else if(data.task == "PRODUCT_ADD"){
                            if(data.order !== false !== 0){
                                this.storeOrderDetails(data.order_details,data.order)
                                // this.loadAddProduct(data.order_details,data.order)
                            }else{
                                this.checkProductUpdateQue()
                            }
                    }
                    else if(data.task == "PRODUCT_UPDATE"){
                            if(data.order !== false){
                                this.updateOrderDetails(data.order_details,data.order)
                                // this.loadUpdateProduct(data.order_details,data.order)
                            }else{
                                this.checkProductDeleteQue()
                            }
                    }
                    else if(data.task == "PRODUCT_DELETE"){
                            if(data.order_details !== false){
                                this.deleteOrderDetails(data.order_details)    
                            }
                    }
                    if(data.task == "PRODUCT_DELETE"){
                        this.getOrderMaster(1)
                    }
           }           
        })
    }

    componentWillUnmount(){
        this.state.channel.leave()
    }

    connectDeliverySocket(){
        let position = {latitude:"12.3333",
                        longitude:"17.3333",
                        uToken:global.utoken}
        const phxChannel = global.socket.channel('delivery:' + global.rtoken,{position:position})

        phxChannel.join().receive('ok',response => {
            this.setState({deliveryChannel:phxChannel})
        })

        phxChannel.on('newOrder',order => {
            this.storeLocalDatabase(order)
        })

        phxChannel.on('updateStatus',delivery => {
            this.updateLocalDatabaseStatus(delivery.delivery.delivery_id,delivery.delivery.status,delivery.delivery.order_id)
        })

        phxChannel.on("deleteDelivery",responce =>{
            let data = {order_id:responce.delivery.order_id,
                        restaurent_id:responce.delivery.restaurent_id,
                        deliveryId:responce.delivery.deliveryId}
             this.deleteLocalDatabseData(data)
         })

        phxChannel.on("checkQueue",data => {
            if(data.order_details.staffId == global.utoken){
                if(data.order_details.task == "ADD"){
                    if(data.order_details.delivery !== false){
                        this.storeDeliveryLocalDatabase(data.order_details.delivery)
                    }else{
                        this.checkDeliveryUpdateQue()
                    }
                }else if(data.order_details.task == "UPDATE"){
                    if(data.order_details.delivery !== false){
                        let status = data.order_details.delivery[0].status
                        let delivery_id = data.order_details.delivery[0].delivery_id
                        let order_id = data.order_details.delivery[0].order_id
                        this.updateLocalDatabaseStatus(delivery_id,status,order_id)
                    }else{
                        this.checkDeliveryDeleteQue()
                    }
                }else if(data.order_details.task == "DELETE"){
                    if(data.order_details.delivery !== false){
                        this.deleteDeliveryDataLocallyQue(data.order_details.delivery)
                    }
                }
            }
        })
    }

    updateLocalDatabaseStatus=async(delivery_id,status,order_id)=>{
        this.orderNotification()
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
        if(data.length !== 0){
            realm.write(() => {
                data[0].status = status
                this.setState({extendState:{ordedr_id:order_id,load:true}})
                this.setState({extendState:{ordedr_id:null,load:false}})
            })
        }
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: delivery_id,
            task: "UPDATE"
        }
        this.state.deliveryChannel.push("deleteQue", {data: mdata})
        this.checkDeliveryDeleteQue()
    }

    orderNotification =()=>{
        var whoosh = new Sound('when.mp3', Sound.MAIN_BUNDLE, (error) => {
           
            whoosh.play((success) => {
            });
        });
        whoosh.play();
    }

    reloadScreen(){
        setTimeout(()=>{
            this.setState({loadData:true})
        },50)
        this.checkNetInfo()
    }

    updateLocalDataBase=async(order_ide,status)=>{
        const realm = await orderMasterSchema()

        const order_master = realm.objects("order_master");
        let id = JSON.stringify(order_ide)
        const master_data = order_master.filtered(`order_id == ${id}`);
        realm.write(() => {
            for(let i = 0; i < master_data.length; i ++){
                master_data[i].status = status
            }
        });

        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: order_ide,
            task: "UPDATE"
        }
        this.state.channel.push("deleteQue", {data: mdata})
        this.checkProductAddQue()
    }

    storeOrderDetailsLocaly=async(order_data,master_data)=>{
        const realm = await orderMasterSchema()
        for(let i = 0; i < master_data.length; i ++){
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: master_data[i].order_id,
                task: "ADD"
            }

            this.state.channel.push("deleteQue", {data: mdata})
            let id = JSON.stringify(master_data[i].order_id)
            let o_data = realm.objects("order_master").filtered(`order_id == ${id}`)

            if(o_data.length == 0){
                let task1;
                realm.write(() => {
                    task1 = realm.create("order_master", {
                        order_id:master_data[i].order_id,
                        time:master_data[i].time,
                        date:master_data[i].order_date,
                        status:master_data[i].status,
                        user_id:master_data[i].user_id,
                        is_upload:1,
                        gst:master_data[i].gst,
                        sgst:0,
                        charge:master_data[i].charge,
                        tableNumber:master_data[i].tableNumber,
                        orderDetails:order_data
                    })
                    // this.setState({startingCount:this.state.startingCount-3,endingCount:this.state.endingCount-3})
                    // this.getOrderMaster(1)
                    this.checkUpdateQue()
                })
            }
           
        }
    }

    loadQueDataRealTime=(master_data)=>{
        let products = [];
            let Total = 0;
            for(let j = 0; j < master_data.orderDetails.length;j++){

                let subTotal = master_data.orderDetails[j].quantity*master_data.orderDetails[j].price
                        products.push({
                            id:master_data.orderDetails[j].product_id,
                            productName:master_data.orderDetails[j].name,
                            description:"description",
                            is_veg:master_data.orderDetails[j].isVeg,
                            count:master_data.orderDetails[j].quantity,
                            price:master_data.orderDetails[j].price.toFixed(2),
                            total:subTotal.toFixed(2),
                        })

                        Total += subTotal
                        if(j == master_data.orderDetails.length-1){
                            let gstPercentage = master_data.gst + "%"

                            let gstCharge = (Total * parseInt(gstPercentage/2))/100
                            let sgstCharge = (Total * parseInt(gstPercentage/2))/100

                            let total = gstCharge+master_data.charge+Total+sgstCharge
                            this.state.orderList.unshift({
                                    type: 'NORMAL',
                                    item: {
                                        id:master_data.order_id[0]+master_data.order_id[1],
                                        ordedr_id:master_data.order_id,
                                        time:master_data.o_date,
                                        status:master_data.status,
                                        user_id:master_data.user_id,
                                        product:products,
                                        gTotal:total.toFixed(2),
                                        delivery:false,
                                        deliveryStaffName:"",
                                        deliveryId:"",
                                        charge:master_data.charge.toFixed(2),
                                        gst:gstCharge.toFixed(2),
                                        sgst:sgstCharge.toFixed(2),
                                        tableNumber:master_data.tableNumber
                                    }
                            })
                            let data = this.state.orderList.filter((thing, index, self) =>
                            index === self.findIndex((t) => (
                                t.item.ordedr_id === thing.item.ordedr_id
                            )))
                    
                            this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data),emptyOrder:false})

                        }         
            }
    }

    storeOrderDetails=async(product,order)=>{
        this.checkProductUpdateQue()
        const realm = await orderMasterSchema()
        for(let i = 0;i < product.length; i ++){
            const order_id = JSON.stringify(product[i].order_id)
            const order_data = realm.objects("order_master").filtered(`order_id == ${order_id}`)
            realm.write(() => {
                order_data[0].orderDetails.push({
                    order_detail_id:product[i].order_detail_id,
                    order_id:product[i].order_id,
                    product_id:product[i].product_id,
                    quantity:product[i].quantity,
                    price:product[i].price,
                    name:product[i].name,
                    isVeg:product[i].isVeg
                })
                
                let mdata = {
                    uToken: global.utoken,
                    rToken: global.rtoken,
                    accessid: product[i].order_detail_id,
                    task: "PRODUCT_ADD"
                }
                this.state.channel.push("deleteQue", {data: mdata})

                if(i == product.length-1){
                    order_data[0].gst = order[0].gst
                    order_data[0].charge = order[0].charge
                    order_data[0].tableNumber = order[0].tableNumber
                    order_data[0].sgst = 0
                }
            })
        }
    }

    storeOrderDetailsByAddOrder=async(product)=>{
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

            for(let i = 0; i < product.length; i ++){
                let task1;
                realm.write(() => {
                    task1 = realm.create("order", {
                                    order_detail_id:product[i].order_detail_id,
                                    order_id:product[i].order_id,
                                    product_id:product[i].product_id,
                                    quantity:product[i].quantity,
                                    price:product[i].price,
                                    status:0
                            })
                })

                if(i == product.length-1){
                    this.getOrderMaster(1)
                }
            }
    }

    checkUpdateQue=()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Order",
            task:"UPDATE"
        }

        this.state.channel.push("checkQueue", {data: data})
    }

    checkDeliveryAddQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Delivery",
            task:"ADD"
        }

        this.state.deliveryChannel.push("checkQueue", {data: data})
    }

    storeDeliveryLocalDatabase =async(data)=>{
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
                        this.setState({extendState:{ordedr_id:data[i].order_id,load:true}})
                        this.setState({extendState:{ordedr_id:null,load:false}})
            })
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: data[i].delivery_id,
                task: "ADD"
            }
            this.state.deliveryChannel.push("deleteQue", {data: mdata})
            this.checkDeliveryUpdateQue()
        }      
    }

    storeLocalDatabase =async(data)=>{
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: data.delivery_id,
            task: "DELETE"
        }
        this.state.deliveryChannel.push('deleteQue', {data: mdata})
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
                    this.setState({extendState:{ordedr_id:data.order_id,load:true}})
                    this.setState({extendState:{ordedr_id:null,load:false}})
        })
    }

    async deleteLocalDatabseData(orderData){
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
        let id = JSON.stringify(orderData.order_id)
        let data = deliveryData.filtered(`order_id == ${id}`);

        realm.write(() => {
            realm.delete(data)
            this.setState({extendState:{ordedr_id:orderData.order_id,load:true}})
            this.setState({extendState:{ordedr_id:null,load:false}})
        })

        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: orderData.deliveryId,
            task: "DELETE"
        }
        this.state.deliveryChannel.push("deleteQue", {data: mdata})
    }

    checkDeliveryUpdateQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Delivery",
            task:"UPDATE"
        }

        this.state.deliveryChannel.push("checkQueue", {data: data})
    }

    checkDeliveryDeleteQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Delivery",
            task:"DELETE"
        }

        this.state.deliveryChannel.push("checkQueue", {data: data})
    }

    deleteDeliveryDataLocallyQue =async(delivery_id)=>{
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

        if(data.length !== 0){
            realm.write(() => {
                realm.delete(data)
                this.setState({extendState:{ordedr_id:data[0].order_id,load:true}})
                this.setState({extendState:{ordedr_id:null,load:false}})
            })
        }

        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: delivery_id,
            task: "DELETE"
        }
        this.state.deliveryChannel.push("deleteQue", {data: mdata})
    }
    
    storeOrderDetailsLocalysocket =async(data)=>{       
        const realm = await orderMasterSchema()
        let id = JSON.stringify(data.order_id)
        const oData = realm.objects("order_master").filtered(`order_id == ${id}`)
        if(oData.length == 0){
            this.NewNotification()
            this.loadOrdersForOrders(data)
            let task1;
            realm.write(() => {
                task1 = realm.create("order_master", {
                            order_id:data.order_id,
                            time:data.time,
                            date:data.o_date,
                            status:data.status,
                            user_id:data.user_id,
                            is_upload:1,
                            gst:data.gst,
                            sgst:0,
                            charge:data.charge,
                            tableNumber:data.tableNumber,
                            orderDetails:data.product
                        })
    
                let mdata = {
                    uToken: global.utoken,
                    rToken: global.rtoken,
                    accessid: data.order_id,
                    task: "ADD"
                }
                this.state.channel.push("deleteQue", {data: mdata})
            })
        }     
    }

    loadOrdersForOrders=(master_data)=>{
            let products = [];
            let Total = 0;
            for(let j = 0; j < master_data.product.length;j++){

                let subTotal = master_data.product[j].quantity*master_data.product[j].price
                        products.push({
                            id:master_data.product[j].product_id,
                            productName:master_data.product[j].name,
                            description:"description",
                            is_veg:master_data.product[j].isVeg,
                            count:master_data.product[j].quantity,
                            price:master_data.product[j].price.toFixed(2),
                            total:subTotal.toFixed(2),
                        })

                        Total += subTotal
                        if(j == master_data.product.length-1){
                            let gstPercentage = master_data.gst + "%"
                            let sgstPercentage = master_data.sgst + "%"

                            let gstCharge = (Total * parseInt(gstPercentage))/100
                            let sgstCharge = (Total * parseInt(sgstPercentage))/100

                            let total = gstCharge+master_data.charge+Total+sgstCharge
                            this.state.orderList.unshift({
                                    type: 'NORMAL',
                                    item: {
                                        id:master_data.order_id[0]+master_data.order_id[1],
                                        ordedr_id:master_data.order_id,
                                        time:master_data.o_date,
                                        status:master_data.status,
                                        user_id:master_data.user_id,
                                        product:products,
                                        gTotal:total.toFixed(2),
                                        delivery:false,
                                        deliveryStaffName:"",
                                        deliveryId:"",
                                        charge:master_data.charge.toFixed(2),
                                        gst:gstCharge.toFixed(2),
                                        sgst:sgstCharge.toFixed(2),
                                        tableNumber:master_data.tableNumber
                                    }
                            })
                            let data = this.state.orderList.filter((thing, index, self) =>
                            index === self.findIndex((t) => (
                                t.item.ordedr_id === thing.item.ordedr_id
                            )))
                    
                            this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data),emptyOrder:false})
                        }         
            }
    }

    checkProductAddQue=()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Order",
            task:"PRODUCT_ADD"
        }

        this.state.channel.push("checkQueue", {data: data})
    }

    checkProductUpdateQue=()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Order",
            task:"PRODUCT_UPDATE"
        }

        this.state.channel.push("checkQueue", {data: data})
    }

    updateOrderDetails=async(product,dOrder)=>{
        this.checkProductDeleteQue()      

        const realm = await orderMasterSchema()

        const order = realm.objects("order_master")
        
        for(let i = 0; i < product.length; i ++){
            let id = JSON.stringify(product[i].order_id)
            let orderData = order.filtered(`order_id == ${id}`)

            let index = orderData[0].orderDetails.findIndex(x=>x.order_detail_id == product[i].order_detail_id)

            realm.write(()=>{
                orderData[0].orderDetails[index].quantity = product[i].quantity
                if(i == product.length-1){
                    orderData[0].gst = dOrder[0].gst
                    orderData[0].charge = dOrder[0].charge
                    orderData[0].sgst = 0
                    orderData[0].tableNumber = dOrder[0].tableNumber
                }
            })

            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: product[i].order_detail_id,
                task: "PRODUCT_UPDATE"
            }
            this.state.channel.push("deleteQue", {data: mdata})   
        }
    }

    checkProductDeleteQue=()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Order",
            task:"PRODUCT_DELETE"
        }
        this.state.channel.push("checkQueue", {data: data})
    }

    deleteOrderDetails=async(detail_id)=>{
        const realm = await orderMasterSchema()

        const data = realm.objects("order_master")

        for(let i = 0; i < data.length; i ++){
            for(let j = 0; j < data[i].orderDetails.length; j ++){
                if(detail_id == data[i].orderDetails[j].order_detail_id){

                    realm.write(()=>{
                        realm.delete(data[i].orderDetails[j])
                    })

                    let mdata = {
                        uToken: global.utoken,
                        rToken: global.rtoken,
                        accessid: detail_id,
                        task: "PRODUCT_DELETE"
                    }

                    this.state.channel.push("deleteQue", {data: mdata})
                    // this.setState({startingCount:this.state.startingCount-3,endingCount:this.state.endingCount-3})
                    // this.getOrderMaster(1)
                }
            }
        }      
    }

    loadAddProduct =async(order,order_data)=>{
        if(order !== false){
            for(let i = 0; i < order.length;i ++){
                let mindex = this.state.orderList.findIndex(x=>x.item.ordedr_id === order[i].order_id)
                let subTotal = order[i].quantity*order[i].price

                this.state.orderList[mindex].item.product.unshift({
                    id:order[i].product_id,
                    productName:order[i].name,
                    description:"__",
                    is_veg:order[i].isVeg,
                    count:order[i].quantity,
                    price:order[i].price.toFixed(2),
                    total:subTotal.toFixed(2),
                })

                if(i == order.length-1){
                    this.calculateTotalAmount(mindex,order_data)
                }      
            }       
        }
    }

    loadUpdateProduct =async(order,order_data)=>{
        if(order !== false){
            for(let i = 0; i < order.length; i ++){
                let subTotal = order[i].quantity*order[i].price
                let mindex = this.state.orderList.findIndex(x=>x.item.ordedr_id === order[i].order_id)
                let pindex = this.state.orderList[mindex].item.product.findIndex(x=>x.id == order[i].product_id)
                this.state.orderList[mindex].item.product[pindex].count = order[i].quantity
                this.state.orderList[mindex].item.product[pindex].total = subTotal.toFixed(2)

                if(i == order.length-1){
                    this.calculateTotalAmount(mindex,order_data)
                }      
            }
        }
    }

   
    calculateTotalAmount =(index,order_data)=>{
        let Total = 0
        for(let i = 0; i < this.state.orderList[index].item.product.length; i ++){
            Total +=  parseFloat(this.state.orderList[index].item.product[i].total)
            if(i == this.state.orderList[index].item.product.length - 1){
                let gstPercentage = order_data[0].gst + "%"
                let sgstPercentage = order_data[0].sgst + "%"

                let gstCharge = (Total * parseInt(gstPercentage))/100
                let sgstCharge = (Total * parseInt(sgstPercentage))/100

                let total = gstCharge+order_data[0].charge+Total+sgstCharge

                this.state.orderList[index].item.gst = gstCharge.toFixed(2)
                this.state.orderList[index].item.sgst = sgstCharge.toFixed(2)
                this.state.orderList[index].item.charge = order_data[0].charge.toFixed(2)
                this.state.orderList[index].item.gTotal = total.toFixed(2)
                this.setState({orderList:this.state.orderList})
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList)})
            }
        }
    }

    realTimeUpdateOrderDetails=(product)=>{
        for(let i = 0; i < product.product.length; i ++){
            if(product.product[i].task == "INSERT"){
                this.inserOrderDetails(product.product[i])
            }else if(product.product[i].task == "UPDATE"){
                this.updateOrderDetailsData(product.product[i])
            }else if(product.product[i].task == "DELETE"){
                this.deleteOrderDetailsData(product.product[i])
            }

            if(i == product.product.length-1){
                this.updateOrderMaster(product)
            }
        }
    }

    async inserOrderDetails(product){
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: product.order_detail_id,
            task: "PRODUCT_ADD"
        }
        this.state.channel.push("deleteQue", {data: mdata})
        
        const realm = await orderMasterSchema()
        const order_id = JSON.stringify(product.order_id)
        const order_data = realm.objects("order_master").filtered(`order_id == ${order_id}`)

        for(let i = 0; i < order_data.length; i ++){
            let id = JSON.stringify(product.product_id)
            let p_data = order_data[i].orderDetails.filtered(`product_id == ${id}`)
            
            if(p_data.length == 0){
                realm.write(() => {
                    order_data[i].orderDetails.push({
                        order_detail_id:product.order_detail_id,
                        order_id:product.order_id,
                        product_id:product.product_id,
                        quantity:product.quantity,
                        price:product.price,
                        name:product.name,
                        isVeg:product.isVeg
                    })
                })
            }
        }
    }

    async updateOrderDetailsData(product){
        const realm = await orderMasterSchema()
        const order_id = JSON.stringify(product.order_id)
        const order_data = realm.objects("order_master").filtered(`order_id == ${order_id}`)
        let index = order_data[0].orderDetails.findIndex(x=>x.order_detail_id == product.order_detail_id)

        realm.write(()=>{
            order_data[0].orderDetails[index].quantity = product.quantity
        })
        
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: product.order_detail_id,
            task: "PRODUCT_UPDATE"
        }
        this.state.channel.push("deleteQue", {data: mdata})
    }

    async deleteOrderDetailsData(product){
        const realm = await orderMasterSchema()
        const order_id = JSON.stringify(product.order_id)
        const order_data = realm.objects("order_master").filtered(`order_id == ${order_id}`)
        let index = order_data[0].orderDetails.findIndex(x=>x.order_detail_id == product.order_detail_id)

        realm.write(()=>{
            realm.delete(order_data[0].orderDetails[index])
        })
        
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: product.order_detail_id,
            task: "PRODUCT_DELETE"
        }
        this.state.channel.push("deleteQue", {data: mdata})
    }

    async updateOrderMaster(product){
        const realm = await orderMasterSchema()

        let data = realm.objects("order_master")
        let id = JSON.stringify(product.order_id)
        let orderData = data.filtered(`order_id == ${id}`)
        realm.write(()=>{
            for(let i = 0; i < orderData.length; i ++){
                orderData[i].gst = product.gst
                orderData[i].charge = product.charge
                orderData[i].sgst = 0
                orderData[i].tableNumber = product.tableNumber
            }
        })
        this.setState({startingCount:this.state.startingCount - 3,endingCount:this.state.endingCount-3})
        this.getOrderMaster(1)
    }

    tapNotification =()=>{
        var whoosh = new Sound('quiet_knock.mp3', Sound.MAIN_BUNDLE, (error) => {          
            whoosh.play((success) => {
            });
        });
        whoosh.play();
    }

    NewNotification =()=>{
        var whoosh = new Sound('task.mp3', Sound.MAIN_BUNDLE, (error) => {          
            whoosh.play((success) => {
            });
        });
        whoosh.play();
    }

    getDetailsPrint=async()=>{
        let schema = {
            name: "print_details",
            properties: {
            name: "string",
            address:"string",
            phone:"int"
            },
        };

        const realm = await Realm.open({
            path: "print_details",
            schema: [schema],
        });

        const print_details = realm.objects("print_details")
        if(print_details.length !== 0){
            this.setState({print_data:print_details})
        }
    }

    pagination=async()=>{
        this.setState({noOrders:false})
        this.getOrderMaster(1,"ss","pagination")
    }

    getRestaurentDataLocally=async()=>{
        let schema = {
            name:"rest_details",
            properties:{
               name:"string",
               image_url:"string"
            }
        };

        const realm = await Realm.open({
            path: "rest_details",
            schema: [schema]
        })
        let data = realm.objects("rest_details")
        if(data.length !== 0){
            this.setState({kitchenName:data[0].name})
        }
    }

    

    rowRenderer = (type,data,index,extendedState)=>{
        const {ordedr_id,time,
               status,
               product,
               gTotal,id, 
               delivery,
               deliveryStaffName,
               deliveryId,gst,charge,tableNumber,sgst,user_id} = data.item
        return(
            <View>
                <AdminProductList ordedr_id = {ordedr_id}
                    time = {time}
                    status = {status}
                    product = {product}
                    gTotal = {gTotal}
                    id = {id}
                    paymentConform = {this.paymentConform}
                    delivery = {delivery}
                    deliveryStaffName = {deliveryStaffName}
                    deliveryId = {deliveryId}
                    deliveryChannel = {this.state.deliveryChannel}
                    extendedState = {extendedState.data}
                    gst = {gst}
                    sgst = {sgst}
                    charge = {charge}
                    tableNumber = {tableNumber}
                    btDevices = {this.state.btDevices}
                    print_data = {this.state.print_data}
                    isPrinterConnected = {this.state.isPrinterConnected}
                    kitchenName = {this.state.kitchenName}
                    user_id = {user_id}
                />
            </View>
           
        )
      
    }

    renderFooter = () =>{
        return(
            <View style={style.footer}>
                {
                    this.state.noOrders == false?
                    <ActivityIndicator color={color.secondary} size={font.size.font14}/>
                    :<Text>No more orders</Text>
                }
            </View>
        )
    }

    render(){
        const {emptyOrder,loader,show,date,mode,loadStatus,loadData,isConnected,isPrinterConnected,btDevices,printerName,loading} = this.state
        return(
            <View style={style.container}>
                <Header/>
                <ScreenFocus is_focused={()=>this.reloadScreen()}/>
            {
                loadData?
                <>
                {
                    isConnected?
                    <>
                    {
                        global.access == "ALL"?
                            <OrderFilter changeFilter = {this.changeFilter}
                                    datePickerShow = {this.showDatePicker}/>
                            :null
                    }
                         {/* <OrderFilter changeFilter = {this.changeFilter}
                                    datePickerShow = {this.showDatePicker}/> */}
                         
                         <View style={style.printerConnectionView}>
                            <View style={[style.priterConnectionButton,{backgroundColor:isPrinterConnected?color.green:color.gray}]}>
                                <Icons iconName = {"print-outline"}
                                       iconSize = {font.size.font16}
                                       iconColor = {color.white}/>
                                <Text style={[style.connectText,{color:isPrinterConnected ?color.white:color.borderColor}]}>{isPrinterConnected ? printerName+" Connected":"Printer Not Connected"}</Text>
                                <TouchableOpacity style={style.closeButton} 
                                                  onPress={()=>this.showListOrUnpaired(isPrinterConnected)}>
                                    <Icons iconName = {isPrinterConnected?"close":"chevron-down"}
                                        iconSize = {font.size.font16}
                                        iconColor = {isPrinterConnected?color.secondary:color.tertiary}/>
                                </TouchableOpacity>
                              
                            </View>
                         </View>

                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                display="default"
                                onChange={(onchange)=>this.onChange(onchange)}
                            />
                        )}
                        {
                            loading == false ?
                            <>
                                    {
                                        emptyOrder == false ?
                                        <View style={style.orderListView}>
                                            {
                                                loadStatus == false?
                                                <RecyclerListView
                                                    style={style.orderListView}
                                                    rowRenderer={this.rowRenderer}
                                                    dataProvider={this.state.list}
                                                    layoutProvider={this.layoutProvider}
                                                    forceNonDeterministicRendering={true}
                                                    canChangeSize={true}
                                                    disableRecycling={true}
                                                    renderFooter={this.renderFooter}
                                                    onEndReached={this.pagination}
                                                    // onVisibleIndicesChanged	={this.onScroll}
                                                    initialOffset={3}
                                                    onEndReachedThreshold={2}
                                                    extendedState={{data:this.state.extendState}}
                                                />
                                                :null
                                            }
                                        
                                        </View>
                                        :
                                        <View style={style.emptyOrderView}>
                                            {
                                                loader == true ?
                                                <ActivityIndicator size={font.size.font25} color={color.primary}/>:
                                                <Text style={style.emptyOrderText}>🧐 No Orders </Text>
                                            }
                                        </View>
                                    }
                            </>
                            :
                            <View style={style.emptyOrderView}>
                                <ActivityIndicator color={color.secondary} size={font.size.font14}/>
                            </View>
                        }

                       
                            <RBSheet
                                 ref={ref => {
                                    this.RBSheet = ref;
                                  }}
                                height={height/2}
                                openDuration={250}
                                customStyles={{
                                container: {
                                    justifyContent: "center",
                                    alignItems: "center"
                                }
                                }}
                            >
                            <>
                            <BillType btDevices={btDevices}
                                      setConnectedDevice={this.connectPrinter}/>
                            </>
                            </RBSheet>
                        </>
                    :
                    <NoInternet/>
                }
                </>
                :null
            }
                
                
            </View>
        )
    }
}

export default Admin;