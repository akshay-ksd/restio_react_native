import React from "react";
import {View,Text,FlatList, TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Icons from "../../atom/Icon";
import Realm from "realm";
import {toast} from "../../../global_functions/toast_message/Toast"
import * as Animatable from 'react-native-animatable';

const product = [{name:"Biriyani",qnty:3},{name:"Burger",qnty:4}]
const ProductList =(props)=>{
    const [productData,setProductData] = React.useState([])
    const [loadData,setloadData] = React.useState(false)
    const [selectId,setSelectedId] = React.useState(0)
    const [selectAllID,setSelectAll] = React.useState(false)
    const [hideSelectAll,setHideSelectAll] = React.useState(true)

    React.useEffect(()=>{
        checkOrderAsign()
    },[])

    const getOrders=async(pData)=>{

        const realm = await orderMasterSchema()
        let id = JSON.stringify(props.order_id)
        const master_datas = realm.objects("order_master").filtered(`order_id == ${id}`);   
        loadProduct(master_datas,pData)
    }

    const getProductDetails=async(order_details,pData)=>{
        let schema = {
            name:"product",
            properties:{
                category_id:"string",
                product_id:"string",
                name:"string",
                description:"string",
                price:"int",
                stock:"int",
                is_veg:"int",
                quantity:"int",
                isHide:"int"
            }
        };

        const realm = await Realm.open({
            path: "product",
            schema: [schema]
        })

        const product = realm.objects("product");

        loadProduct(order_details,product,pData)
    }

    const loadProduct =(order_details,pData)=>{
        if(pData.length !== 0){
            for(let i = 0; i < order_details.length; i ++){
                let id = JSON.stringify(order_details[i].product_id)
                let products = product.filtered(`product_id == ${id}`);
                let asigne = pData.filter( i => id.includes( i.productId ) );
                productData.push({
                    id:order_details[i].product_id,
                    name:products[0].name,
                    quantity:order_details[i].quantity,
                    isSelected:false,
                    isOrderAssign:asigne.length == 0 ? false:true,
                    status:order_details[i].status
                })
    
                if(i == order_details.length-1){
                    let id = JSON.stringify(0)
                    let data = productData.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.id === thing.id
                    )))
                    setProductData(data)
                    setloadData(true)
                    let isAllProductAssign = productData.filter( i => id.includes( i.status ) );
                    if(isAllProductAssign.length == 0){
                        setHideSelectAll(true)
                    }else{
                        setHideSelectAll(false)
                    }
                }
            }
        }else{
            for(let i = 0; i < order_details.length; i ++){
                let id = JSON.stringify(order_details[i].product_id)
                let products = product.filtered(`product_id == ${id}`);
                
    
                productData.push({
                    id:order_details[i].product_id,
                    name:products[0].name,
                    quantity:order_details[i].quantity,
                    isSelected:false,
                    isOrderAssign:false,
                    status:order_details[i].status
                })
    
                if(i == order_details.length-1){
                    let id = JSON.stringify(0)
                    let data = productData.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.id === thing.id
                    )))
                    setProductData(data)
                    setloadData(true)
                    let isAllProductAssign = productData.filter( i => id.includes( i.status ) );
                    if(isAllProductAssign.length == 0){
                        setHideSelectAll(true)
                    }else{
                        setHideSelectAll(false)
                    }
                }
            }
        }      
    }

    const selectProduct =(id,name,quantity,isSelected)=>{
        setTimeout(()=>{
            let x = Math.random();
            if( props.selectedChefId !== null){
                    let index = productData.findIndex((x)=>x.id == id)
                    productData[index].isSelected = !isSelected
                    setSelectedId(x)
                    props.selectProduct(id,!isSelected,quantity,name)
            }else{
                toast("Select Chef First")
            }
        },10)
    }

    const selectAll =()=>{
        if( props.selectedChefId !== null){
            let count = 0
            for(let i = 0; i < productData.length; i ++){
                if(productData[i].status == 0){
                    count = count + 1
                    selectProduct(productData[i].id,productData[i].name,productData[i].quantity,selectAllID)
                    if(i == productData.length-1){
                        setSelectAll(!selectAllID)
                        if(selectAllID == false){
                            toast(count+"Item Selected")
                        }
                    }
                }
            }
        }else{
            toast("Select Chef First")
        }
    }

    const checkOrderAsign =async()=>{
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
        const oId = JSON.stringify(props.order_id)
        const staff = data.filtered(`orderId == ${oId}`)
        const id = JSON.stringify(props.selectedChefId)
        const staffData = staff.filtered(`stafId == ${id}`)
        let staf = staffData.filter(x => x.status !== "itemReady");
        getAssignedProduct(staf,staff)
    }

    const getAssignedProduct =async(orderData,staff)=>{
        let schema = {
            name:"kitchenProduct",
            properties:{
              kitchenId:"string",
              productId:"string",
              quantity:"int",
              name:"string",
              kitchen_details:"string"
            }
        };

        const realm = await Realm.open({
            path: "kitchenProduct",
            schema: [schema]
        })

        if(orderData.length !== 0){
            const data = realm.objects("kitchenProduct");
            const id = JSON.stringify(orderData[0].kitchenId)
            const staffData = data.filtered(`kitchenId == ${id}`)
            let filterDdata = staffData.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.productId === thing.productId
                ))
            )
            getOrders(filterDdata)
        }else{
            const data = []
            getOrders(data)
        }     
    }

    const cancelProduct=(id)=>{
        props.cancelProduct(id)
    }
    const renderFooter=()=>{
        return(
            <View style={style.footer}/>
        )
    }

    return(
        <View style={style.container}>
            {
                hideSelectAll == false?
                <View style={style.header}> 
                    <Text style={style.headerText}><Text>Step 2: </Text>Select Product</Text>
                    <TouchableOpacity style={style.selectAllView}
                                    onPress={()=>selectAll()}>
                        <Icons iconName={selectAllID == true ?"checkmark-circle":"checkmark-circle-outline"} 
                                iconSize={font.size.font16} 
                                iconColor={selectAllID == true?color.tertiary:color.darkGray}
                                iconStyle = {style.iconStyle}/> 
                                <Text style={style.selectAllText}>Select All</Text>
                    </TouchableOpacity>
                </View>
                :null
            }
           
            {
                loadData && (
                    <View>
                        <FlatList
                            data={productData}
                            extraData={selectId}
                            ListFooterComponent={renderFooter}
                            renderItem={({item}) => {
                                const backgroundColor = item.isOrderAssign == true || item.status == 1?color.gray:color.white
                                const disabled = item.isOrderAssign == true || item.status == 1?true:false
                                return (
                                    <TouchableOpacity style={[style.productBox,{backgroundColor:backgroundColor}]}
                                                      onPress={()=>selectProduct(item.id,item.name,item.quantity,item.isSelected)}
                                                      disabled={disabled}>
                                        <View style={style.nameView}>
                                        {
                                            item.isOrderAssign == true || item.status == 1 ?
                                            <Text style={[style.assignText,{color:color.green,fontSize:font.size.font10}]}>Assigned</Text>
                                            :null
                                        }
                                            <Text style={style.name}>{item.name}</Text>
                                        </View>
                                        <Text style={style.name}>{item.quantity}</Text>
                                        {
                                            item.isOrderAssign == false ?
                                            <Icons iconName={item.isSelected == true?"checkmark-circle":"checkmark-circle-outline"} 
                                                iconSize={font.size.font16} 
                                                iconColor={item.status == 1?color.white:item.isSelected == true?color.tertiary:color.darkGray}
                                                iconStyle = {style.iconStyle}/> 
                                            :
                                            <TouchableOpacity style={style.assignedView}
                                                              onPress={()=>cancelProduct(item.id)}>
                                                <Icons iconName={"close-circle"} 
                                                    iconSize={font.size.font16} 
                                                    iconColor={color.primary}
                                                    iconStyle = {style.iconStyle}/> 
                                                 <Text style={style.assignText}>Cancel</Text>
                                            </TouchableOpacity>
                                        }
                                      
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                )
            }
           
        </View>
    )
}

export default ProductList