import React from "react";
import {View,Text, FlatList, TouchableOpacity, ActivityIndicator,Dimensions} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import PlanBox from "../../molecules/plan_box/PlanBox";
import RBSheet from "react-native-raw-bottom-sheet"

const axios = require("axios")

const {width,height} = Dimensions.get('window')
const Plans=(props)=>{
    const [channel,setchannel] = React.useState("")
    const [planList,setPlanList] = React.useState([])
    const [loader,setLoader] = React.useState(true)
    const [selectedData,setSelectedData] = React.useState([])
    const refRBSheet = React.useRef()

    React.useEffect(()=>{
        getPlanDetails()
    },[])

    const socketConnect=()=>{
        // const phxChannel = global.socket.channel('plan:' + "ql85q114aaldkd853kdkkm38zxm444354354354545454")

        // phxChannel.join().receive('ok',response => {
        //     setchannel(phxChannel)
        // })

        // phxChannel.on('addRest',data => {
        //     this.setState({loader:false,name:"",phone:"",address:""})
        //     this.storeLocalDataBase(data.data)
        // })
    }

    const buttonPress=()=>{
        // let data = {
        //     days:365,
        //     name:"1 Year",
        //     plan_id:"j89d9smlv48vmklopwowclsopopw5xz",
        //     price:8999
        // }

        // channel.push('addPlan', { data: data})
    }

const getPlanDetails=()=>{
    axios({
        url: global.url+"graphiql",
        method: 'post',
        data: {
            query: `
                query{
                    allPlans{
                            planId
                            name
                            days
                            price
                    }
                }
            `
        }
        }).then((result) => {
            let data = result.data.data
            if(typeof data !== 'undefined'){
                setPlanList(data.allPlans)
                setLoader(false)
            }
        });
}

const openSheet=(plan,price,planId,days)=>{
    // setTimeout(()=>{refRBSheet.current.open()},100)
    // setSelectedData({name:props.name,plan:plan,price:price,planId:planId,id:props.id,days:days})
}

const closeSheet=()=>{
    setTimeout(()=>{refRBSheet.current.close()},100)
    props.loadCurrentPlan()
}


    return(
        <View style={style.container}>
            {
                loader == false ?
                <FlatList
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    data={planList}
                    numColumns={3}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity style={style.planView}
                                              onPress={()=>openSheet(item.name,item.price,item.planId,item.days)}>
                                <PlanBox plan={item.name}
                                            price={item.price}/>
                            </TouchableOpacity>
                        );
                    }}
                />
                :
                <View style={style.loader}>
                    <ActivityIndicator size={font.size.font16} color={color.primary}/>
                </View>
            }
              {/* <RBSheet
                        ref={refRBSheet}
                        height={height/2.5}
                        openDuration={250}
                >
                <>
                   <Reacharge selectedData={selectedData}
                              closeSheet={()=>closeSheet()}/>
                </>
                </RBSheet> */}
        </View>
    )
}

export default Plans 