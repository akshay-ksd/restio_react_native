import React from "react";
import {View} from 'react-native';
import style from "./Style";
import PaymentDetails from "../../molecules/payment/PaymentDetails";
import OrderStatus from "../../molecules/orderStatus/OrderStatus";
import DayWish from "../../molecules/day_wish/DayWish";
import RestaurentName from "../../molecules/restaurent_name/RestaurentName";
class NotificationBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false
        }
    }

    render(){
        const {loadData} = this.state
        return(
            <View style={style.container}>
                {/* <OrderStatus/> */}
                        {/* {
                        global.access == "ALL" ?
                        <PaymentDetails/>
                        :<DayWish/>
                        } */}
                    <RestaurentName/>               
            </View>
        )
    }
}

export default NotificationBar