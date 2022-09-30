import React from "react";
import {View,Text, ActivityIndicator} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Header from "../../molecules\/custom_heder/Heder"
import NetInfo from "@react-native-community/netinfo";
import NoInternet from "../no_internet_view/NoInternet";
import WebView from "react-native-webview";

const WebViews =(props)=>{
    const [loadData,setLoadData] = React.useState(false)
    const [isConnected,setisConnected] = React.useState(false)
    const [loader,setLoader] = React.useState(true)

    React.useEffect(()=>{
        setTimeout(()=>{setLoadData(true)},100)
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

    const hideSpinner =()=>{
        setLoader(false)
    }
    

    return(
        <View style={style.container}>
            {
                loadData == true ?
                <>
                {
                    isConnected?
                    <>
                        <Header headerName={props.route.params.heding}/>
                        <View style={style.webview}>
                            {
                                loader && (
                                <View style={style.loaderView}>
                                <ActivityIndicator size={font.size.font16} color={color.secondary}/>
                                </View>
                                )
                            }
                            <WebView source = {{ uri:global.url + props.route.params.from}}
                                     onLoad={() => hideSpinner()}/>
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

export default WebViews;