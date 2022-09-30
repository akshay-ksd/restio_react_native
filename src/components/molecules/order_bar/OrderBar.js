import React from "react";
import {View,Text,ActivityIndicator,Switch} from "react-native";
import style from "./Style";
import Button from "../../atom/Button";
import {useNavigation} from "@react-navigation/native"
import font from "../../../theme/font";
import color from "../../../theme/colors";

const OrderBar =(props)=>{
    const navigation = useNavigation()
    const [isEnabled, setIsEnabled] = React.useState(false);

    const goOrderScreen =()=>{
        props.placeOrder(isEnabled)
        // navigation.navigate("Orders")
    }

    const toggleSwitch = () =>{
        setIsEnabled(previousState => !previousState)
        props.toggle(isEnabled)
    }

    
        return(
            <View style={style.container}>
                <View style={style.itemView}>
                    <Text style={style.text}>{props.cartLength} Item</Text>
                </View>

                <View style={style.itemView}>
                    <Text style={style.text}>Total {props.cartTotal}</Text>
                </View>
                {
                    props.orderplaceLoader == true?
                    <View style={style.orderplaceLoader}>
                        <ActivityIndicator size={font.size.font20} color={color.primary}/>
                    </View>
                    :null
                }
                <View style={style.toggleView}>
                   <Switch
                        trackColor={{ false: "#767577", true: color.tertiary }}
                        thumbColor={isEnabled ? color.tertiary : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={style.charge}>{isEnabled == true?"Charges Applied":"Apply Charges"}</Text>
                </View>
                 
                <Button buttonStyle = {style.button}
                        onPress = {()=>goOrderScreen()}
                        disabled = {false}
                        textStyle = {style.buttonText}
                        text = {props.from == "edit"? "UPDATE ORDER":"PLACE ORDER"}
                        iconShow = {false}
                />
            </View>
        )
    }
export default OrderBar