import React from "react";
import {View,Text} from 'react-native';
import style from "./Style";

class OrderStatus extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={style.container}>
                <Text style={style.text}>Akshay deliverd the order</Text>
                <Text style={style.subText}>See order details in Orders Screen</Text>
            </View>
        )
    }
}

export default OrderStatus;