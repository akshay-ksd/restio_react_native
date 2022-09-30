import React from "react";
import {View,Text,TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";
import Button from "../../atom/Button";
const PaymentType =(props)=>{
    const [type,setType] = React.useState(1)
    const [loadData,setLoadData] = React.useState(false)
    React.useEffect(()=>{
        setTimeout(()=>{setLoadData(true)},500)
    },[])
    const changeType =(type)=>{
        setType(type)
    }

    const conform =()=>{
        props.paymentType(type)
    }
    return(
        <View style={style.container}> 
            {
               loadData == true ? 
            <>
            <Text style={style.heading}>Select Payment Type</Text>
            <TouchableOpacity style={style.paymentTypeSelectView}
                              onPress={()=>changeType(1)}>
                <Icons  iconName = {"cash"}
                        iconSize = {font.size.font16}
                        iconColor = {color.primary}
                        iconStyle = {style.iconstyle}/>
                <Text style={style.paymentTypeText}>CASH</Text>
                {
                    type == 1 ?
                    <Icons  iconName = {"checkmark-circle"}
                        iconSize = {font.size.font16}
                        iconColor = {color.green}
                        iconStyle = {style.iconstyle}/>:<View style={style.dummy}/>
                }
                
            </TouchableOpacity>
            <TouchableOpacity style={style.paymentTypeSelectView}
                              onPress={()=>changeType(2)}>
                <Icons  iconName = {"card"}
                        iconSize = {font.size.font16}
                        iconColor = {color.primary}
                        iconStyle = {style.iconstyle}/>
                <Text style={style.paymentTypeText}>CARD</Text>
                {
                    type == 2 ?
                    <Icons  iconName = {"checkmark-circle"}
                        iconSize = {font.size.font16}
                        iconColor = {color.green}
                        iconStyle = {style.iconstyle}/>:<View style={style.dummy}/>
                }
            </TouchableOpacity>
            <TouchableOpacity style={style.paymentTypeSelectView}
                              onPress={()=>changeType(3)}>
                <Icons  iconName = {"phone-portrait"}
                        iconSize = {font.size.font16}
                        iconColor = {color.primary}
                        iconStyle = {style.iconstyle}/>
                <Text style={style.paymentTypeText}>UPI</Text>
                {
                    type == 3 ?
                    <Icons  iconName = {"checkmark-circle"}
                        iconSize = {font.size.font16}
                        iconColor = {color.green}
                        iconStyle = {style.iconstyle}/>:<View style={style.dummy}/>
                }
            </TouchableOpacity>
            <Button 
                buttonStyle = {style.conformButton}
                onPress = {()=>conform()}
                disabled = {false}
                textStyle = {style.conformText}
                text = {"Confirm"}
            />
            </>
            :null
        }
        </View>
    )
}

export default PaymentType