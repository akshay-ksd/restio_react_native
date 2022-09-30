import React from "react";
import {View,Dimensions,Text,TouchableOpacity,DeviceEventEmitter} from "react-native";
import style from "./Style";
import Header from "../../molecules/order_header/Header"
import OrderFilter from "../../organisms/order_filter/OrderFilter";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import KitchenProductList from "../../organisms/kitchen_product_list/KitchenProductList";
import {Presence} from 'phoenix';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import NoInternet from "../no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";
import { toast } from "../../../global_functions/toast_message/Toast";
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from '@brooons/react-native-bluetooth-escpos-printer';
import Icons from "../../atom/Icon";
import BillType from "../../molecules/bill_type/BillType";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import RBSheet from "react-native-raw-bottom-sheet";

const {height,width} = Dimensions.get("window");

var Sound = require('react-native-sound');

class Kitchen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
              }),
            orderList:[],
            channel:null,
            presences:{},
            RoomData:[],
            loadList:false,
            deleteProductId:null,
            deleteKitchenId:null,
            emptyView:false,
            updateKitchenId:null,
            show:false,
            date:new Date(Date.now()),
            mode:"date",
            isConnected:false,
            loadData:false,
            btDevices:[],
            kitchenName:"",
            isPrinterConnected:false,
            printerName:"",
            print_data:[]
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
        this.checkNetInfo()
        setTimeout(()=>{this.setState({loadData:true})},100)
        this.getRestaurentDataLocally()
        this.checkIsPrinterConnected()
        this.checkConnection()
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
                this.connectSocket()
                this.getDataFromLocalDatabse(1)
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    connectSocket=()=>{
        const phxChannel = global.socket.channel('chef:' + global.rtoken,{userId:global.utoken})
        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
            this.checkAddQue()
        })

        phxChannel.on('order',order => {
            if(global.utoken == order.stafId){
                this.loadProduct(order)
            }
        })

        phxChannel.on("checkQueue",data => {
            if(data.data.staffId == global.utoken){
                if(data.data.task == "ADD"){
                    if(data.data.section == "Kitchen"){
                        if(data.data.kitchen !== false){
                            let type = "newOrder"  
                            this.loadQueData(data.data.kitchen,data.data.kitchen_details,type)    
                        }else{
                            this.checkAddProductQue()
                        } 
                    }else{
                        if(data.data.kitchen_details !== false){
                            this.loadNewProduct(data.data.kitchen_details,data.data.kitchen)
                        }else{
                            this.checkDeleteProductQue()
                        } 
                    }                   
                }else if(data.data.task == "DELETE"){
                    if(data.data.kitchen_details !== false){
                        this.loadDeleteQueTask(data.data.kitchen_details)
                    }
                }
            }
         })
    }

    componentWillUnmount(){
        this.state.channel.leave().receive('ok',response => {
        })
    }

    orderAccept=(kitchenId,status)=>{
        if(this.state.isConnected){
            setTimeout(()=>{this.setState({updateKitchenId:kitchenId})
            let order = {
                kitchenId:kitchenId,
                status:status,
                restaurentId:global.rtoken,
                staffId:global.utoken
            }
            this.state.channel.push('updateStatus', { order: order})},10)
        }else{
            this.setState({isConnected:false})
        }
    }

    loadProduct=(data)=>{
        if(data.type == "newOrder"){
            this.state.orderList.unshift({
                type: 'NORMAL',
                item: {
                    kitchenId:data.order.kitchenId,
                    time:data.order.time,
                    status:data.order.status,
                    product:data.order.productId,
                    note:data.order.note,
                    date:data.order.date,
                }
            })
            let filterDdata = this.state.orderList.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.item.kitchenId === thing.item.kitchenId
                ))
            )

            let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");
            this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(orderData),loadList:true})
            this.storeLocalDatabase(data)
            this.orderNotification()
            this.kot(data.order.productId,data.order)
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: data.order.kitchenId,
                task: "ADD"
            }

            this.state.channel.push("deleteQue", {data: mdata})
        }
        else if(data.type == "addProduct"){
            let index = this.state.orderList.findIndex(x => x.item.kitchenId === data.kitchenId)
            if(index !== -1){
                for(let i = 0; i < data.order.productId.length; i ++){
                    this.state.orderList[index].item. product.unshift({
                        id:data.order.productId[i].id,
                        name:data.order.productId[i].name,
                        quantity:data.order.productId[i].quantity,
                    })
                    if(i == data.order.productId.length-1){
                        let filterDdata = this.state.orderList.filter((thing, index, self) =>
                        index === self.findIndex((t) => (
                            t.item.kitchenId === thing.item.kitchenId
                        ))
                        )
                        let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");
                        this.setState({orderList:orderData})
                        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList),loadList:true})
                        this.storeProductData(data.order)
                        this.tapNotification()
                    }
                    let mdata = {
                        uToken: global.utoken,
                        rToken: global.rtoken,
                        accessid: data.order.productId[i].kitchen_details,
                        task: "ADD"
                    }
                    this.state.channel.push("deleteQue", {data: mdata})
                }
                
            }
            else{
                this.state.orderList.unshift({
                    type: 'NORMAL',
                    item: {
                        kitchenId:data.order.kitchenId,
                        time:data.order.time,
                        status:data.order.status,
                        product:data.order.productId,
                        note:data.order.note,
                        date:data.order.date,
                    }
                })
                let filterDdata = this.state.orderList.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.item.kitchenId === thing.item.kitchenId
                ))
                )
                let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(orderData),loadList:true})
                this.storeLocalDatabase(data)
                this.orderNotification()
            }
        }
        else if(data.type == "deleteProduct"){
            let index = this.state.orderList.findIndex(x => x.item.kitchenId === data.kitchenId)
            if(index !== -1 ){
                let pIndex = this.state.orderList[index].item.product.findIndex(x => x.id === data.productId)
                if(pIndex !== -1){
                    if(this.state.orderList[index].item.product.length == 1){
                        this.state.orderList.splice(index,1)
                        if(this.state.orderList.length == 0){
                            this.setState({loadList:false})
                        }
                        let filterDdata = this.state.orderList.filter((thing, index, self) =>
                            index === self.findIndex((t) => (
                                t.item.kitchenId === thing.item.kitchenId
                            ))
                        )
                        let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");
                        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(orderData)})
                        this.deleteProduct(data.kitchenId,data.productId,data.order.kitchen_details)
                        this.deleteKitchen(data.kitchenId)
                        this.buttonTapNotification()
                        
                    }else{
                        this.state.orderList[index].item.product.splice(pIndex,1)
                        let filterDdata = this.state.orderList.filter((thing, index, self) =>
                            index === self.findIndex((t) => (
                                t.item.kitchenId === thing.item.kitchenId
                            ))
                        )

                        let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");
                        this.setState({orderList:orderData})
                        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList)})
                        this.deleteProduct(data.kitchenId,data.productId,data.order.kitchen_details)
                        this.buttonTapNotification()
                    }   
                }
            }
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: data.order.kitchen_details,
                task: "DELETE"
            }
            this.state.channel.push("deleteQue", {data: mdata})
        }
        else if(data.type == "updateStatus"){
            this.tapNotification()
            let index = this.state.orderList.findIndex(x => x.item.kitchenId === data.kitchenId)
            this.state.orderList[index].item.status = data.status

            let filterDdata = this.state.orderList.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.item.kitchenId === thing.item.kitchenId
                ))
            )

            let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");

            this.setState({orderList:orderData,updateKitchenId:null})
            if(this.state.orderList.length == 0){
                this.setState({loadList:false})
            }else{
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList),loadList:true})
            }
            this.updateLocalDatabaseStatus(data.kitchenId,data.status)
        }  
    }

    storeLocalDatabase=async(data)=>{
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
                        kitchenId:data.order.kitchenId,
                        orderId:data.order.order_id,
                        restaurentId:data.order.restaurentId,
                        stafId:data.order.staffId,
                        note:data.order.note,
                        date:data.order.date,
                        time:data.order.time,
                        status:data.order.status
                    })
            this.storeProductData(data.order)
        })
    }

    storeProductData=async(data)=>{
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

        for(let i = 0; i < data.productId.length; i ++){
            let task1;
            realm.write(() => {
                task1 =  realm.create("kitchenProduct", {
                            kitchenId:data.kitchenId,
                            id:data.productId[i].id,
                            quantity:data.productId[i].quantity,
                            name:data.productId[i].name,
                            kitchen_details:data.productId[i].kitchen_details
                        })
            })
        }
    }

    getDataFromLocalDatabse=async(type,cDate)=>{
        var date = new Date().getDate(); //To get the Current Date
        var month = new Date().getMonth() + 1; //To get the Current Month
        var year = new Date().getFullYear(); //To get the Current Year
        let dayTime = JSON.parse(`${date}${month}${year}`)

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

        const orderData = realm.objects("kitchen");
        if(orderData.length == 0){
            this.setState({loadList:false})
        }else{
            if(type == 0){
                const master_data = orderData.filtered(`date == ${dayTime}`);
                let filterDdata = master_data.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.kitchenId === thing.kitchenId
                ))
                )
                if(filterDdata.length !== 0){
                    this.getKitchenProduct(filterDdata)
                    // setTimeout(()=>{this.setState({emptyOrder:false})},500)
                }else{
                    this.setState({loadList:false})
                }
            }else if(type == 1){
                const status1 = JSON.stringify("Pending")
                const status2 = JSON.stringify("Accept")
                const master_data = orderData.filtered(`status == ${status1} || status == ${status2} && date == ${dayTime}`);
                let filterDdata = master_data.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.kitchenId === thing.kitchenId
                ))
                )

                if(filterDdata.length !== 0){
                    this.getKitchenProduct(filterDdata)
                    // setTimeout(()=>{this.setState({emptyOrder:false})},500)
                }else{
                    this.setState({loadList:false})
                }
            }else if(type == 2){
                const status1 = JSON.stringify("itemReady")
                const master_data = orderData.filtered(`status == ${status1} && date == ${dayTime}`);
                let filterDdata = master_data.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.kitchenId === thing.kitchenId
                ))
                )
                if(filterDdata.length !== 0){
                    this.getKitchenProduct(filterDdata)
                    // setTimeout(()=>{this.setState({emptyOrder:false})},500)
                }else{
                    this.setState({loadList:false})
                }
            }else if(type == 3){
                const master_data = orderData.filtered(`date == ${cDate}`);
                let filterDdata = master_data.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.kitchenId === thing.kitchenId
                ))
                )
                if(filterDdata.length !== 0){
                    this.getKitchenProduct(filterDdata)
                    // setTimeout(()=>{this.setState({emptyOrder:false})},500)
                }else{
                    this.setState({loadList:false})
                }
            }
        }
    }

    getKitchenProduct=async(orderData)=>{
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

        const pData = realm.objects("kitchenProduct");
        this.state.orderList.splice(0,this.state.orderList.length)

        for(let i = 0; i < orderData.length; i ++){
            let kitchenId = JSON.stringify(orderData[i].kitchenId)
            let productData = pData.filtered(`kitchenId == ${kitchenId}`);
            let product = []
            for(let p = 0; p < productData.length; p ++){
                product.unshift({
                    id:productData[p].id,
                    name:productData[p].name,
                    quantity:productData[p].quantity,
                    kitchen_details:productData[p].kitchen_details
                })
                if(p == productData.length-1){
                    let filterDdata = product.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                    t.id === thing.id
                    ))
                    )
                    this.state.orderList.unshift({
                        type: 'NORMAL',
                        item: {
                            kitchenId:orderData[i].kitchenId,
                            time:orderData[i].time,
                            status:orderData[i].status,
                            product:filterDdata,
                            note:orderData[i].note,
                            date:orderData[i].date,
                        }
                    })
                }
            }
            if(i == orderData.length - 1){
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList),loadList:true})
            }
        }
    }

    deleteProduct=async(kitchenId,id,kitchen_details)=>{
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
        const pData = realm.objects("kitchenProduct");
        let kId = JSON.stringify(kitchenId)
        let pId = JSON.stringify(id)
        let kitchen_detailsId = JSON.stringify(kitchen_details)
        let productData = pData.filtered(`kitchenId == ${kId} && id == ${pId} && kitchen_details == ${kitchen_detailsId}`);
        if(productData.length !== 0){
            realm.write(()=>{
                realm.delete(productData)
            })
        }     
    }

    deleteKitchen =async(kitchenId)=>{
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

        const orderData = realm.objects("kitchen");
        let kId = JSON.stringify(kitchenId)
        let productData = orderData.filtered(`kitchenId == ${kId}`);
        realm.write(()=>{
            realm.delete(productData)
        })
    }

    updateLocalDatabaseStatus =async(kitchenId,status)=>{
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

        const orderData = realm.objects("kitchen");
        let kId = JSON.stringify(kitchenId)
        let productData = orderData.filtered(`kitchenId == ${kId}`);
        realm.write(()=>{
            productData[0].status = status
        })
    }

    showDatePicker=()=>{
        setTimeout(()=>{this.setState({show:true})},100)
    }

    onChange=(dat)=>{  
        this.setState({show:false}) 
        if(dat.type == "set"){
            var customDate = dat.nativeEvent.timestamp
            var date = moment(customDate).format('DD'); //To get the Current Date
            var month = moment(customDate).format('MM'); //To get the Current Month
            var year = moment(customDate).format('YYYY'); //To get the Current Year
            let cDate = JSON.parse(`${date}${month}${year}`)
            this.getDataFromLocalDatabse(3,cDate)
        }
    }

    orderNotification =()=>{
        var whoosh = new Sound('task.mp3', Sound.MAIN_BUNDLE, (error) => {
           
            whoosh.play((success) => {
            });
        });
        whoosh.play();
    }

    buttonTapNotification =()=>{
        var whoosh = new Sound('quiet_knock.mp3', Sound.MAIN_BUNDLE, (error) => {          
            whoosh.play((success) => {
            });
        });
        whoosh.play();
    }

    tapNotification =()=>{
        var whoosh = new Sound('pop.mp3', Sound.MAIN_BUNDLE, (error) => {          
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

    loadQueData =(kitchen,kitchen_details,type)=>{
        if(kitchen.length == 0){
            // this.setState({loadList:false})
        }else{
            for(let i = 0; i < kitchen.length; i ++){
                this.state.orderList.unshift({
                    type: 'NORMAL',
                    item: {
                        kitchenId:kitchen[i].kitchenId,
                        time:kitchen[i].time,
                        status:kitchen[i].status,
                        product:kitchen_details,
                        note:kitchen[i].note,
                        date:kitchen[i].date,
                    }
                })
                
                if(i == this.state.orderList.length-1){
                    let filterDdata = this.state.orderList.filter((thing, index, self) =>
                        index === self.findIndex((t) => (
                            t.item.kitchenId === thing.item.kitchenId
                        ))
                    )

                    let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");
                    this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(orderData),loadList:true})
                    this.storeQueDataLocally(kitchen,kitchen_details)
                }
            }
        }           
    }

    storeQueDataLocally =async(kitchen,kitchen_details)=>{
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
                if(i == kitchen.length - 1){
                    let mdata = {
                        uToken: global.utoken,
                        rToken: global.rtoken,
                        accessid: kitchen[i].kitchenId,
                        task: "ADD"
                    }

                    this.state.channel.push("deleteQue", {data: mdata})
                    this.checkAddProductQue()
                    this.storeQueProductData(kitchen_details)
                }
            })
        }    
    }

    storeQueProductData =async(kitchen_details)=>{
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

        for(let i = 0; i < kitchen_details.length; i ++){
            let task1;
            realm.write(() => {
                task1 =  realm.create("kitchenProduct", {
                            kitchenId:kitchen_details[i].kitchenId,
                            id:kitchen_details[i].id,
                            quantity:kitchen_details[i].quantity,
                            name:kitchen_details[i].name,
                            kitchen_details:kitchen_details[i].kitchen_details
                        })
            })
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

    loadNewProduct =(kitchen_details,kitchen)=>{
        if(kitchen_details.length == 0){
            // this.setState({loadList:false})
        }else{
            for(let i = 0; i < kitchen_details.length; i ++){
              let index = this.state.orderList.findIndex(x => x.item.kitchenId === kitchen_details[i].kitchenId)
              if(index !== -1){
                  this.state.orderList[index].item.product.unshift({
                      id:kitchen_details[i].id,
                      name:kitchen_details[i].name,
                      quantity:kitchen_details[i].quantity,
                      kitchen_details:kitchen_details[i].kitchen_details
                  })
                  this.setState({orderList:this.state.orderList})
                  if(i == kitchen_details.length-1){
                      let filterDdata = this.state.orderList.filter((thing, index, self) =>
                          index === self.findIndex((t) => (
                              t.item.kitchenId === thing.item.kitchenId
                          ))
                      )
                      let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");
                      this.setState({orderList:orderData})
                      this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList),loadList:true})
                      this.storeQueProductData(kitchen_details)
                  }
              }else{
                  this.loadQueData(kitchen,kitchen_details,"type")
              }
              let mdata = {
                  uToken: global.utoken,
                  rToken: global.rtoken,
                  accessid: kitchen_details[i].kitchen_details,
                  task: "ADD"
              }
  
              this.state.channel.push("deleteQue", {data: mdata})
            }
        }
        this.checkDeleteProductQue()
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

    loadDeleteQueTask =async(kitchen_details)=>{
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

        const pData = realm.objects("kitchenProduct");
        let kitchen_details_id = JSON.stringify(kitchen_details)
        let productData = pData.filtered(`kitchen_details == ${kitchen_details_id}`);

        if(productData.length !== 0){
            let kitchenId = productData[0].kitchenId
            let productId = productData[0].id
            let index = this.state.orderList.findIndex(x => x.item.kitchenId === kitchenId)
            let pIndex = this.state.orderList[index].item.product.findIndex(x => x.kitchen_details === kitchen_details)

            if(this.state.orderList[index].item.product.length == 1){
                this.state.orderList.splice(index,1)
                if(this.state.orderList.length == 0){
                    this.setState({loadList:false})
                }

                let filterDdata = this.state.orderList.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.item.kitchenId === thing.item.kitchenId
                    ))
                )

                let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");

                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(orderData)})

                this.deleteProduct(kitchenId,productId,kitchen_details)
                this.deleteKitchen(kitchenId)
            }else{
                this.state.orderList[index].item.product.splice(pIndex,1)
                let filterDdata = this.state.orderList.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.item.kitchenId === thing.item.kitchenId
                    ))
                )
                let orderData =  filterDdata.filter(x => x.item.status !== "itemReady");

                this.setState({orderList:orderData})
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList)})
                this.deleteProduct(kitchenId,productId,kitchen_details)
            }           
        }
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: kitchen_details,
            task: "DELETE"
        }

        this.state.channel.push("deleteQue", {data: mdata})
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

        this.setState({kitchenName:data[0].name})
    }

    kot =async(product,order)=>{
        if(this.state.isPrinterConnected == true){
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printText(this.state.kitchenName+"\n\r",{
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 1,
                heigthtimes: 1,
                fonttype: 1,
            });
            await BluetoothEscposPrinter.printText("__________________________\n\r",{});
            await BluetoothEscposPrinter.printText("KOT\n\r",{
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0.5,
                heigthtimes: 0.5,
                fonttype: 1,
            });
        
            await BluetoothEscposPrinter.printText("...........................\n\r",{});
            await BluetoothEscposPrinter.printColumn([40],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [order.time],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1});
        
            await BluetoothEscposPrinter.printText("...........................\n\r",{});
            await BluetoothEscposPrinter.printColumn([19,8],
                [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER],
                ["ITEM",'QTY'],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0.8,
                heigthtimes: 1,
                fonttype: 1});
            for(let i = 0; i < product.length; i ++){
                await BluetoothEscposPrinter.printColumn([19,8],
                    [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER],
                    [product[i].name.toString(),product[i].quantity.toString()],{encoding: 'GBK',
                    codepage: 0,
                    widthtimes: 0.5,
                    heigthtimes: 0.5,
                    fonttype: 1});
                if(i == product.length-1){
                    await BluetoothEscposPrinter.printText(".\n\r",{});
                    await BluetoothEscposPrinter.printText(order.note+"\n\r",{});
                    await BluetoothEscposPrinter.printText(".\n\r",{});
                    await BluetoothEscposPrinter.printText("...........................\n\r",{});
                    await BluetoothEscposPrinter.printText("\n\r",{});
                    await BluetoothEscposPrinter.printText("\n\r",{});
                }
            }
        }else{
            toast("Printer note connected")
        }
    }

   

    rowRenderer = (type,data,index,extendedState)=>{
        const {kitchenId,time,status,product,note,date} = data.item
        return(
            <KitchenProductList kitchenId = {kitchenId}
                                time = {time}
                                status = {status}
                                product = {product}
                                orderAccept = {this.orderAccept}
                                note = {note}
                                extendedState = {extendedState}
                                btDevices = {this.state.btDevices}
                                kitchenName = {this.state.kitchenName}
                                isPrinterConnected = {this.state.isPrinterConnected}
                                print_data = {this.state.print_data}/>
        )
    }


    renderFooter = () =>{
        return(
            <View>

            </View>
        )
    }

   

    render(){
        const {channel,loadList,date,mode,updateKitchenId,show,loadData,isConnected,isPrinterConnected,btDevices,printerName} = this.state
        return(
            <View style={style.container}>
                {
                    loadData?
                    <>
                        {
                            isConnected?
                            <>
                                    <Header/>

                                        <OrderFilter from = {"Kitchen"}
                                                    changeFilter = {this.getDataFromLocalDatabse}
                                                    datePickerShow = {()=>this.showDatePicker()}/>

                                        <View style={style.printerConnectionView}>
                                            <View style={[style.priterConnectionButton,{backgroundColor:isPrinterConnected?color.green:color.primary}]}>
                                                <Icons iconName = {"print-outline"}
                                                    iconSize = {font.size.font16}
                                                    iconColor = {color.white}/>
                                                <Text style={style.connectText}>{isPrinterConnected ? printerName+" Connected":"Printer Not Connected"}</Text>
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
                                        channel && (
                                            <View style={style.orderListView}>
                                                {
                                                    loadList ?
                                                        <RecyclerListView
                                                            style={style.orderListView}
                                                            rowRenderer={this.rowRenderer}
                                                            dataProvider={this.state.list}
                                                            layoutProvider={this.layoutProvider}
                                                            forceNonDeterministicRendering={true}
                                                            canChangeSize={true}
                                                            disableRecycling={true}
                                                            renderFooter={this.renderFooter}
                                                            // onEndReached={this.pagination}
                                                            // onVisibleIndicesChanged	={this.onScroll}
                                                            initialOffset={3}
                                                            onEndReachedThreshold={2}
                                                            extendedState={{updateKitchenId:updateKitchenId}}
                                                        />
                                                        :
                                                        <View style={style.emptyView}>
                                                            <Text style={style.emptyText}>🤷</Text>
                                                            <Text style={style.emptyText}>No Order Found</Text>
                                                        </View>
                                                }
                                            
                                            </View>
                                        )
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
                            :<NoInternet/>
                        }
                        
                    </>
                    :null
                }
            </View>
        )
    }
}

export default Kitchen;