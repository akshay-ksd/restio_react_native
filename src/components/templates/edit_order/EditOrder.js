import React from "react";
import {View,Dimensions,Modal,Pressable,Text,Keyboard} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Heder from "../../molecules/custom_heder/Heder";
import Button from "../../atom/Button";
import EditProdut from "../../organisms/edit_order_product_list/EditProduct";
import Realm from "realm";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import OrderBar from "../../molecules/order_bar/OrderBar";
import ScreenFocus from "../../../global_functions/screen_focus/ScreenFocus";
import Table from "../../organisms/table_select/Table";
import {order} from "../../../global_functions/realm_database/Realm";
import moment from "moment"

class EditOrder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            productList:[],
            loadList:false,
            showUpdateButton:true,
            cartLength:0,
            cartTotal:0,
            charge:0,
            gst:0,
            isEnable:true,
            orderplaceLoader:false,
            modalVisible:false,
            isApplyed:false,
            sgst:0,
            isKeyboardVisible:false,
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
              }),
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = Dimensions.get('window').height; 
          })
    }

    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})},100)
        this.socketConnect()
        this.getCharges()
        this.getOrderProductDetails()
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
              this.setState({isKeyboardVisible:true}); // or some other action
            }
          );
          this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
              this.setState({isKeyboardVisible:false}); // or some other action
            }
          );
    }

    componentWillUnmount(){
        this.state.channel.leave().receive('ok',response => {
        })
    }


    getOrderProductDetails=async()=>{
        let product = this.props.route.params.data.product
        this.setState({cartLength:product.length})
        let Total = 0

        for(let i = 0; i < product.length; i ++){
            let total = product[i].price*product[i].quantity
            Total += total
            this.state.productList.unshift({
                type: 'NORMAL',
                item:{
                    order_id:product[i].order_id,
                    product_id:product[i].product_id,
                    category_id:product[i].category_id,
                    details_id:product[i].order_detail_id,
                    name:product[i].name,
                    isVeg:product[i].isVeg,
                    price:product[i].price,
                    count:product[i].quantity,
                }
            })

            if(i == product.length - 1){
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList),loadList:true})
                this.calculateCartCount()
            }
        }
    }

    loadProductCount=(count,product_id,price)=>{
        this.updateCount(count,product_id,price)
    }

    updateCount=(count,product_id,price)=>{
        let index = this.state.productList.findIndex(x=>x.item.product_id == product_id)
        this.state.productList[index].item.count = count
        this.setState({productList:this.state.productList})
        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList)})
        this.calculateCartCount()
    }

    calculateCartCount =()=>{
        let Total = 0
        for(let i = 0; i < this.state.productList.length; i ++){
            let total = this.state.productList[i].item.price * this.state.productList[i].item.count
            Total += total
            if(i == this.state.productList.length-1){
                if(Total !== 0){
                    this.setState({showUpdateButton:true})
                    if(this.state.isEnable == false){
                        let gstPercentage = this.state.gst + "%"
                        let gstCharge = (Total * parseInt(gstPercentage))/100
                        let total = this.state.charge+Total
                        this.setState({cartTotal:total})
                    }else{
                        this.setState({cartTotal:Total})  
                    }      
                }else{
                    this.setState({showUpdateButton:false})
                }
                       
            }
        }
    }

    getCharges=async()=>{
        let schema = {
            name: "restaurent",
            properties: {
                gst:"int",
                charge:"int",
                sgst:"int"
            },
        };

        const realm = await Realm.open({
            path: "restaurent",
            schema: [schema],
        });

        const data = realm.objects("restaurent");

        if(data.length !== 0){
            this.setState({charge:data[0].charge,gst:data[0].gst})
        }
    }

    toggle=(isEnable)=>{
        this.setState({isEnable:isEnable})
        let Total = 0
        for(let i = 0; i < this.state.productList.length; i ++){
            let total = this.state.productList[i].item.price * this.state.productList[i].item.count
            Total += total
            if(i == this.state.productList.length-1){
                if(isEnable == false){
                    let gstPercentage = this.state.gst + "%"
                    let gstCharge = (Total * parseInt(gstPercentage))/100
                    let total = this.state.charge+Total
                    this.setState({cartTotal:total})
                }else{
                    this.setState({cartTotal:Total})  
                }              
            }
        }
    }

    goMenuScreen =()=>{
        this.props.navigation.push("Menu",{from:"edit",productData:this.state.productList})
    }

    placeOrder =(isApplyed)=>{
        this.setState({orderplaceLoader:true,isApplyed:isApplyed,modalVisible:true})
      
    }

    conformOrder=(tableNumber)=>{
        const {isApplyed} = this.state

        let order = []
        for(let i = 0; i < this.state.productList.length; i ++){
            let task = this.state.productList[i].item.count == 0 ? "DELETE" : "UPDATE"

            order.push({
                order_detail_id:this.state.productList[i].item.details_id,
                order_id:this.state.productList[i].item.order_id,
                category_id:this.state.productList[i].item.category_id,
                product_id:this.state.productList[i].item.product_id,
                quantity:this.state.productList[i].item.count,
                price:this.state.productList[i].item.price,
                restaurent_id:global.rtoken,
                name:this.state.productList[i].item.name,
                isVeg:this.state.productList[i].item.isVeg,
                task:task 
            })
            if(i == this.state.productList.length-1){
                let charge = isApplyed == true?this.state.charge:0
                let total = this.state.cartTotal.toString()

                let order_data={
                    order_id:this.state.productList[0].item.order_id,
                    restaurent_id:global.rtoken,
                    type:"update",
                    product:order,
                    gst:this.state.gst,
                    sgst:this.state.gst/1,
                    charge:charge,
                    tableNumber:tableNumber,
                    year:new Date().getFullYear(),
                    month:new Date().getMonth()+1,
                    day:new Date().getDate() == 1 ? new Date().getDate()+1:new Date().getDate(),
                    o_date:new Date(),
                    hour: new Date().getHours(),
                    minute: new Date().getMinutes(), 
                    second: new Date().getSeconds(),
                    getMilliseconds:new Date().getMilliseconds(),
                    total:total
                }
                this.state.channel.push('updateOrder', { order_data: order_data})
                .receive("ok", (msg) => this.updateOrderDetails(order_data))
                .receive("error", (reasons) => toast("Check your internet connection"))
                .receive("timeout", () => toast("Check your internet connection") )
            }
        }
    }

    async socketConnect(){
        const phxChannel = global.socket.channel('order:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
        })
    }

    updateOrderDetails=async(product)=>{
       
        let realm = await order()
        let task1;
        realm.write(() => {
            task1 = realm.create("orders", {
                        order_id:product.order_id,
                        charge:product.charge,
                        tableNumber:product.tableNumber,
                        orderDetails:product.product,
                    })
        })
        this.props.navigation.goBack()
    }

    // async updateOrderDetailsData(product){
    //     const realm = await orderMasterSchema()

    //     const order = realm.objects("order_master")
    //     let id = JSON.stringify(product.order_id)
    //     let orderData = order.filtered(`order_id == ${id}`)

    //     let index = orderData[0].orderDetails.findIndex(x=>x.order_detail_id == product.order_detail_id)

    //     realm.write(()=>{
    //         orderData[0].orderDetails[index].quantity = product.quantity
    //     })

    //     let mdata = {
    //         uToken: global.utoken,
    //         rToken: global.rtoken,
    //         accessid: product.order_detail_id,
    //         task: "PRODUCT_UPDATE"
    //     }
    //     this.state.channel.push("deleteQue", {data: mdata})
    // }

    // async deleteOrderDetailsData(product){
    //     const realm = await orderMasterSchema()

    //     const data = realm.objects("order_master")
    //     let id = JSON.stringify(product.order_id)
    //     let orderData = data.filtered(`order_id == ${id}`)
    //     let index = orderData[0].orderDetails.findIndex(x=>x.order_detail_id == product.order_detail_id)
    //     realm.write(()=>{
    //         realm.delete(orderData[0].orderDetails[index])
    //     })

    //     // let mdata = {
    //     //     uToken: global.utoken,
    //     //     rToken: global.rtoken,
    //     //     accessid: product.order_detail_id,
    //     //     task: "PRODUCT_DELETE"
    //     // }
        
    //     // this.state.channel.push("deleteQue", {data: mdata})
    // }

    // async updateOrderMaster(product){
    //     const realm = await orderMasterSchema()

    //     const order = realm.objects("order_master")
    //     let id = JSON.stringify(product.order_id)
    //     let orderData = order.filtered(`order_id == ${id}`)

    //     realm.write(()=>{
    //         for(let i = 0; i < orderData.length; i ++){
    //             orderData[i].gst = product.gst
    //             orderData[i].sgst = product.sgst
    //             orderData[i].charge = product.charge
    //             orderData[i].tableNumber = product.tableNumber
    //             // orderData[i].date = product.o_date
    //         }
    //     })

    //     this.props.navigation.goBack()
    // }

    is_focused =()=>{
       this.socketConnect()
    }

    setModalVisible=(isvissible)=>{
        this.setState({modalVisible:isvissible})
    }

    rowRenderer = (type,data,index,extendedState)=>{
        const {details_id,name,isVeg,price,count,product_id} = data.item
        return(
            <EditProdut details_id={details_id}
                        name={name}
                        isVeg={isVeg}
                        price={price}
                        count={count}
                        product_id={product_id}
                        loadProductCount={this.loadProductCount}
                        />
        )
      
    }

    renderFooter = () =>{
        return(
            <View style={style.footer}>

            </View>
        )
    }

    render(){
        const {loadData,loadList,showUpdateButton,cartLength,cartTotal,orderplaceLoader,modalVisible,isKeyboardVisible} = this.state
        return(
            <View style={style.container}>
                <Heder headerName={"Edit Order"}/>
                <ScreenFocus is_focused={()=>this.is_focused()}/>
                {
                    loadData && (
                        <>
                            <View style={style.addProductView}>
                                <Button 
                                    buttonStyle = {style.addProductButton}
                                    onPress = {()=>this.goMenuScreen()}
                                    disabled = {false}
                                    textStyle = {style.addText}
                                    text = {"Add New Product"}
                                    gradient = {false}
                                />
                            </View>

                            {
                                loadList &&(
                                    <RecyclerListView
                                        style={style.productListView}
                                        rowRenderer={this.rowRenderer}
                                        dataProvider={this.state.list}
                                        layoutProvider={this.layoutProvider}
                                        forceNonDeterministicRendering={true}
                                        canChangeSize={true}
                                        disableRecycling={true}
                                        renderFooter={this.renderFooter}
                                        // onEndReached={this.pagination}
                                        // onVisibleIndicesChanged	={this.onScroll}
                                        initialOffset={3}
                                        onEndReachedThreshold={2}
                                        // extendedState={{data:this.state.extendState}}
                                    />
                                )
                            }
                            {
                                showUpdateButton && (
                                    <View style={{position:'absolute',bottom:isKeyboardVisible?font.headerHeight*5:30}}>
                                        <OrderBar cartLength={cartLength} cartTotal={cartTotal}
                                                placeOrder={this.placeOrder}
                                                orderplaceLoader={orderplaceLoader}
                                                toggle={this.toggle}
                                                from={"edit"}/>
                                    </View>
                                )
                            }

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    this.setModalVisible(!modalVisible);
                                }}>
                                    <Pressable style={style.modelView}
                                                      onPress={()=>this.setModalVisible(!modalVisible)}>
                                        <View style={style.selectTextView}>
                                            <Text style={style.selectText}>Select table number</Text>
                                        </View>
                                        <View style={style.tableView}>
                        
                                            <Table  disabled = {false}
                                                    edit={false}
                                                    loadCount={this.conformOrder}/>
                                        </View>
                                    </Pressable>
                            </Modal>   
                            
                        </>
                    )
                }
            </View>
        )
    }
}

export default EditOrder;