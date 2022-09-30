import React from "react";
import {View,Dimensions,PermissionsAndroid,Text,ActivityIndicator} from "react-native";
import style from "./Style";
import Header from "../../molecules/order_header/Header"
import OrderFilter from "../../organisms/order_filter/OrderFilter";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import DeliveryProductList from "../../organisms/delivery_product_list/DeliveryProductList";
import Realm from "realm";
import { toast } from "../../../global_functions/toast_message/Toast";
import Geolocation from '@react-native-community/geolocation';
import moment from "moment"
import DateTimePicker from '@react-native-community/datetimepicker';
import font from "../../../theme/font";
import color from "../../../theme/colors";
import NoInternet from "../no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";
var Sound = require('react-native-sound');

class Delivery extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
              }),
            orderList:[],
            deliveryChannel:"",
            loadData:false,
            deliverySchema:null,
            productSchema:null,
            status:{
                status:null,
                delivery_id:null
            },
            emptyOrder:false,
            show:false,
            date:new Date(Date.now()),
            mode:"date",
            orderId:0,
            productId:0,
            loader:false,
            isConnected:false,
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = Dimensions.get('window').height; 
          })
    }

    componentDidMount(){
       this.checkNetInfo()
       setTimeout(()=>{
           this.setState({loadData:true})
       },100)
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                this.locationPermission()
                this.getDeliveryData(1)
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    async locationPermission(){
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: "Current Location Permission",
                message:
                  "Cool Photo App needs access to your camera " +
                  "so you can take awesome pictures.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(info => {
                    let position = { latitude:info.coords.latitude,
                                     longitude:info.coords.longitude,
                                     uToken:global.utoken,
                                     task:"DELIVERY"}
                    this.socketConnect(position)
                  });
            } else {
              toast("Location permission denied")
            }
          } catch (err) {
            console.warn(err);
          }
    }

    loadData=(data)=>{
        let gtotal = 0
        for(let i = 0; i < data.data.length; i ++){
            gtotal += data.data[i].total
            let Total = gtotal + data.gst + data.charge + data.sgst
                this.state.orderList.unshift({
                type: 'NORMAL',
                item: {
                        ordedr_id:data.order_id,
                        delivery_id:data.delivery_id,
                        time:data.order_time,
                        status:data.status,
                        product:data.data,
                        c_name:data.name,
                        c_address:data.address,
                        c_number:data.number,
                        gTotal:Total.toFixed(2),
                        loading:false,
                        gst:data.gst.toFixed(2),
                        sgst:data.sgst.toFixed(2),
                        charge:data.charge.toFixed(2)
                    }
                })
                if(i == data.data.length-1){
                    let filterDdata = this.state.orderList.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.item.delivery_id === thing.item.delivery_id
                    ))
                    )
                    let deliveryData =  filterDdata.filter(x => x.item.status !== "Deliverd");
                    this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(deliveryData),loadData:true,emptyOrder:false})
                }
            }    
    }

    socketConnect =(position)=>{
        const phxChannel = global.socket.channel('delivery:' + global.rtoken,{position:position})

        phxChannel.join().receive('ok',response => {
            this.setState({deliveryChannel:phxChannel})
            this.checkAddQue()
            this.updateLocation()
        })

        phxChannel.on('newOrder',order => {
            if(global.utoken == order.staff_id){
                this.loadData(order)
                this.storeLocalDatabase(order)
                this.orderNotification()
            }
        })

        phxChannel.on('updateStatus',delivery => {
            this.updateLocalDatabaseStatus(delivery.delivery.delivery_id,delivery.delivery.status,delivery.delivery.order_id)
        })

        phxChannel.on("deleteDelivery",responce =>{    
             this.queDeleteLocalDataBase(responce.delivery.deliveryId)
             this.buttonTapNotification()
         })

         phxChannel.on("checkQueue",data => {
            if(data.order_details.staffId == global.utoken){
                if(data.order_details.task == "ADD"){
                    if(data.order_details.delivery !== false){
                        this.loadQueData(data.order_details.delivery,data.order_details.productDetails)
                    }else{
                        this.checkDeleteQue()
                    }
                }else if(data.order_details.task == "DELETE"){
                    if(data.order_details.delivery !== false){
                        this.queDeleteLocalDataBase(data.order_details.delivery)
                    }
                }
            }
         })
    }

    componentWillUnmount(){
        this.state.deliveryChannel.leave().receive('ok',response => {
        })
    }

    async storeLocalDatabase(data){
        let gst = data.gst.toString()
        let sgst = data.sgst.toString()
        let charge = data.charge.toString()

        let task1;
        this.state.deliverySchema.write(() => {
            task1 =  this.state.deliverySchema.create("delivery", {
                        delivery_id:data.delivery_id,
                        order_id:data.order_id,
                        staff_id:data.staff_id,
                        restaurent_id:data.restaurent_id,
                        order_time:data.order_time,
                        delivery_time:"data.delivery_time",
                        name:data.name,
                        address:data.address,
                        number:data.number,
                        status:data.status,
                        gst:gst,
                        sgst:sgst,
                        charge:charge
                    })
            this.storeProductData(data.data,data.delivery_id)
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: data.delivery_id,
                task: "ADD"
            }
            this.state.deliveryChannel.push("deleteQue", {data: mdata})
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
                            is_veg:data[i].isVeg,
                            name:data[i].name,
                            discription:"description",
                            price:data[i].price,
                            quantity:data[i].quantity,
                            total:data[i].total,
                            delivery_id:delivery_id
                        })
            })
        }
    }

    getDeliveryData=async(type,cDate)=>{
        let dayTime = new Date().toISOString().slice(0, 10)
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
                sgst:"string",
                charge:"string"
            }
        };

        const realm = await Realm.open({
            path: "delivery",
            schema: [schema]
        })

        this.setState({deliverySchema:realm})
        const deliveryData = realm.objects("delivery");
        if(deliveryData.length !== 0){
            if(type == 0){
                const date = JSON.stringify(dayTime)
                const master_data = deliveryData.filtered(`order_time == ${date}`);
                if(master_data.length !== 0){
                    this.getDProductData(master_data)
                    setTimeout(()=>{this.setState({emptyOrder:false})},500)
                }else{
                    this.setState({emptyOrder:true})
                }
            }
            else if(type == 1){
                const status1 = JSON.stringify("Pending")
                const status2 = JSON.stringify("Accept")
                const date = JSON.stringify(dayTime)
                const master_data = deliveryData.filtered(`status == ${status1} || status == ${status2} && order_time == ${date}`);
                if(master_data.length !== 0){
                    this.getDProductData(master_data)
                    setTimeout(()=>{this.setState({emptyOrder:false})},500)
                }else{
                    this.setState({emptyOrder:true})
                }
            }else if(type == 2){
                const status1 = JSON.stringify("Deliverd")
                const date = JSON.stringify(dayTime)
                const master_data = deliveryData.filtered(`status == ${status1} && order_time == ${date}`);
                if(master_data.length !== 0){
                    this.getDProductData(master_data)
                    setTimeout(()=>{this.setState({emptyOrder:false})},500)
                }else{
                    this.setState({emptyOrder:true})
                }
            }else if(type == 3){
                const date = JSON.stringify(cDate)
                const master_data = deliveryData.filtered(`order_time == ${date}`);
                if(master_data.length !== 0){
                    this.getDProductData(master_data)
                    setTimeout(()=>{this.setState({emptyOrder:false})},500)
                    this.setState({show:false})
                }else{
                    this.setState({emptyOrder:true})
                }
            }
        }else{
            this.setState({emptyOrder:true})
        }
    }

    async getDProductData(deliveryData){
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
        this.setState({productSchema:realm})
        const productData = realm.objects("d_product");
        this.loadDeliveryData(deliveryData,productData)
    }

    loadDeliveryData(deliveryData,productData){
        this.state.orderList.splice(0, this.state.orderList.length)

        let filterDdata = deliveryData.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.delivery_id === thing.delivery_id
            ))
        )

        for(let i = 0; i < filterDdata.length; i ++){
                let id = JSON.stringify(filterDdata[i].delivery_id)
                let data = productData.filtered(`delivery_id == ${id}`);
                let product = []
                let gtotal = 0
                let filterPdata = data.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                    t.product_id === thing.product_id
                ))
                )
                for(let p = 0; p < filterPdata.length; p ++){
                        product.push({
                            is_veg:filterPdata[p].is_veg,
                            name:filterPdata[p].name,
                            description:filterPdata[p].discription,
                            price:filterPdata[p].price,
                            quantity:filterPdata[p].quantity,
                            total:filterPdata[p].total.toFixed(2),
                            product_id:filterPdata[p].product_id
                        })
                        gtotal +=filterPdata[p].total                   
                }
                let gst = parseFloat(filterDdata[i].gst)
                let sgst = parseFloat(filterDdata[i].sgst)
                let charge = parseFloat(filterDdata[i].charge)

                let Total = gtotal + gst + charge

                this.state.orderList.unshift({
                    type: 'NORMAL',
                    item: {
                        ordedr_id:filterDdata[i].order_id,
                        delivery_id:filterDdata[i].delivery_id,
                        time:filterDdata[i].order_time,
                        status:filterDdata[i].status,
                        product:product,
                        c_name:filterDdata[i].name,
                        c_address:filterDdata[i].address,
                        c_number:filterDdata[i].number,
                        gTotal:Total.toFixed(2),
                        loading:false,
                        gst:filterDdata[i].gst,
                        sgst:filterDdata[i].sgst,
                        charge:filterDdata[i].charge
                    }
                })
                if(i == filterDdata.length-1){
                    this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.orderList),loadData:true})
                }
            // }
        }
    }

    changeStatus=(data,status)=>{
        if(this.state.isConnected){
            this.setState({loader:true})
            const {deliveryChannel} = this.state
            let delivery ={order_id:data.ordedr_id,
                           restaurent_id:global.rtoken,
                           delivery_id:data.delivery_id,
                           status:status}
            deliveryChannel.push('updateStatus', { delivery: delivery})
    
            deliveryChannel.on('updateStatus',delivery => {
                let delivery_id = delivery.delivery.delivery_id
                this.updateStatus(data,delivery.delivery.status,false)
                this.updateLocalDatabaseStatus(delivery_id,delivery.delivery.status)
            })
        }else{
            this.setState({isConnected:false})
        }      
    }

    async updateLocalDatabaseStatus(delivery_id,status){
        const deliveryData = this.state.deliverySchema.objects("delivery");
        let id = JSON.stringify(delivery_id)
        let data = deliveryData.filtered(`delivery_id == ${id}`);
        this.state.deliverySchema.write(() => {
            for(let i = 0; i < data.length; i ++){
                data[i].status = status
                this.setState({loader:false})
            }
        })
    }

    updateStatus(data,status,loading){
        const {orderList} = this.state
        const index = orderList.findIndex(x => x.item.delivery_id === data.delivery_id);
        orderList.splice(index, 1);
                let oredr_data = {
                    type: 'NORMAL',
                    item: {
                        ordedr_id:data.ordedr_id,
                        delivery_id:data.delivery_id,
                        time:data.time,
                        status:status,
                        product:data.product,
                        c_name:data.c_name,
                        c_address:data.c_address,
                        c_number:data.c_number,
                        gTotal:data.gTotal,
                        loading:loading,
                        gst:data.gst,
                        charge:data.charge
                    }
                }
                orderList.splice(index, 0, oredr_data)
                this.setState({orderList:orderList})
                let filterDdata = this.state.orderList.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.item.delivery_id === thing.item.delivery_id
                ))
                )
                setTimeout(()=>{this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(filterDdata),loader:false})},10)
                if(status == "Deliverd"){
                    setTimeout(()=>{this.getDeliveryData(1,"lll")},1000)                   
                }
    }

    async updateLocation(){
        const {deliveryChannel} = this.state
        Geolocation.watchPosition(info => {
            let position = { latitude:info.coords.latitude,
                             longitude:info.coords.longitude,
                             uToken:global.utoken,
                             task:"DELIVERY"}
            deliveryChannel.push('update_position', { position:position})
        },{enableHighAccuracy: true, maximumAge: 0,distanceFilter: 10});
    }

    onChange=(dat)=>{  
        this.setState({show:false}) 
        if(dat.type == "set"){
            var cdate = new Date(dat.nativeEvent.timestamp)
            let date = cdate.toISOString().slice(0, 10)
            this.getDeliveryData(3,date)
        }
    }

    showDatePicker=()=>{
        setTimeout(()=>{this.setState({show:true})},100)
    }

    checkAddQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Delivery",
            task:"ADD"
        }

        this.state.deliveryChannel.push("checkQueue", {data: data})
    }

    loadQueData=(delivery,propduct)=>{
        this.storeQueueOrderLocally(delivery,propduct)
        let gtotal = 0
        for(let i = 0; i < delivery.length; i ++){
                for(let p = 0; p < propduct.length; p ++){
                    gtotal += propduct[p].total
                }
                let Total = gtotal + delivery[i].gst + delivery[i].charge + delivery[i].sgst
                this.state.orderList.unshift({
                type: 'NORMAL',
                item: {
                        ordedr_id:delivery[i].order_id,
                        delivery_id:delivery[i].delivery_id,
                        time:delivery[i].order_time,
                        status:delivery[i].status,
                        product:propduct,
                        c_name:delivery[i].name,
                        c_address:delivery[i].address,
                        c_number:delivery[i].number,
                        gTotal:Total.toFixed(2),
                        loading:false,
                        gst:delivery[i].gst.toFixed(2),
                        sgst:delivery[i].sgst.toFixed(2),
                        charge:delivery[i].charge.toFixed(2)
                    }
                })
                if(i == delivery.length-1){
                    let filterDdata = this.state.orderList.filter((thing, index, self) =>
                        index === self.findIndex((t) => (
                            t.item.delivery_id === thing.item.delivery_id
                        ))
                    )
                    let deliveryData =  filterDdata.filter(x => x.item.status !== "Deliverd");
                    this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(deliveryData),loadData:true,emptyOrder:false})
                }
            }    
    }

    storeQueueOrderLocally =(delivery,propduct)=>{
        var date = new Date().getDate(); //To get the Current Date
        var month = new Date().getMonth() + 1; //To get the Current Month
        var year = new Date().getFullYear(); //To get the Current Year
        let dayTime = JSON.parse(`${date}${month}${year}`)
        for(let i = 0; i < delivery.length; i ++){
            let gst = delivery[i].gst.toString()
            let sgst = delivery[i].sgst.toString()
            let charge = delivery[i].charge.toString()
            let task1;
            this.state.deliverySchema.write(() => {
            task1 = this.state.deliverySchema.create("delivery", {
                    delivery_id:delivery[i].delivery_id,
                    order_id:delivery[i].order_id,
                    staff_id:delivery[i].staff_id,
                    restaurent_id:delivery[i].restaurent_id,
                    order_time:delivery[i].order_time,
                    delivery_time:"data.delivery_time",
                    name:delivery[i].name,
                    address:delivery[i].address,
                    number:delivery[i].number,
                    status:delivery[i].status,
                    gst:gst,
                    sgst:sgst,
                    charge:charge
                })
            })
            this.storeQueueProductLocally(propduct,delivery[i].delivery_id)
            let data = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: delivery[i].delivery_id,
                task: "ADD"
            }
            this.state.deliveryChannel.push("deleteQue", {data: data})
            this.checkDeleteQue()
        }     
    }

    storeQueueProductLocally =async(product,delivery_id)=>{
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
        for(let i = 0; i < product.length; i ++){
            let task1;
            realm.write(() => {
                task1 =  realm.create("d_product", {
                            product_id:product[i].product_id,
                            is_veg:product[i].isVeg,
                            name:product[i].name,
                            discription:"description",
                            price:product[i].price,
                            quantity:product[i].quantity,
                            total:product[i].total,
                            delivery_id:delivery_id
                        })
            })
        }
    }

    checkDeleteQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Delivery",
            task:"DELETE"
        }

        this.state.deliveryChannel.push("checkQueue", {data: data})
    }

    queDeleteLocalDataBase =async(deliveryId)=>{
      
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

        const deliveryData = realm.objects("delivery");
        let id = JSON.stringify(deliveryId)
        let data = deliveryData.filtered(`delivery_id == ${id}`);

        realm.write(() => {
            realm.delete(data)
            toast("Admin Deleted Order")
            setTimeout(()=>{this.getDeliveryData(1,"ss")},500)
        })
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: deliveryId,
            task: "DELETE"
        }
        this.state.deliveryChannel.push("deleteQue", {data: mdata})
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


    renderFooter = () =>{
        return(
            <View style={style.footer}>

            </View>
        )
    }

    rowRenderer = (type,data,index)=>{
        const {ordedr_id,time,status,product,c_name,c_number,c_address,gTotal,delivery_id,loading,gst,charge } = data.item
        return(
            <DeliveryProductList ordedr_id = {ordedr_id}
                                delivery_id = {delivery_id}
                                time = {time}
                                status = {status}
                                product = {product}
                                c_name = {c_name}
                                c_address = {c_address}
                                c_number = {c_number}
                                gTotal = {gTotal}
                                changeStatus = {this.changeStatus}
                                loading = {loading}
                                gst = {gst}
                                charge = {charge}
                                />
        )
    }

    render(){
        const {loadData,loader,emptyOrder,show,date,mode,isConnected} = this.state
        return(
            <View style={style.container}>
            {
                loadData ?
                <>
                {
                    isConnected?
                    <>                   
                            <Header/>

                            <OrderFilter from = {"Delivery"}
                                        changeFilter = {this.getDeliveryData}
                                        datePickerShow = {()=>this.showDatePicker()}/>
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
                                emptyOrder?
                                <View style={style.emptyOrder}>
                                    <Text style={style.emptyOrderText}>🤷🏻‍♂️</Text>
                                    <Text style={style.emptyOrderText}>No Order Found</Text>
                                </View>
                                :
                                <View style={style.orderListView}>
                                
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
                                        onEndReachedThreshold={2}/>
                                    
                                { loader && (
                                <View style={style.loader}>
                                    <ActivityIndicator size={font.size.font16} color={color.primary}/>
                                </View>
                                )}               
                                </View>
                            }
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

export default Delivery;