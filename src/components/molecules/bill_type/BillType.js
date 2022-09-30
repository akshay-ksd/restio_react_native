import React from "react";
import {View,Text,FlatList} from "react-native";
import font from "../../../theme/font";
import color from "../../../theme/colors";
import style from "./Style";
import Button from "../../atom/Button";
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from '@brooons/react-native-bluetooth-escpos-printer';
import { toast } from "../../../global_functions/toast_message/Toast";

const BillType =(props)=>{
    const [loadData,setLoadData] = React.useState(false)
    const [btDevices,setbtDevices] = React.useState([])
    React.useEffect(()=>{
        setbtDevices(props.btDevices)
        setTimeout(()=>{setLoadData(true)},500)
    },[])

    const connect=async(address)=>{
       props.setConnectedDevice(address)
    }

    const renderItem = ({ item,index }) => (
            <Button 
                buttonStyle = {style.btDevicesView}
                onPress = {()=>connect(item.address)}
                disabled = {false}
                textStyle = {style.textStyle}
                text = {item.name}
                iconShow = {true}
                gradient = {false}
                iconName = {"bluetooth"}
                iconSize = {font.size.font16}
                iconColor = {color.darkGray}
            />           
      
    );
    return(
        <View style={style.container}>
            {
                loadData == true ?
                <>
                    {/* <Button 
                        buttonStyle = {style.pdfButton}
                        onPress = {()=>bill()}
                        disabled = {false}
                        textStyle = {style.pdfText}
                        text = {"Send PDF"}
                        iconShow = {true}
                        iconName = {"document"}
                        iconSize = {font.size.font16}
                        iconColor = {color.primary}
                        style = {props.iconStyle}
                    />

                    <Button 
                        buttonStyle = {style.pdfButton}
                        onPress = {()=>bill()}
                        disabled = {false}
                        textStyle = {style.pdfText}
                        text = {"Print Bill"}
                        iconShow = {true}
                        iconName = {"receipt"}
                        iconSize = {font.size.font16}
                        iconColor = {color.primary}
                        style = {props.iconStyle}
                    /> */}
                    <View style={style.header}>
                        <Text style={style.headerText}>Connect With Printer</Text>
                        <Text style={style.subText}>(Tap to connect)</Text>
                    </View>
                     <FlatList
                        data={btDevices}
                        renderItem={renderItem}
                        keyExtractor={item => item.address}
                    />
                </>
                :null
            }
            
        </View>
    )
}

export default BillType;