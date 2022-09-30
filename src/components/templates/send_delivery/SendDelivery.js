import React from "react";
import {View} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Header from "../../molecules/custom_heder/Heder"
import CustomerInput from "../../organisms/custemer_details_input/CustomerInput";
import Button from "../../atom/Button";
import NoInternet from "../no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";

class SendDelivery extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            userData:{},
            isConnected:false
        }
    }
    
    componentDidMount(){
        this.checkNetInfo()
        setTimeout(()=>{this.setState({loadData:true})},100)
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
               
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    render(){
        const {loadData,isConnected} = this.state
        const {ordedr_id,gst,charge} = this.props.route.params
        return(
            <View style={style.container}> 
                {
                    loadData == true ?
                    <>
                    {
                        isConnected?
                        <>
                            <Header headerName = {"Enter Customer Details"}/>
                        
                            <CustomerInput orderId = {ordedr_id}
                                           gst = {gst}
                                           charge = {charge}/>
                        </>
                        :<NoInternet/>
                    }
                       
                    </>
                    :null
                }
                

            </View>
        )
    }
}

export default SendDelivery;