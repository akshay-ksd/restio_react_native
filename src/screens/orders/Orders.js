import React from "react";
import {View} from "react-native";
import style from "./Style";
import Kitchen from '../../components/templates/kitchen/Kitchen';
import Delivery from "../../components/templates/delivery/Delivery";
import Admin from "../../components/templates/admin/Admin";
import OrderScreen from "../../components/templates/order/OrderScreen"
class Orders extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false
        }
    }

    componentDidMount=()=>{
        setTimeout(()=>{this.setState({loadData:true})},100)
    }

    render(){
        return(
            <View style={style.container}>
                {
                    this.state.loadData == true ?
                    <>
                        {
                            global.access == "ALL" || global.access == "MENU" || global.access == "ORDER"?
                            <OrderScreen/>:null
                        }

                        {
                            global.access == "KITCHEN" ?
                            <Kitchen/>:null
                        }

                        {
                            global.access == "DELIVERY" ?
                            <Delivery/>:null
                        }
                    </>
                    :null
                }
                
            </View>
        )
    }

}

export default Orders