import React from "react";
import {View,Text,Linking} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Realm from "realm";
import Button from "../../atom/Button"

const Address =(props)=>{
    const [name,setName] = React.useState("")
    const [address,setAddress] = React.useState("false")
    const [number,setNumber] = React.useState("")

    React.useEffect(()=>{
       getAddress()
    },[])

    const getAddress =async()=>{
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
        const deliveryffData = realm.objects("delivery");
        let id = JSON.stringify(props.ordedr_id)
        let data = deliveryffData.filtered(`order_id == ${id}`);

        var num = data[0].address.match(/\d+/g);
        var letr = data[0].address.match(/[a-zA-Z]+/g);
        var regexp = /^([0|+[0-9]{1,5})?([6-9][0-9]{9})$/

        setName(data[0].name)
        if(letr !== null){
            let details = letr.toString()
            setAddress(details)
        }    

        if(num !== null){
            for(let i = 0;i < num.length; i ++){
                let isValid = regexp.test(num[i])
                if(isValid == true){
                    setNumber(num[i])
                }
            }    
        }           
    }

    const call=()=>{
        Linking.openURL(`tel:${number}`)
    }

    return(
        <View style={style.container}>
            <View style={style.headerView}>
                <Text style={style.header}>Customer Details</Text>
            </View>
            {
                address !== "false"?
                    <View>
                        <Text style={style.subHead}>Details</Text>
                        <Text style={style.name}>{address}</Text>
                    </View>
                :null
            }
            
            {
                number.length !== 0?
                <View>
                    <Text style={style.subHead}>Phone Number</Text>
                    <View style={style.numberView}>
                        <Text style={style.number}>{number}</Text>
                        <Button 
                            buttonStyle = {style.editButton}
                            onPress = {()=>call()}
                            disabled = {false}
                            text = {0}
                            iconShow = {true}
                            iconName = {"call"}
                            iconSize = {font.size.font18}
                            iconColor = {color.tertiary}
                        />
                    </View>
                </View>
                :null
            }
        </View>
    )
}

export default Address