import React, { useState,useEffect } from "react";
import { View,Text,ActivityIndicator} from "react-native";
import { useIsFocused,useFocusEffect,useNavigation } from '@react-navigation/native';
import style from "./Style";
import font from "../../../theme/font";
import color from "../../../theme/colors";
import moment from "moment";
const PaymentDetails =(props)=> {
    const [status,setStatus] = React.useState("")
    const [plan,setPlan] = React.useState("")
    const [loadData,setLoadData] = React.useState(false)
    useFocusEffect(
        React.useCallback(() => {
            socketConnect()
        }, [])
    );

    const socketConnect=()=>{
        let data = {
            restaurentId:global.rtoken,
            active_token:global.active_token,
            utoken:global.utoken
        }

        const phxChannel = global.socket.channel('plan:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            phxChannel.push("currentPlan", { data: data})
        })

        phxChannel.on('currentPlan',data => {
            setTimeout(()=>{setLoadData(true)},10)
            if(data.data.length == 0){
                setStatus(false)
            }else{
                setStatus(true)
                setPlan(data.data[0])
            }
        })
    }

    return (
     <>
        {
            loadData ?
            status == true?
            <View style={style.container}>
                <Text style={style.currentPlanText}>* Current Plan</Text>
                <View style={style.currentPlanView}>
                    <Text style={style.currPlane}>{"₹"+plan.price+" / "+plan.name}</Text>
                </View>
                <View style={style.planDetailsView}>
                    <View style={style.subView}>
                        <Text style={style.validText}>* Valid</Text>
                        <Text style={style.date}> {plan.valid}</Text>
                    </View>
                    <View style={style.subView}>
                        <Text style={style.validText}>* Expiring</Text>
                        <Text style={style.date}>  {new moment().to(moment(plan.expaired))}</Text>
                    </View>
                </View>
            </View>:
            <View style={style.notRechargeView}>
                <Text style={style.noRechargeText}>Select Plan And Recharge</Text>
            </View>
            :
            <View style={style.loader}>
                <ActivityIndicator size={font.size.font16} color={color.primary}/>
            </View>
        }        
     </>
    );
    }

export default PaymentDetails;