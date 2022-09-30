import React from "react";
import {View,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Header from "../../molecules/custom_heder/Heder"
import PaymentDetails from "../../molecules/payment/PaymentDetails"
import CurrentPlan from "../../molecules/crrent_plan/CurrentPlan";
import Plans from "../../organisms/plans/Plans";
import NoInternet from "../no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";

const ManagePlan =(props)=>{
    const [loadData,setLoadData] = React.useState(false)
    const [isConnected,setisConnected] = React.useState(false)
    React.useEffect(()=>{
        setTimeout(()=>{setLoadData(true)})
        checkNetInfo()
    },[])

    const checkNetInfo =()=>{
        const unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                setisConnected(true)
            }else{
                setisConnected(false)
            }
          });
    }
    return(
        <View style={style.container}>
            {
                loadData == true ?
                <>
                {
                    isConnected?
                    <>
                        <Header headerName = {"Manage Plan"}/>
                        <View style={style.patmentDetailsView}>
                            <PaymentDetails/>
                        </View>

                        <View style={style.allPlansView}>
                            <Text style={style.plansText}>Other Plans</Text>
                        </View>
                        
                        <View style={style.otherPlan}>
                            <Plans/>
                        </View>
                    </>
                    :<NoInternet/>
                 }
                </>
                :null
            }
        </View>
    )
}

export default ManagePlan