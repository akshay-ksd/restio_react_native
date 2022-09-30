import React from "react";
import {View,Text,FlatList, TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Realm from "realm";
import moment from "moment"
import * as Animatable from 'react-native-animatable';

const ChefList =(props)=>{
    const [chefData,setChefData] = React.useState([])
    const [loadData,setLoadData] = React.useState(false)
    const [selectId,setselectId] = React.useState(null)
    React.useEffect(()=>{
        orderAssigned()
    },[])

    const orderAssigned =async()=>{
        let schema = {
            name:"kitchen",
            properties:{
               kitchenId:"string",
               orderId:"string",
               restaurentId:"string",
               stafId:"string",
               note:"string",
               date:"int",
               time:"string",
               status:"string"
            }
        };

        const realm = await Realm.open({
            path: "kitchen",
            schema: [schema]
        })
        const data = realm.objects("kitchen");
        const id = JSON.stringify(props.order_id)
        const staff = data.filtered(`orderId == ${id}`)
        getCheffData(staff)
    }

    const getCheffData =async(staffData)=>{
        let schema = {
            name:"staff",
            properties:{
                name:"string",
                access:"string",
                number:"string",
                password:"string",
                restaurent_token:"string",
                token:"string",
                is_active:"int"
            }
        };

        const realm = await Realm.open({
            path: "staff",
            schema: [schema]
        })

        const data = realm.objects("staff");
        const id = JSON.stringify("KITCHEN")
        const staff = data.filtered(`access == ${id} && is_active == 1`)
        for(let i = 0; i < props.onlinechef.length; i ++){
            let activeChefId = JSON.stringify(props.onlinechef[i].userId)
            const activeData = staff.filtered(`token == ${activeChefId}`)
            // const activeData = staff
            if(activeData.length !== 0){
                let filterDdata = activeData.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.token === thing.token
                    ))
                )

                const id = JSON.stringify(filterDdata[0].token)
                let statusData = staffData.filtered(`stafId == ${id}`)
                chefData.push({
                    id:filterDdata[0].token,
                    name:filterDdata[0].name,
                    isAssigned:statusData.length == 0?"false":statusData[0].status,
                    time:statusData.length == 0?"":statusData[0].time
                })

                setChefData(chefData)
                setLoadData(true)
            }
        }
        // if(data.length !== 0){
        //     for(let i = 0; i < staff.length; i ++){
        //         const id = JSON.stringify(staff[i].token)
        //         let statusData = staffData.filtered(`stafId == ${id}`)
        //         chefData.push({
        //             id:staff[i].token,
        //             name:staff[i].name,
        //             isAssigned:statusData.length == 0?"false":statusData[0].status,
        //             time:statusData.length == 0?"":statusData[0].time
        //         })

        //         if(i == staff.length - 1){
        //             let filterDdata = chefData.filter((thing, index, self) =>
        //             index === self.findIndex((t) => (
        //                 t.id === thing.id
        //             ))
        //             )
        //             setChefData(filterDdata)
        //             setLoadData(true)
        //         }
        //     }
        // }else{
        //     for(let i = 0; i < staff.length; i ++){
        //         const id = JSON.stringify(staff[i].token)
        //         let statusData = staffData.filtered(`stafId == ${id}`)
        //         chefData.push({
        //             id:staff[i].token,
        //             name:staff[i].name,
        //             isAssigned:"false",
        //             time:statusData.length == 0?"":statusData[0].time
        //         })

        //         if(i == staff.length - 1){
        //             let filterDdata = chefData.filter((thing, index, self) =>
        //                 index === self.findIndex((t) => (
        //                     t.id === thing.id
        //                 ))
        //             )
        //             setChefData(filterDdata)
        //             setLoadData(true)
        //         }
        //     }
        // }
       
    }

    const selectedChef=(id,name)=>{
        setTimeout(()=>{
            setselectId(id)
            props.selectedChef(id,name)
        },50)
    }


    return(
        <View style={style.container}>
            <View style={style.heading}>
                <Text style={style.headerText}><Text>Step 1: </Text>Select Chef</Text>
            </View>
            {
                loadData == true?
                <>
                    <View style={style.listContainer}>
                        <FlatList
                            columnWrapperStyle={{justifyContent: 'space-between'}}
                            data={chefData}
                            numColumns={3}
                            extraData={selectId}
                            renderItem={({item}) => {
                                const bColor = selectId == item.id ? color.primaryLight:color.gray
                                const tColor = selectId == item.id ? color.gray:color.borderColor
                                const bordercolor = item.isAssigned == "itemReady" ? color.green:color.white
                                const statusColor = item.isAssigned == "Pending" ? color.primary : item.isAssigned == "Accept" ? color.primaryLight:color.green
                                const animation = item.isAssigned == "Pending" ? "pulse" : item.isAssigned == "Accept" ? "pulse":"flash"
                                return (
                                    <TouchableOpacity style={[style.staffBox,{backgroundColor:bColor,borderColor:bordercolor}]}
                                                      onPress={()=>selectedChef(item.id,item.name)}>
                                        <Text style={style.name}>👨‍🍳</Text>
                                        <Text style={[style.name,{color:tColor}]}>{item.name}</Text>
                                        {
                                            item.isAssigned !== "false"?
                                             <>
                                                <Text style={[style.name,{color:tColor,fontSize:font.size.font10}]}>Assigned</Text>
                                             </>
                                             :null
                                        }
                                        {
                                            item.isAssigned !== "false"?
                                            <View style={[style.assignedView,{backgroundColor:statusColor}]}>
                                                <Animatable.Text animation={animation} iterationCount={"infinite"} direction={"alternate"} style={[style.assignText,{color:color.gray,fontSize:font.size.font10}]}>{item.isAssigned == "Pending"?"Pending":item.isAssigned == "Accept"? "Cooking 🍲":"Done 👍"}</Animatable.Text>
                                            </View>:null
                                        }
                                       
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </>
                :null
            }
        </View>
    )
}

export default ChefList;