import React from "react";
import {View, Text, ActivityIndicator,Dimensions} from "react-native";
import style from "./Style";
import Icons from "../../atom/Icon";
import font from "../../../theme/font";
import color from "../../../theme/colors";
import Button from "../../atom/Button";
import TimeAgo from "react-native-timeago";
import * as Animatable from 'react-native-animatable';
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from '@brooons/react-native-bluetooth-escpos-printer';
import RBSheet from "react-native-raw-bottom-sheet";
import BillType from "../../molecules/bill_type/BillType";
import { toast } from "../../../global_functions/toast_message/Toast";
const {height} = Dimensions.get("window")
const KitchenProductList=(props)=>{
    const [c_devise,setCdevice] = React.useState("")
    const refRBSheet = React.useRef();

    const orderAccept=(status)=>{
        props.orderAccept(props.kitchenId,status)
    }

    const bill =async()=>{
       
        if(props.isPrinterConnected == true){
            kot()
        }else{
            toast("Printer not connected")
        }
    }

    const open_list =()=>{
        refRBSheet.current.open()
    }

    const kot =async()=>{
        if(props.isPrinterConnected == true){
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printText(props.kitchenName+"\n\r",{
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 1,
                heigthtimes: 1,
                fonttype: 1,
            });
            await BluetoothEscposPrinter.printText("__________________________\n\r",{});
            await BluetoothEscposPrinter.printText("KOT\n\r",{
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0.5,
                heigthtimes: 0.5,
                fonttype: 1,
            });
        
            await BluetoothEscposPrinter.printText("...........................\n\r",{});
            await BluetoothEscposPrinter.printColumn([40],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [props.time],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1});
        
            await BluetoothEscposPrinter.printText("...........................\n\r",{});
            await BluetoothEscposPrinter.printColumn([19,8],
                [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER],
                ["ITEM",'QTY'],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0.8,
                heigthtimes: 1,
                fonttype: 1});
            for(let i = 0; i < props.product.length; i ++){
                await BluetoothEscposPrinter.printColumn([19,8],
                    [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER],
                    [props.product[i].name.toString(),props.product[i].quantity.toString()],{encoding: 'GBK',
                    codepage: 0,
                    widthtimes: 0.5,
                    heigthtimes: 0.5,
                    fonttype: 1});
                if(i == props.product.length-1){
                    await BluetoothEscposPrinter.printText(".\n\r",{});
                    await BluetoothEscposPrinter.printText(props.note+"\n\r",{});
                    await BluetoothEscposPrinter.printText(".\n\r",{});
                    await BluetoothEscposPrinter.printText("...........................\n\r",{});
                    await BluetoothEscposPrinter.printText("\n\r",{});
                    await BluetoothEscposPrinter.printText("\n\r",{});
                }
            }
        }else{
            toast("Printer not connected")
        }
    }

    return(
        <View style={style.container}>
            <View style={style.header}>
                <Text style={style.id} numberOfLines={1}>Id : {props.kitchenId}</Text>
                <TimeAgo time={props.time} interval={60000} style={style.time}/>
            </View>
            {props.product.map((data) => (
                <View style={style.productView} 
                        key = {data.id}>
                    <View style={style.productDetailsView}>
                        <Text style={style.productNameText}>{data.name}</Text>
                    </View>

                    <View style={style.countView}>
                        <Text style={style.countText}>{data.quantity}</Text>
                    </View>
                </View>
            ))}
            {
                props.note.length !== 0 ?
                <View style={style.noteView}>
                    <Text style={style.note}>{props.note}</Text>
                </View>:null
            }
          
           
            <View style={style.buttonView}>
                {
                    props.extendedState.updateKitchenId == props.kitchenId?
                    <View style={style.loader}>
                        <ActivityIndicator size={font.size.font16} color={color.white}/>
                    </View>:null
                }
                {
                    props.status == "Pending"?
                    <Button 
                        buttonStyle = {style.button}
                        onPress = {()=>orderAccept("Accept")}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle}
                        text = {props.extendedState.updateKitchenId == props.kitchenId?"":"Accept"}
                        gradient = {true}
                        color1 = {color.tertiary}
                        color2 = {color.tertiary}
                        color3 = {color.tertiary}
                    />
                    :props.status == "Accept"?
                    <Button 
                        buttonStyle = {style.button1}
                        onPress = {()=>orderAccept("itemReady")}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle}
                        text = {props.extendedState.updateKitchenId == props.kitchenId?"":"Item Ready 👍"}
                        gradient = {true}
                        color1 = {color.primary}
                        color2 = {color.primary}
                        color3 = {color.primary}
                    />
                    :
                    <View style={style.taskComplete}>
                         <Animatable.Text animation="pulse" iterationCount={"infinite"} direction={"alternate"} style={style.completeText}>Task Completed 😎</Animatable.Text>
                    </View>
                }
                 <Button 
                        buttonStyle = {style.pbutton}
                        onPress = {()=>bill()}
                        disabled = {false}
                        textStyle = {style.pText}
                        text = {"Print"}
                        gradient = {false}
                        iconShow = {true}
                        iconName = {"receipt"}
                        iconSize = {font.size.font20}
                        iconColor = {color.white}
                    />              
            </View>
            {
                props.isPrinterConnected == false?
                    <View style={style.connectedDevice}>
                        <Text style={style.connectDeviceText}>Printer not connected</Text>
                    </View>
                :null
            }
                <RBSheet
                        ref={refRBSheet}
                        height={height/2}
                        openDuration={250}
                        customStyles={{
                            container: {
                                justifyContent: "center",
                                alignItems: "center"
                            }
                        }}
                >
                <>
                <BillType btDevices={props.btDevices}
                          setConnectedDevice={()=>checkConnectedDevices()}/>
                        
                </>
                </RBSheet>
        </View>
    )
}

export default KitchenProductList;