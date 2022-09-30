import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import MapView, { PROVIDER_GOOGLE,Marker} from 'react-native-maps'; 
import {Presence} from 'phoenix'
import * as Animatable from 'react-native-animatable';
import MapStyle from "../../../global_functions/mapStyle/MapStyle"
import Realm from "realm";

class LiveLocation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            borderColor:true,
            loadData:false,
            staffName:null,
            staffId:null
        }
    }

    componentDidMount(){
        this.getDeliveryData()
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

        const deliveryData = realm.objects("delivery");
        let id = JSON.stringify(this.props.ordedr_id)
        let data = deliveryData.filtered(`order_id == ${id}`);
        if(data.length !== 0){
            this.getStaffData(data[0].staff_id)
        }
    }

    getStaffData =async(staff_id)=>{
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
           this.setState({staff_id:staff_id,staffName:data[0].name})
        }
    }

    render(){
        const {borderColor,loadData} = this.state
        const {loadMap,region} = this.props
        return(
            <View style={style.container}>
                {
                    loadMap?
                    <MapView
                        provider={PROVIDER_GOOGLE} 
                        style={style.container}
                        region={region}
                        ref={(map) => { this.map = map; }}
                        zoomEnabled={true}  
                        zoomControlEnabled={true}  
                        showsMyLocationButton={false}
                        scrollEnabled={true}
                        customMapStyle={MapStyle}
                    >
                            <View >
                                <Marker
                                    coordinate={{latitude:region.latitude,
                                                longitude:region.longitude}}
                                    title={this.state.staffName}
                                > 
                                    <View style={[style.markerView,{borderColor:borderColor?color.white:color.borderColor}]}>
                                        <Animatable.Text animation="pulse" iterationCount={"infinite"} direction={"alternate"} style={style.marker}>👨</Animatable.Text>
                                    </View>
                                </Marker>    
                            </View>
                    </MapView>
                    :
                    <View style={style.offLineView}>
                        <Text style={style.offlineText}>👨 {this.state.staffName} Is Offline</Text>
                    </View>
                }
              
            </View>
        )
    }
}

export default LiveLocation