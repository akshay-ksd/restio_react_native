import React from "react";
import {View,Text, Linking} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";
import Button from "../../atom/Button";
import * as Animatable from 'react-native-animatable';

const DeliveryProductList =(props)=>{
    const [address,setAddress] = React.useState("false")
    const [number,setNumber] = React.useState("")

    const changeStatus =(status)=>{
        props.changeStatus(props,status)
    }

    React.useEffect(()=>{
        var num = props.c_address.match(/\d+/g);
        var letr = props.c_address.match(/[a-zA-Z]+/g);
        var regexp = /^([0|+[0-9]{1,5})?([6-9][0-9]{9})$/


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
    },[])

    const call=()=>{
        Linking.openURL(`tel:${number}`)
    }

    return(
        <Animatable.View style={style.container}>
            <View style={style.headingView}>
                <View style={style.itemTextView}>
                    <Text style={style.itemText}>Item</Text>
                </View>
                <View style={style.quantytyView}>
                    <Text style={style.itemText}>Qnty</Text>
                </View>
                <View style={style.quantytyView}>
                    <Text style={style.itemText}>Total</Text>
                </View>
            </View>
            {props.product.map((data) => (
                <View style={style.productView} 
                      key = {data.product_id}>
                    {/* <View style={style.vegIconView}>
                        <Icons  iconName = {"radio-button-on-outline"}
                                iconSize = {font.size.font18}
                                iconColor = {data.is_veg == 1 ? color.green : color.primary}
                                iconStyle = {style.iconstyle}/>
                    </View> */}

                    <View style={style.productDetailsView}>
                        <Text style={style.productNameText}>{data.name}</Text>
                        {/* <Text style={style.productDetailsText}>{data.description}</Text> */}
                        <View style={style.iconTextView}>
                            <Icons  iconName = {"radio-button-on-outline"}
                                    iconSize = {font.size.font14}
                                    iconColor = {data.is_veg == 1 ? color.green : color.primary}
                                    iconStyle = {style.iconstyle}/>
                            <Text style={style.productNameText}>   ₹ {data.price}</Text>
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

            <View style={style.gTotalView}>
                <View style={style.totalViews}>
                    <View style={style.totalCuntent}>
                        <View style={style.totalSubCuntent}>
                            <Text style={style.gstText}>Gst</Text>
                        </View>
                        <View style={style.totalSubCuntent1}>
                            <Text style={style.gstText}>              : ₹ {props.gst}</Text>
                        </View>
                    </View>
                    <View style={style.totalCuntent}>
                        <View style={style.totalSubCuntent}>
                            <Text style={style.gstText}>Packing Charge</Text>
                        </View>
                        <View style={style.totalSubCuntent1}>
                            <Text style={style.gstText}>               : ₹ {props.charge}</Text>
                        </View>
                    </View>

                    <View style={style.totalCuntent}>
                        <View style={style.totalSubCuntent}>
                            <Text style={style.Totaltext}>Total</Text>
                        </View>
                        <View style={style.totalSubCuntent1}>
                            <Text style={style.Totaltext}>            : ₹ {props.gTotal}</Text>
                        </View>
                    </View>
                </View>
            </View>
 
            <View style={style.addresscontainer}>
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
            {/* {
                props.loading == true?
                <View style={style.loader}>
                    <ActivityIndicator size={font.size.font20} color = {color.secondary}/>
                </View>
                :null
            } */}
            <Animatable.View animation="pulse" iterationCount={props.status == "Pending"?"infinite":1} direction={"alternate"} style={style.buttonView}>
            {
                props.status == "Pending" ?
                    <Button 
                        buttonStyle = {[style.button,{backgroundColor:color.secondary}]}
                        onPress = {()=>changeStatus("Accept")}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle}
                        text = {"Accept 👍"}
                        iconShow = {props.loading}
                        iconName = {"receipt"}
                        iconSize = {font.size.font20}
                        iconColor = {color.white}
                        style = {style.iconStyle}
                    />
                :props.status == "Accept"?
                    <Button 
                        buttonStyle = {[style.button,{backgroundColor:color.tertiary}]}
                        onPress = {()=>changeStatus("Deliverd")}
                        disabled = {false}
                        textStyle = {style.buttonTextStyle}
                        text = {"Deliverd 📦"}
                        iconShow = {props.loading}
                        iconName = {"reload"}
                        iconSize = {font.size.font18}
                        iconColor = {color.white}
                        style = {style.iconStyle}
                    />
                :
                <View style={style.completedView}>
                        <Animatable.Text animation="pulse" iterationCount={"infinite"} direction={"alternate"} style={style.completedText}>Task Completed 😎</Animatable.Text>
                </View>
            }              
            </Animatable.View>
        </Animatable.View>
    )
}

export default DeliveryProductList;