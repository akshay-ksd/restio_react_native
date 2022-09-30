import React from "react";
import {ScrollView, View,Alert} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import Header from "../../molecules/delivery_details_header/Header";
import LiveLocation from "../../organisms/live_location/LiveLocation";
import style from "./Style";
import DeliveryStatus from "../../molecules/delivery_status_button/DeliveryStatus";
import Address from "../../organisms/delivery_address/Address";
import {Presence} from 'phoenix';
import {toast} from "../../../global_functions/toast_message/Toast";
import NoInternet from "../../templates/no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";


class DeliveryDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            deliveryChannel:null,
            presences:{},
            RoomData:[],
            loadMap:false,
            region: {
                latitude:12.504137,
                longitude:74.984195,
                latitudeDelta: 0.0192,
                longitudeDelta: 0.0191,
              },
              staffId:null,
              deliverySchema:null,
              loadStatus:true,
              isConnected:false
        }
    }

    componentDidMount(){
        this.checkNetInfo()
        setTimeout(()=>{this.setState({loadData:true})},100)
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.getDeliveryData()
                this.connectDeliverySocket()
                this.setState({isConnected:true})
               
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    componentWillUnmount(){
        this.unsubscribe()
       
    }

    loadData(){
        setTimeout(()=>{this.setState({loadData:true})},100)
    } 

    connectDeliverySocket(){
        let position = {latitude:"12.3333",
                        longitude:"17.3333",
                        uToken:global.utoken,
                        task:"ADMIN"}

        const phxChannel = global.socket.channel('delivery:' + global.rtoken,{position:position})

        phxChannel.join().receive('ok',response => {
            this.setState({deliveryChannel:phxChannel})
        })

        phxChannel.on("presence_diff",response => {
           
            let syncedPresence = Presence.syncDiff(this.state.presences, response)
            this.setState({presences:syncedPresence,RoomData:[]})
            this.setState({RoomData:Presence.list(this.state.presences)
              .filter(presences => ! !presences.metas)
              .map(presences => presences.metas[0])})

              const index = this.state.RoomData.findIndex(x => x.uToken === this.state.staffId);
              if(index !== -1){
                this.setState({
                    region: {
                        latitude:this.state.RoomData[index].latitude,
                        longitude:this.state.RoomData[index].longitude,
                        latitudeDelta: 0.0022,
                        longitudeDelta: 0.0021,
                      },
                    loadMap:true
                })
               
              }else{
                let syncedPresence = Presence.syncDiff(this.state.presences, response)
                this.setState({presences:syncedPresence,RoomData:[]})
                let data = Presence.list(this.state.presences)
                this.setState({RoomData:data[0].metas})
                const index = this.state.RoomData.findIndex(x => x.uToken === this.state.staffId);
                if(index !== -1){
                  this.setState({
                      region: {
                          latitude:this.state.RoomData[index].latitude,
                          longitude:this.state.RoomData[index].longitude,
                          latitudeDelta: 0.0022,
                          longitudeDelta: 0.0021,
                        },
                      loadMap:true
                  })
                 
                }else{
                    this.setState({loadMap:false})
                }
              }
        })
          
        phxChannel.on("presence_state",state => {

            let syncedPresence = Presence.syncState(this.state.presences, state)
            this.setState({presences:syncedPresence})
            this.setState({RoomData:Presence.list(this.state.presences)
              .filter(presences => ! !presences.metas)
              .map(presences => presences.metas[0])})

              const index = this.state.RoomData.findIndex(x => x.uToken === this.state.staffId);
              if(index !== -1){
                this.setState({
                    region: {
                        latitude:this.state.RoomData[index].latitude,
                        longitude:this.state.RoomData[index].longitude,
                        latitudeDelta: 0.0022,
                        longitudeDelta: 0.0021,
                      },
                      loadMap:true
                })
              }else{
                let syncedPresence = Presence.syncState(this.state.presences, state)
                this.setState({presences:syncedPresence,RoomData:[]})
              
                let data = Presence.list(this.state.presences)
                this.setState({RoomData:data[0].metas})
                const index = this.state.RoomData.findIndex(x => x.uToken === this.state.staffId);
                if(index !== -1){
                    this.setState({
                        region: {
                            latitude:this.state.RoomData[index].latitude,
                            longitude:this.state.RoomData[index].longitude,
                            latitudeDelta: 0.0022,
                            longitudeDelta: 0.0021,
                        },
                        loadMap:true
                    })
                }else{
                    this.setState({loadMap:false})
                }
              }
        })

        phxChannel.on("deleteDelivery",responce =>{
           let data = {order_id:responce.delivery.order_id,
                       restaurent_id:responce.delivery.restaurent_id}
            this.deleteLocalDatabseData(data)
        })

        phxChannel.on('updateStatus',delivery => {
            let delivery_id = delivery.delivery.delivery_id
            let status = delivery.delivery.status
            this.updateLocalDatabaseStatus(delivery_id,status)
        })
        
    }

   

    cancel(){
        Alert.alert(
            "Cancel Delivery",
            "Are you sure Want To Cancel This Delivery",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel"
              },
              { text: "OK", onPress: () => this.deleteDeliveryDetails() }
            ]
          );
    }

    deleteDeliveryDetails(){
        if(this.state.isConnected){
            let delivery ={order_id:this.props.route.params.ordedr_id,
                restaurent_id:global.rtoken,
                deliveryId:this.props.route.params.deliveryId,
                staffId:this.props.route.params.staffId}
            this.state.deliveryChannel.push('deleteDelivery', { delivery: delivery})
        }else{
            this.setState({isConnected:false})
        }      
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
            this.props.navigation.pop(1)
            toast("Delivery Cancelled")
        })
    }

    getDeliveryData=async()=>{
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
        this.setState({deliverySchema:realm})
        const deliveryData = realm.objects("delivery");
        let id = JSON.stringify(this.props.route.params.ordedr_id)
        let data = deliveryData.filtered(`order_id == ${id}`);
        if(data.length !== 0){
            this.setState({staffId:data[0].staff_id})
        }
    }

    updateLocalDatabaseStatus(delivery_id,status){
        const deliveryData = this.state.deliverySchema.objects("delivery");
        let id = JSON.stringify(delivery_id)
        let data = deliveryData.filtered(`delivery_id == ${id}`);
        this.state.deliverySchema.write(() => {
            data[0].status = status
            this.setState({loadStatus:false})
            this.setState({loadStatus:true})
        })
    }
    render(){
        const {loadData,deliveryChannel,loadMap,region,loadStatus,isConnected} = this.state
        return(
            <View style={style.container}>
                {
                    loadData?
                    <>
                    {
                        isConnected?
                        <>
                            <Header cancel={()=>this.cancel()}/>
                            <ScrollView>
                            {
                                deliveryChannel !== null?
                                <LiveLocation loadMap = {loadMap}
                                            ordedr_id={this.props.route.params.ordedr_id}
                                            region = {region}/>
                                :null
                            }
                                <View style={style.deliveryStatusView}>
                                    <View style={style.deliveryStatus}>
                                        {
                                            loadStatus == true & deliveryChannel !== null?
                                            <DeliveryStatus sendDelivery={()=>sendDelivery()}
                                                ordedr_id={this.props.route.params.ordedr_id}
                                                deliveryChannel = {this.state.deliveryChannel}
                                                from = {"details"}/>
                                            :null
                                        }
                                    
                                    </View>
                                </View>   
                                <Address ordedr_id = {this.props.route.params.ordedr_id}/>            
                            </ScrollView>
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

export default DeliveryDetails