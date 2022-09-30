import React from "react";
import {View,Text,Dimensions,Alert, TouchableOpacity,DeviceEventEmitter,ScrollView} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";
import Button from "../../atom/Button";
import RBSheet from "react-native-raw-bottom-sheet";
import PaymentType from "../../molecules/payment_type/PaymentType";
import BillType from "../../molecules/bill_type/BillType";
import { useNavigation } from '@react-navigation/native';
import DeliveryStatus from "../../molecules/delivery_status_button/DeliveryStatus";
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from '@brooons/react-native-bluetooth-escpos-printer';
import { toast } from "../../../global_functions/toast_message/Toast";
import TimeAgo from "react-native-timeago";



import moment from "moment";

const {width,height} = Dimensions.get("window");
const AdminProductList =(props)=>{
    const navigation = useNavigation()
    const refRBSheet = React.useRef();
    const [type,setType] = React.useState("PAY")
    const [c_devise,setCdevice] = React.useState("")
    const [printMode,setPrintMode] = React.useState(false)
    const [showMore,setShowmore] = React.useState(global.access == "ORDER"?true:false)

    const pay =()=>{
        setType("PAY")
        refRBSheet.current.open()
    }

    const cancelAlert =()=>{
        Alert.alert(
            "Cancel",
            "Are you sure ...",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel"
              },
              { text: "OK", onPress: () => paymentType(4) }
            ]
          );
    }

    const bill =async(isPrinterConnected)=>{
        if(isPrinterConnected == true){
            setPrintMode(true)
            setTimeout(()=>{setPrintMode(false)},5000)
        }else{
            toast("Printer not connected")
        }
    }

    const paymentType =(type)=>{
        props.paymentConform(type,props.order_id)
        if(type !== 4){
            refRBSheet.current.close()
        }
    }

    const sendDelivery =()=>{
        let oredrData = {
            order_id:props.ordedr_id,
            name:"name",
            address:"address",
            number:"number",
            gst:props.gst,
            charge:props.charge
        }

        navigation.navigate("StaffList",{oredrData:oredrData,from:"delivery"})
    }

    const sendKitchen =()=>{
        navigation.navigate("Kitchen",{ordedr_id:props.ordedr_id,table_no:props.tableNumber})
    }

    const goEditOrderScreen =()=>{
        props.hideOrderDetails()
        let is_applied = props.gst == 0 & props.charge == 0 ? true : false
        let data = {
            product:props.product,
            charge:props.charge
        }
        navigation.navigate("EditOrder",{data:data})
    }

    const print =async(isPrinterConnected,count)=>{
        const time = moment().format('MMMM Do YYYY, h:mm:ss a')
        if(isPrinterConnected == true){
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printerLineSpace(4)
            await BluetoothEscposPrinter.printText(props.print_data[0].name+"\n\r",{
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 1,
                heigthtimes: 1,
                fonttype: 1,
            });
            await BluetoothEscposPrinter.printText(props.print_data[0].address+"\n\r",{
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0.5,
                heigthtimes: 0.5,
                fonttype: 1,
            });
            await BluetoothEscposPrinter.printText(`Ph: ${props.print_data[0].phone}\n\r`,{
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0.5,
                heigthtimes: 0.5,
                fonttype: 1,
            });
            await BluetoothEscposPrinter.printText("...........................\n\r",{});
            await BluetoothEscposPrinter.printColumn([40],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [time],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1});
            await BluetoothEscposPrinter.printText("...........................\n\r",{});
            await BluetoothEscposPrinter.printColumn([40],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [JSON.stringify(props.id)],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1});
            await BluetoothEscposPrinter.printColumn([40],
                [BluetoothEscposPrinter.ALIGN.LEFT],
                [`Table No:${props.tableNumber.toString()}`],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1});
            await BluetoothEscposPrinter.printColumn([40],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ["INVOICE"],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1});
            await BluetoothEscposPrinter.printText("...........................\n\r",{});
            await BluetoothEscposPrinter.printColumn([19,8,8,8],
                [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.RIGHT],
                ["ITEM",'QTY','PRS','AMT'],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0.8,
                heigthtimes: 0.9,
                fonttype: 1});
            for(let i = 0; i < props.product.length; i ++){
                await BluetoothEscposPrinter.printColumn([19,8,8,8],
                    [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.RIGHT],
                    [props.product[i].name.toString(),props.product[i].quantity.toString(),props.product[i].price.toString(),props.product[i].total.toString()],{encoding: 'GBK',
                    codepage: 0,
                    widthtimes: 0.5,
                    heigthtimes: 0.5,
                    fonttype: 1});
                await BluetoothEscposPrinter.printerLineSpace(4)
                if(i == props.product.length-1){
                    await BluetoothEscposPrinter.printText("***************************\n\r",{});
                    await BluetoothEscposPrinter.printColumn([19,8,8,8],
                        [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["","",'CGST :',props.gst],{encoding: 'GBK',
                        codepage: 0,
                        widthtimes: 0,
                        heigthtimes: 0,
                        fonttype: 1});
                    await BluetoothEscposPrinter.printColumn([19,8,8,8],
                        [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["","",'SGST :',props.sgst],{encoding: 'GBK',
                        codepage: 0,
                        widthtimes: 0,
                        heigthtimes: 0,
                        fonttype: 1});
                    await BluetoothEscposPrinter.printColumn([15,8,10,10],
                        [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["","",'Charges :',props.charge],{encoding: 'GBK',
                        codepage: 0,
                        widthtimes: 0,
                        heigthtimes: 0,
                        fonttype: 1});
                    await BluetoothEscposPrinter.printColumn([15,8,10,10],
                        [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["","",'Total :',props.gTotal],{encoding: 'GBK',
                        codepage: 0,
                        widthtimes: 0,
                        heigthtimes: 1,
                        fonttype: 3});
                    await BluetoothEscposPrinter.printText("..........RESTIO...........\n\r",{encoding: 'GBK',
                    codepage: 0,
                    widthtimes: 0.2,
                    heigthtimes: 0,
                    fonttype: 1});
                    await BluetoothEscposPrinter.printText("_\n\r",{});
                    await BluetoothEscposPrinter.printText("\n\r",{});
                    if(count == 1){
                        print(isPrinterConnected,2)
                    }
                }
            }
        }else{
            toast("Printer not connected")
        }
    }

    const kot =async(isPrinterConnected)=>{
        if(isPrinterConnected == true){
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            {
                global.access == "ORDER"?
                await BluetoothEscposPrinter.printText(props.kitchenName+"\n\r",{
                    encoding: 'GBK',
                    codepage: 0,
                    widthtimes: 1,
                    heigthtimes: 1,
                    fonttype: 1,
                }):
                await BluetoothEscposPrinter.printText(props.print_data[0].name+"\n\r",{
                    encoding: 'GBK',
                    codepage: 0,
                    widthtimes: 1,
                    heigthtimes: 1,
                    fonttype: 1,
                });
            }
           
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
                [props.time.toString()],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1});
            await BluetoothEscposPrinter.printColumn([30,10],
                [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.RIGHT],
                [props.id.toString(),"KOT"],{encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1});
            await BluetoothEscposPrinter.printColumn([40],
                [BluetoothEscposPrinter.ALIGN.LEFT],
                [`Table No:${props.tableNumber.toString()}`],{encoding: 'GBK',
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
                    await BluetoothEscposPrinter.printText("...........................\n\r",{});
                    await BluetoothEscposPrinter.printText(".                         .\n\r",{});
                    await BluetoothEscposPrinter.printText(".                         .\n\r",{});
                    await BluetoothEscposPrinter.printText(".                         .\n\r",{});
                    await BluetoothEscposPrinter.printText(".                         .\n\r",{});
                    await BluetoothEscposPrinter.printText(".                         .\n\r",{});
                    await BluetoothEscposPrinter.printText("\n\r",{});
                    await BluetoothEscposPrinter.printText("\n\r",{});
                }
            }
        }else{
            toast("Printer not connected")
        }
    }

    const seeMoredata =()=>{
        setShowmore(!showMore)
    } 
    
    return(
        <View style={style.container}>
           
            <View style={style.headingView}>
                <View style={style.itemTextView}>
                    <Text style={style.itemText}>Item</Text>
                </View>
                <View style={style.quantytyView}>
                    <Text style={style.itemText}>Qnty</Text>
                </View>
                <View style={[style.quantytyView,{marginLeft:font.headerHeight}]}>
                    <Text style={style.itemText}>Total</Text>
                </View>
                <TouchableOpacity style={[style.showMore,{marginLeft:font.headerHeight/2}]} onPress={()=>seeMoredata()}>
                    <Text style={style.showText}>{showMore ? "Hide Products":"See Product"}</Text>
                    <Icons iconName={showMore ?"chevron-up-outline": "chevron-down-outline"} 
                            iconSize={font.size.font16} 
                            iconColor={color.white}
                            iconStyle = {style.iconStyle}/>
                </TouchableOpacity>
            </View>
            {
                showMore ?
                <>
                {props.product.map((data) => (
                    <View style={style.productView} 
                          key = {data.product_id}>
    
                        <View style={style.productDetailsView}>
                            <Text style={style.productNameText}>{data.name}</Text>
                            <View style={style.iconPriceView}>
                                <Icons  iconName = {"radio-button-on-outline"}
                                        iconSize = {font.size.font14}
                                        iconColor = {data.is_veg == true ? color.green : color.primary}
                                        iconStyle = {style.iconstyle}/>
                                <Text style={[style.productNameText,{marginLeft:10}]}>₹ {data.price}</Text>
                            </View>
                        </View>
    
                        <View style={style.countView}>
                            <Text style={style.countText}>{data.quantity}</Text>
                        </View>
    
                        <View style={style.totalView}>
                            <Text style={style.totalText}>₹ {data.total}</Text>
                        </View>
                    </View>
                ))}
                </>
                :null
            }
           
               
            {
              global.access == "ALL" || global.access == "MENU"?
                <View style={style.gTotalView}>
                    <View style={style.totalViews}>
                        {/* {
                            props.extendedState.ordedr_id !== props.ordedr_id?
                                <DeliveryStatus sendDelivery={()=>sendDelivery()}
                                                ordedr_id={props.ordedr_id}
                                                status = {props.status}
                                                deliveryChannel = {props.deliveryChannel}
                                                from = {"Admin"}/>
                            :null
                        } */}
                     {/* <DeliveryStatus sendDelivery={()=>sendDelivery()}
                                                ordedr_id={props.ordedr_id}
                                                status = {props.status}
                                                deliveryChannel = {props.deliveryChannel}
                                                from = {"Admin"}/> */}
                        {/* <Button 
                            buttonStyle = {style.deliveryButton}
                            onPress = {()=>sendKitchen()}
                            disabled = {false}
                            textStyle = {style.deliveryText}
                            text = {"Chef 👨‍🍳"}
                            gradient = {true}
                            color1 = {color.white}
                            color3 = {color.white}
                            color2 = {color.white}
                        /> */}
                    </View>
                    <View style={style.totalViews}>
                        <View style={style.totalCuntent}>
                            <View style={style.totalSubCuntent}>
                                <Text style={style.gstText}>CGST</Text>
                            </View>
                            <View style={style.totalSubCuntent1}>
                                <Text style={style.gstText}>: ₹ {props.gst}</Text>
                            </View>
                        </View>
                        <View style={style.totalCuntent}>
                            <View style={style.totalSubCuntent}>
                                <Text style={style.gstText}>SGST</Text>
                            </View>
                            <View style={style.totalSubCuntent1}>
                                <Text style={style.gstText}>: ₹ {props.sgst}</Text>
                            </View>
                        </View>
                        <View style={style.totalCuntent}>
                            <View style={style.totalSubCuntent}>
                                <Text style={style.gstText}>Packing Charge</Text>
                            </View>
                            <View style={style.totalSubCuntent1}>
                                <Text style={style.gstText}>: ₹ {props.charge}</Text>
                            </View>
                        </View>

                        <View style={style.totalCuntent}>
                            <View style={style.totalSubCuntent}>
                                <Text style={style.Totaltext}>Total</Text>
                            </View>
                            <View style={style.totalSubCuntent1}>
                                <Text style={style.Totaltext}>: ₹ {props.gTotal}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                :null
            }
            {
                global.access == "ALL"?
                <View style={style.bottomButton}>
                            {
                                printMode == false?
                                <Button 
                                    buttonStyle = {style.cancelButton}
                                    onPress = {()=>cancelAlert()}
                                    disabled = {false}
                                    textStyle = {[style.billText,{color:color.secondary}]}
                                    text = {"Cancel"}
                                    iconShow = {false}
                                    iconName = {"trash"}
                                    iconSize = {font.size.font16}
                                    iconColor = {color.red}
                                    style = {props.iconStyle}
                                />
                                :
                                <Button 
                                    buttonStyle = {style.cancelButton}
                                    onPress = {()=>kot(props.isPrinterConnected)}
                                    disabled = {false}
                                    textStyle = {[style.billText,{color:color.tertiary}]}
                                    text = {"Kot"}
                                    iconShow = {true}
                                    iconName = {"receipt"}
                                    iconSize = {font.size.font16}
                                    iconColor = {color.tertiary}
                                    style = {props.iconStyle}
                                />
                            }

                            {
                               printMode == false ?
                               <Button 
                                    buttonStyle = {style.billButton}
                                    onPress = {()=>bill(props.isPrinterConnected)}
                                    disabled = {false}
                                    textStyle = {[style.billText,{color:color.secondary}]}
                                    text = {"Print"}
                                    iconShow = {true}
                                    iconName = {"receipt"}
                                    iconSize = {font.size.font16}
                                    iconColor = {color.secondary}
                                    style = {props.iconStyle}
                               />
                               :
                               <Button 
                                    buttonStyle = {style.billButton}
                                    onPress = {()=>print(props.isPrinterConnected,1)}
                                    disabled = {false}
                                    textStyle = {[style.billText,{color:color.tertiary}]}
                                    text = {"Invoice"}
                                    iconShow = {true}
                                    iconName = {"receipt"}
                                    iconSize = {font.size.font16}
                                    iconColor = {color.tertiary}
                                    style = {props.iconStyle}
                               />
                            }
                           

                            <Button 
                                buttonStyle = {style.payButton}
                                onPress = {()=>pay()}
                                disabled = {false}
                                textStyle = {style.billText}
                                text = {"Charge"}
                                iconShow = {true}
                                iconName = {"cash"}
                                iconSize = {font.size.font16}
                                iconColor = {color.white}
                                style = {props.iconStyle}
                                />
                </View>
                :
                null
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
                    {
                        type == "PAY"?
                        <PaymentType paymentType = {paymentType}/>
                        :<BillType btDevices={props.btDevices}
                                   setConnectedDevice={()=>checkConnectedDevices()}/>
                    }
                        
                </>
                </RBSheet>
                <View style={style.tableView}>
                    <Text style={style.tableTextse}>Table Number : <Text style={style.tableText}>{props.tableNumber}</Text></Text>
                    <View style={style.userView}>
                        <Text style={style.tableTextse}>Order From : 
                            <Text style={[style.tableText,{color:props.user_id == "CO"?color.secondary:color.tertiary}]}>{props.user_id == "CO" ? " CUSTOMER":"STAFF"}</Text>
                        </Text>
                        {
                           props.status == 0 ?
                            <TouchableOpacity style={style.confirmButton} onPress={()=>paymentType(5)}>
                                <Text style={style.confirmText}>Confirm</Text>
                            </TouchableOpacity>
                            :
                            <Text style={[style.confirmText,{color:color.green,marginTop:5}]}>Confirmed</Text>
                        }
                        
                    </View>
                </View>
                <View style={style.timeView}>
                <Text style={style.timeText}>Order Id : {props.id}</Text>
                <Text style={style.timeText}>{props.time}</Text>
                {
                    global.access == "ALL" || global.access == "MENU"?
                    <>
                        <TouchableOpacity style={[style.quantytyView,{marginLeft:35}]}
                                          onPress={()=>goEditOrderScreen()}>
                            <Icons  iconName = {"create"}
                                    iconSize = {font.size.font18}
                                    iconColor = {color.tertiary}
                                    iconStyle = {style.iconstyle}/>
                            <Text style={style.editText}>Edit Order</Text>
                        </TouchableOpacity>
                    </>
                    :null
                }
              
                </View>
               
        </View>
    )
}

export default AdminProductList;