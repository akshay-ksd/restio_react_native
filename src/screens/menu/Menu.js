import React from "react";
import {View,Dimensions,Text,Modal,Alert, Keyboard,Pressable} from "react-native";
import style from "./Style";
import Header from "../../components/molecules/menu_header/Header";
import MenuCategory from "../../components/organisms/menu_category/MenuCategory";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import ProductDisplay from "../../components/molecules/product_display/ProductDisplay"
import OrderBar from "../../components/molecules/order_bar/OrderBar";
import Realm from "realm";
import {shatoken} from "../../global_functions/shaToken/shaToken";
import moment from "moment";
import ScreenFocus from "../../global_functions/screen_focus/ScreenFocus";
import NoInternet from "../../components/templates/no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";
import { toast } from "../../global_functions/toast_message/Toast";
import Table from "../../components/organisms/table_select/Table";
import {orderMasterSchema,cart,order} from "../../global_functions/realm_database/Realm";
import SideMenuCategory from "../../components/organisms/side_menu/SideMenuCategory"
import font from "../../theme/font";

class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
              }),
            productList:[],
            loadData:false,
            schema:'',
            loadProduct:true,
            lastSelectedCategoryId:"",
            emptyProduct:false,
            isItemInCart:false,
            cartLength:0,
            cartTotal:0,
            cartSchema:'',
            channel:"",
            orderplaceLoader:false,
            charge:0,
            gst:0,
            pChannel:0,
            loadMenu:true,
            mChannel:0,
            isConnected:false,
            grandTotal:0,
            toggle:true,
            updateData:[],
            modalVisible: false,
            isApplyed:false,
            date:new Date(Date.now()),
            sgst:0,
            selectedcategoryName:0,
            isKeyboardVisible:false
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = Dimensions.get('window').height; 
          })
    }

    componentDidMount(){      
       this.checkNetInfo()
       setTimeout(() => {
        this.setState({loadData:true})
        }, 100);

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

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                this.msocketConnect()
                this.productSocketConnect()
                this.socketConnect()
                this.getCategory()
                this.getCharges()
                this.checkCart()
               
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    componentWillUnmount(){
        this.unsubscribe()
        this.state.channel.leave().receive('ok',response => {
        })
    }


    async getCategory(){
        let schema = {
            name:"category",
            properties:{
                category_id:"string",
                categoryName:"string",
                is_upload:"int"
            }
        };

        const realm = await Realm.open({
            path: "category",
            schema: [schema]
        })

        const data = realm.objects("category");
        if(data.length !== 0){
            const category_id = data[0].category_id
            this.loadData(category_id)
        }else{
          this.setState({emptyProduct:true}) 
        }
    }

    async loadData(category_id){
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

        this.setState({schema:realm,lastSelectedCategoryId:category_id})
        const categoryData = realm.objects("product");
        const id = JSON.stringify(category_id)
        const isHide = 0
        const fdata = categoryData.filtered(`category_id == ${id} && isHide == ${isHide}`);

        let data = fdata.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.product_id === thing.product_id
        )))

        if(data.length !== 0){
            this.state.productList.splice(0,this.state.productList.length)
            if(this.props.route.params.from == "edit"){
                let productData = this.props.route.params.productData
                this.setState({updateData:productData})
                this.checkUpdateData()
                for(let i = 0; i < data.length; i ++){
                    let pData = productData.filter(x=>x.item.product_id ==  data[i].product_id)
                    this.state.productList.unshift({
                        type: 'NORMAL',
                        item: {
                            id: data[i].id,
                            productName: data[i].name,
                            categoryId: data[i].category_id,
                            price: data[i].price,
                            about: data[i].description,
                            isVeg: data[i].is_veg,
                            count: pData.length == 0?data[i].quantity:pData[0].item.count,
                            product_id: data[i].product_id
                        } 
                    })
                    if(i == data.length-1){
                        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList),emptyProduct:false})
                    }
                }
            }else{
                for(let i = 0; i < data.length; i ++){
                    this.state.productList.unshift({
                        type: 'NORMAL',
                        item: {
                            id: data[i].id,
                            productName: data[i].name,
                            categoryId: data[i].category_id,
                            price: data[i].price,
                            about: data[i].description,
                            isVeg: data[i].is_veg,
                            count: data[i].quantity,
                            product_id: data[i].product_id
                        } 
                    })

                    if(i == data.length-1){
                        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList),emptyProduct:false})
                    }
                }
            }          
        }else{
            this.setState({emptyProduct:true})
        }
    }

    selectedCategory=(category_id,categoryName)=>{
       const categoryData = this.state.schema.objects("product");
       const id = JSON.stringify(category_id)
       const isHide = 0
       const fdata = categoryData.filtered(`category_id == ${id} && isHide == ${isHide}`);
       this.state.productList.splice(0,this.state.productList.length)
       this.setState({loadProduct:false,lastSelectedCategoryId:category_id,selectedcategoryName:categoryName})
       let data = fdata.filter((thing, index, self) =>
       index === self.findIndex((t) => (
           t.product_id === thing.product_id
       )))
       if(data.length !== 0){
        if(this.props.route.params.from == "edit"){
            let productData = this.props.route.params.productData
            for(let i = 0; i < data.length; i ++){
                let pData = productData.filter(x=>x.item.product_id ==  data[i].product_id)
                this.state.productList.unshift({
                    type: 'NORMAL',
                    item: {
                        id: data[i].id,
                        productName: data[i].name,
                        categoryId: data[i].category_id,
                        price: data[i].price,
                        about: data[i].description,
                        isVeg: data[i].is_veg,
                        count: pData.length == 0?data[i].quantity:pData[0].item.count,
                        product_id: data[i].product_id
                    } 
                })

                if(i == data.length-1){
                    this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList),emptyProduct:false})
                    setTimeout(()=>{this.setState({loadProduct:true})},200)
                }
            }
        }else{
            for(let i = 0; i < data.length; i ++){
                this.state.productList.unshift({
                    type: 'NORMAL',
                    item: {
                        id: data[i].id,
                        productName: data[i].name,
                        categoryId: data[i].category_id,
                        price: data[i].price,
                        about: data[i].description,
                        isVeg: data[i].is_veg,
                        count: data[i].quantity,
                        product_id: data[i].product_id
                    } 
                })

                if(i == data.length-1){
                    this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList),emptyProduct:false})
                    setTimeout(()=>{this.setState({loadProduct:true})},200)
                }
            } 
        }
       }else{
            this.setState({emptyProduct:true})
       }
    }

    searchProduct=(query)=>{
       if(query.length !== 0){
            const categoryData = this.state.schema.objects("product");
            const id = JSON.stringify(query)
            const isHide = 0
            const Pdata = categoryData.filtered(`isHide == ${isHide}`);
            const fdata = Pdata.filtered(`name CONTAINS[c] ${id}`);
            let data = fdata.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.product_id === thing.product_id
            )))
            if(data.length !== 0){
                this.state.productList.splice(0,this.state.productList.length)
                this.setState({loadProduct:false,emptyProduct:false})
                for(let i = 0; i < data.length; i ++){
                    this.state.productList.unshift({
                        type: 'NORMAL',
                        item: {
                            id: data[i].id,
                            productName: data[i].name,
                            categoryId: data[i].category_id,
                            price: data[i].price,
                            about: data[i].description,
                            isVeg: data[i].is_veg,
                            count: data[i].quantity,
                            product_id: data[i].product_id
                        } 
                    })

                    if(i == data.length-1){
                        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList)})
                        setTimeout(()=>{this.setState({loadProduct:true})},200)
                    }
                }
            }else{
                this.setState({emptyProduct:true})
            }
            
       }else{
        this.setState({emptyProduct:false})
        this.selectedCategory(this.state.lastSelectedCategoryId)
       }
    }

    loadProductCount=async(count,product_id,price,name,isVeg,category_id)=>{
        if(this.props.route.params.from == "edit"){
            this.loadUpdateProductCount(count,product_id,price,name,isVeg,category_id)
        }else{
            const realm = await cart()

            const cart_data = realm.objects("cart");
            const id = JSON.stringify(product_id);
            const data = cart_data.filtered(`product_id == ${id}`);
    
            if(data.length == 0){
                let sha_data = product_id+global.rtoken+moment().format('MMMM Do YYYY, h:mm:ss a')
                let order_id = await shatoken(sha_data)
                let task1;
                realm.write(() => {
                    task1 = realm.create("cart", {
                                    order_id:order_id,
                                    product_id:product_id,
                                    category_id:category_id,
                                    quantity:count,
                                    price:price,
                                    name:name,
                                    isVeg:isVeg
                            })
                })
            }else{
                if(count !== 0){
                    realm.write(() => {
                        data[0].quantity = count
                    });
                }else{
                    realm.write(() => {
                        realm.delete(data)
                })
                }           
            }

            this.checkCart()
            const categoryData = this.state.schema.objects("product");
            const Pdata = categoryData.filtered(`product_id == ${id}`);
            this.state.schema.write(() => {
                Pdata[0].quantity = count
            });
        }
        
    }

    async checkCart(){
        if(this.props.route.params.from !== "edit"){

            const realm = await cart()
            this.setState({cartSchema:realm})
            const cart_data = realm.objects("cart");

            if(cart_data.length !== 0){
                this.setState({isItemInCart:true})
                this.setState({cartLength:cart_data.length})
                let Total = 0
                let Gtotal = 0
                for(let i = 0; i < cart_data.length; i ++){
                    Total = cart_data[i].price * cart_data[i].quantity
                    Gtotal = Gtotal + Total
                    if(i == cart_data.length-1){
                        this.setState({cartTotal:Gtotal})
                        if(this.state.toggle == false){
                            this.toggle(this.state.toggle)
                        }else{
                            this.setState({grandTotal:Gtotal})
                        }
                    }
                }
            }else{
                this.setState({isItemInCart:false})
            }
        }
    }

    placeOrder=async(isApplyed)=>{
       this.setState({modalVisible:true,isApplyed:isApplyed})
    }

    conformOrder=async(tableNumber)=>{
        this.setState({modalVisible:false})
        const {isApplyed} = this.state
          if(this.state.isConnected == true){
            if(this.props.route.params.from == "edit"){
                this.updateOrder(isApplyed,tableNumber)
            }else{
                var date = new Date().toISOString().slice(0, 10); //To get the Current Date
        
                this.setState({orderplaceLoader:true})
            
                let sha_data = global.utoken+global.rtoken+moment().format('MMMM Do YYYY, h:mm:ss a')
                let order_id = await shatoken(sha_data)
                
                const cart_data = this.state.cartSchema.objects("cart");
                let order_data = []
                    let order = []
                    for(let j = 0; j < cart_data.length; j ++){
                        order.push({
                            order_detail_id:cart_data[j].order_id,
                            order_id:order_id,
                            product_id:cart_data[j].product_id,
                            quantity:cart_data[j].quantity,
                            price:cart_data[j].price,
                            category_id:cart_data[j].category_id,
                            restaurent_id:global.rtoken,
                            name:cart_data[j].name,
                            isVeg:cart_data[j].isVeg
                        })
        
                        if(j == cart_data.length-1){
                            let charge = isApplyed == true?this.state.charge:0
                            let total = this.state.grandTotal.toString()

                            let order_data={
                                order_id:order_id,
                                restaurent_id:global.rtoken,
                                status:0,
                                time:moment().format('MMMM Do YYYY'),
                                user_id:global.utoken,
                                type:"insert",
                                product:order,
                                gst:this.state.gst,
                                sgst:this.state.gst/1,
                                charge:charge,
                                date:"sss",
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
                            this.state.channel.push('addOrder', { order_data: order_data})
                            .receive("ok", (msg) =>  this.storeOrderDetailsLocaly(order_data))
                            .receive("error", (reasons) => toast("Check your internet connection"))
                            .receive("timeout", () => toast("Check your internet connection") )
                        }
                    }
            }
        } else{
            this.setState({isConnected:false})
        }
    }

    updateOrder=async(isApplyed,tableNumber)=>{
        var date = new Date().toISOString().slice(0, 10);
        this.setState({orderplaceLoader:true})
        let order = []
        for(let i = 0; i < this.state.updateData.length; i ++){
            let sha_data = this.state.updateData[i].item.product_id+global.rtoken+moment().format('MMMM Do YYYY, h:mm:ss a')
            let order_detail_id = await shatoken(sha_data)
            let task = this.state.updateData[i].item.count > 0 ? this.state.updateData[i].item.details_id == "false" ? "INSERT" : "UPDATE" : "DELETE"

            if(this.state.updateData[i].item.details_id == "false" & this.state.updateData[i].item.count == 0){
            }else{
                order.push({
                    order_detail_id:this.state.updateData[i].item.details_id == "false"?order_detail_id:this.state.updateData[i].item.details_id,
                    order_id:this.state.updateData[0].item.order_id,
                    product_id:this.state.updateData[i].item.product_id,
                    category_id:this.state.updateData[i].item.category_id,
                    quantity:this.state.updateData[i].item.count,
                    price:this.state.updateData[i].item.price,
                    restaurent_id:global.rtoken,
                    task:task,
                    name:this.state.updateData[i].item.name,
                    isVeg:this.state.updateData[i].item.isVeg
                })
            }
               
                if(i == this.state.updateData.length-1){
                    let charge = isApplyed == true?this.state.charge:0
                    let order_data={
                        order_id:this.state.updateData[0].item.order_id,
                        restaurent_id:global.rtoken,
                        type:"update",
                        product:order,
                        gst:this.state.gst,
                        sgst:this.state.gst/1,
                        charge:charge,
                        tableNumber:tableNumber,
                        total:this.state.grandTotal.toString()
                    }
                    this.state.channel.push('updateOrder', { order_data: order_data})
                    .receive("ok", (msg) =>this.updateOrderDetails(order_data))
                    .receive("error", (reasons) => toast("Check your internet connection"))
                    .receive("timeout", () => toast("Check your internet connection") )
                }
        }
    }

    storeOrderDetailsLocaly=async(data)=>{
        // let mdata = {
        //     uToken: global.utoken,
        //     rToken: global.rtoken,
        //     accessid: data.order_id,
        //     task: "ADD"
        // }
        // this.state.channel.push("deleteQue", {data: mdata})

        this.deleteCart()
        this.props.navigation.navigate("Orders")
        toast("Order Placed")
    }

    async storeOrderDetails(product){
        let schema = {
            name:"order",
            properties:{
                order_detail_id:"string",
                order_id:"string",
                product_id:"string",
                quantity:"int",
                price:"int",
                status:"int"
            }
        };

        const realm = await Realm.open({
            path: "order",
            schema: [schema]
        })

            for(let i = 0; i < product.length; i ++){
                let task1;
                realm.write(() => {
                    task1 = realm.create("order", {
                                    order_detail_id:product[i].order_detail_id,
                                    order_id:product[i].order_id,
                                    product_id:product[i].product_id,
                                    quantity:product[i].quantity,
                                    price:product[i].price,
                                    status:0
                            })
                })

                if(i == product.length-1){
                    this.deleteCart()
                    if(global.access == "ALL"){
                        this.props.navigation.navigate("Orders")
                    }else{
                        toast("Order Placed")
                    }
                }
            }
    }

    deleteCart(){
        this.setState({orderplaceLoader:false})
        const cart_data = this.state.cartSchema.objects("cart");
        this.state.cartSchema.write(() => {
            this.state.cartSchema.delete(cart_data)
       })

       const product = this.state.schema.objects("product");
       const id = 0
       const data = product.filtered(`quantity >= ${id}`);
       this.state.schema.write(() => {
           for(let i = 0; i < data.length; i ++){
               data[i].quantity = 0
               if(i == data.length-1){
                    this.checkCart()
                    this.selectedCategory(this.state.lastSelectedCategoryId)
               }
           }
       });
    }

    async socketConnect(){
        const phxChannel = global.socket.channel('order:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
        })

        // phxChannel.on('addOrder',product => {
        //    this.storeOrderDetailsLocaly(product.product)
        // })

        // phxChannel.on("updateOrder",product => {
        //     this.updateOrderDetails(product.product)
        // })
    }

    async productSocketConnect(){
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Product",
            task:"ADD"
        }

        const phxChannel = global.socket.channel('product:' + global.rtoken)
        phxChannel.join().receive('ok',response => {
            this.setState({pChannel:phxChannel})
            phxChannel.push("checkQueue", {data: data})
        })

        phxChannel.on('checkQueue',product => {
        if(product.staffId == global.utoken){
            if(product.task == "ADD"){
                if(product.data !== false){
                    this.storeProductLocalDataBase(product.data)
                }else if(product.data == false){
                    this.checkUpdatetask()
                }
            }else if(product.task == "UPDATE"){
                if(product.data !== false){
                    this.updateProductLocallly(product.data)
                }else if(product.data == false){
                    this.checkDeletetask()
                }
            }
            else if(product.task == "DELETE"){
                if(product.data !== false){
                    this.deleteProductLocally(product.data)
                }
            }
        }
        })
    }

    is_focused=()=>{
        this.getCategory()
        this.socketConnect()
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
            this.setState({charge:data[0].charge,gst:data[0].gst,sgst:data[0]})
        }
    }

    loadQueData=async(product)=>{
        for(let i = 0; i < product.length; i ++){
            this.state.productList.unshift({
                type: 'NORMAL',
                item: {
                    id: product[i].product_id,
                    productName: product[i].name,
                    categoryId: product[i].category_id,
                    price: product[i].price,
                    about: product[i].description,
                    isVeg: product[i].is_veg,
                    count: 0,
                    product_id: product[i].product_id
                } 
            })

            if(i == product.length-1){
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList),emptyProduct:false})
            }
        }
    }

    storeProductLocalDataBase=async(product)=>{
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
        for(let i = 0; i < product.length; i ++){
            let task1;
            realm.write(() => {
                    task1 = realm.create("product", {
                                    category_id:product[i].category_id,
                                    product_id:product[i].product_id,
                                    name:product[i].name,
                                    description:product[i].description,
                                    price:parseInt(product[i].price),
                                    stock:parseInt(0),
                                    is_veg:parseInt(product[i].is_veg),
                                    quantity:0,
                                    isHide:0
                            })
                    let data = {
                        uToken: global.utoken,
                        rToken: global.rtoken,
                        accessid: product[i].product_id,
                        task: "ADD"
                    }
                    this.state.pChannel.push("deleteQue", {data: data})
            })
            if(i == product.length - 1){
                this.getCategory()
                this.checkUpdatetask()
            }
        }

    }

    async msocketConnect(){
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Menu",
            task:"ADD"
        }

        const phxChannel = global.socket.channel('menu:' + global.rtoken)
        
        phxChannel.join().receive('ok',response => {
          this.setState({mChannel:phxChannel})
          phxChannel.push("checkQueue", {data: data})
        })

        // phxChannel.on('new_category',category => {

        // })

        // phxChannel.on('deleteCategory',category => {
           
        // })

        phxChannel.on('checkQueue',data => {
          if(data.staffId == global.utoken){
            if(data.data !== false){
                this.storeCategoryLocaly(data.data)
            }
          }
        })
    }

    storeCategoryLocaly =async(data)=>{
        let schema = {
            name:"category",
            properties:{
                category_id:"string",
                categoryName:"string",
                is_upload:"int"
            }
        };

        const realm = await Realm.open({
            path: "category",
            schema: [schema]
        })

        for(let i = 0; i < data.length; i ++){
            let task1;

            realm.write(() => {
                task1 = realm.create("category", {
                    category_id:data[i].category_id,
                    categoryName:data[i].categoryName,
                    is_upload:1
                })

                let mdata = {
                    uToken: global.utoken,
                    rToken: global.rtoken,
                    accessid: task1.category_id,
                    task: "ADD"
                }
                this.state.mChannel.push("deleteQue", {data: mdata})
            })
            if(i == data.length - 1){
                this.getCategory()
                this.setState({loadMenu:false})
                setTimeout(()=>{this.setState({loadMenu:true})},100)
            }
        }    
    }

    updateProductLocallly =async(product)=>{
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

        let pData = realm.objects("product")

        for(let i = 0; i < product.length; i ++){
            let id = JSON.stringify(product[i].product_id)
            let uData = pData.filtered(`product_id == ${id}`)
            if(uData.length !== 0){
                realm.write(()=>{
                    for(let p = 0; p < uData.length; p ++){
                        uData[p].name = product[i].name
                        uData[p].description = product[i].description
                        uData[p].price = product[i].price
                        uData[p].stock = 0
                        uData[p].is_veg = product[i].is_veg
                        uData[p].isHide = product[i].isHide == false?1:0
                        uData[p].category_id = product[i].category_id
                    }
                        let mdata = {
                            uToken: global.utoken,
                            rToken: global.rtoken,
                            accessid: product[i].product_id,
                            task: "UPDATE"
                        }
                        this.state.pChannel.push("deleteQue", {data: mdata})
                })
    
                if(i == product.length - 1){
                    this.getCategory()
                }
            }          
        }
    }

    componentWillUnmount(){
        this.state.channel.leave()
        this.state.pChannel.leave()
        this.state.mChannel.leave()
    }

    checkUpdatetask=async()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Product",
            task:"UPDATE"
        }
        this.state.pChannel.push("checkQueue", {data: data})
    }

    checkDeletetask =async()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Product",
            task:"DELETE"
        }

        this.state.pChannel.push("checkQueue", {data: data})
    }
    
    deleteProductLocally =async(product)=>{
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

        let pData = realm.objects("product")

        for(let i = 0; i < product.length; i ++){
            let id = JSON.stringify(product[i].product_id)
            let uData = pData.filtered(`product_id == ${id}`)
            if(uData.length !== 0){
                realm.write(()=>{
                    for(let p = 0; p < uData.length; p ++){
                        uData[p].isHide = 1
                    }
                        let mdata = {
                            uToken: global.utoken,
                            rToken: global.rtoken,
                            accessid: product[i].product_id,
                            task: "DELETE"
                        }
                        this.state.pChannel.push("deleteQue", {data: mdata})
                })
    
                if(i == product.length - 1){
                    this.getCategory()
                }
            }         
        }
    }

    toggle=(toggle)=>{
        if(this.props.route.params.from == "edit"){
            this.setState({toggle:toggle})
            this.calculate_updateProduct_charges(toggle)
        }else{
            this.setState({toggle:toggle})
            let gstPercentage = this.state.gst + "%"
            let gstCharge = (this.state.cartTotal * parseInt(gstPercentage))/100
            let charges = this.state.charge
            if(toggle == false){
                let total = this.state.cartTotal + charges
                this.setState({grandTotal:total})
            }else{
                let total = this.state.grandTotal - charges
                this.setState({grandTotal:total})
            }
        }        
    }

    calculate_updateProduct_charges=(toggle)=>{
        let gstPercentage = this.state.gst + "%"
        let gstCharge = (this.state.cartTotal * parseInt(gstPercentage))/100
        let charges = this.state.charge
       
        if(toggle == false){
            let total = this.state.cartTotal + charges
            this.setState({grandTotal:total})
        }else{
            let total = this.state.grandTotal - charges
            this.setState({grandTotal:total})
        }
    }

    checkUpdateData=()=>{
        let Total = 0;
        for(let i = 0; i < this.state.updateData.length; i ++){
            let total = this.state.updateData[i].item.count * this.state.updateData[i].item.price
            Total += total
            if(i == this.state.updateData.length-1){
                this.setState({cartTotal:Total,isItemInCart:true,cartLength:this.state.updateData.length})
                this.calculate_updateProduct_charges(false)
                if(this.state.cartTotal == 0){
                    this.setState({isItemInCart:false})
                }else{
                    this.setState({isItemInCart:false})
                    setTimeout(()=>{this.setState({isItemInCart:true})},10)
                }
                
            }
        }
    }

    loadUpdateProductCount=(count,product_id,price,name,isVeg,category_id)=>{
        let index = this.state.updateData.findIndex(x=>x.item.product_id == product_id)
        if(index == -1){
            this.state.updateData.push({
                type: "NORMAL",
                item:{
                    product_id:product_id,
                    details_id:"false",
                    category_id:category_id,
                    name:name,
                    isVeg:isVeg,
                    price:price,
                    count:count,
                }
            })
            setTimeout(()=>{this.checkUpdateData()},10)
        }else{
            this.state.updateData[index].item.count = count
            setTimeout(()=>{this.checkUpdateData()},10)
        }
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
        this.props.navigation.pop(2)
    }

    async inserOrderDetails(product){
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: product.order_detail_id,
            task: "PRODUCT_ADD"
        }
        this.state.channel.push("deleteQue", {data: mdata})
        
        const realm = await orderMasterSchema()
        const order_id = JSON.stringify(product.order_id)
        const order_data = realm.objects("order_master").filtered(`order_id == ${order_id}`)
        for(let i = 0; i < order_data.length; i ++){
            let id = JSON.stringify(product.product_id)
            let p_data = order_data[i].orderDetails.filtered(`product_id == ${id}`)
            
            if(p_data.length == 0){
                realm.write(() => {
                    order_data[i].orderDetails.push({
                        order_detail_id:product.order_detail_id,
                        order_id:product.order_id,
                        product_id:product.product_id,
                        quantity:product.quantity,
                        price:product.price,
                        name:product.name,
                        isVeg:product.isVeg
                    })
                })
            }
        }
    }

    async updateOrderDetailsData(product){
        const realm = await orderMasterSchema()
        const order_id = JSON.stringify(product.order_id)
        const order_data = realm.objects("order_master").filtered(`order_id == ${order_id}`)
        let index = order_data[0].orderDetails.findIndex(x=>x.order_detail_id == product.order_detail_id)

        realm.write(()=>{
            order_data[0].orderDetails[index].quantity = product.quantity
        })
        
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: product.order_detail_id,
            task: "PRODUCT_UPDATE"
        }
        this.state.channel.push("deleteQue", {data: mdata})
    }

    async deleteOrderDetailsData(product){
        const realm = await orderMasterSchema()
        const order_id = JSON.stringify(product.order_id)
        const order_data = realm.objects("order_master").filtered(`order_id == ${order_id}`)
        let index = order_data[0].orderDetails.findIndex(x=>x.order_detail_id == product.order_detail_id)

        realm.write(()=>{
            realm.delete(order_data[0].orderDetails[index])
        })
        
        let mdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: product.order_detail_id,
            task: "PRODUCT_DELETE"
        }
        this.state.channel.push("deleteQue", {data: mdata})
    }

    async updateOrderMaster(product){
        const realm = await orderMasterSchema()

        let data = realm.objects("order_master")
        let id = JSON.stringify(product.order_id)
        let orderData = data.filtered(`order_id == ${id}`)
        realm.write(()=>{
            for(let i = 0; i < orderData.length; i ++){
                orderData[i].gst = product.gst
                orderData[i].sgst = product.sgst
                orderData[i].charge = product.charge
                orderData[i].tableNumber = product.tableNumber
            }
        })
        this.props.navigation.pop(2)
        this.setState({orderplaceLoader:false})
    }

    setModalVisible=(isvissible)=>{
        this.setState({modalVisible:isvissible})
    }


    rowRenderer = (type,data,index)=>{
        const {id,productName,price,about,isVeg,count,product_id,categoryId} = data.item
        return(
            <ProductDisplay id = {id}
                            productName = {productName}
                            price = {price}
                            about = {about}
                            isVeg = {isVeg}
                            count = {count}
                            product_id = {product_id}
                            loadProductCount = {this.loadProductCount}
                            edit = {false}
                            selectedIndex = {0}
                            index = {1}
                            category_id = {categoryId}
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
        const {loadData,loadProduct,emptyProduct,isItemInCart,grandTotal,cartLength,orderplaceLoader,isKeyboardVisible,isConnected,modalVisible,selectedcategoryName} = this.state
        return(
            <View style={style.container}>
                <ScreenFocus is_focused={()=>this.is_focused()}/>
                {
                    loadData == true ?
                    <>
                        {
                            isConnected == true?
                            <>
                                    <Header searchProduct = {this.searchProduct}/>


                                    <View style={style.product_menu_view}>
                                            <SideMenuCategory selectedCategory = {this.selectedCategory}/>
                                        {
                                            emptyProduct == false ?
                                                <View style={{opacity:loadProduct == true?1:0}}>
                                                <View style={style.selectedcategoryNameView}>
                                                    <Text style={style.selectedcategoryName}>{selectedcategoryName == 0 ?"":selectedcategoryName}</Text>
                                                </View>
                                                    {
                                                        loadProduct == true?
                                                        <RecyclerListView
                                                            style={style.productListView}
                                                            rowRenderer={this.rowRenderer}
                                                            dataProvider={this.state.list}
                                                            layoutProvider={this.layoutProvider}
                                                            forceNonDeterministicRendering={true}
                                                            canChangeSize={true}
                                                            disableRecycling={true}
                                                            renderFooter={this.renderFooter}
                                                            initialOffset={3}
                                                            onEndReachedThreshold={2}
                                                        />:null
                                                    }                                      
                                                </View>         
                                            :
                                            <View style={style.emptyProductView}>
                                                <Text style={style.emptyProductText}>No Product Found 🤷‍♂️</Text>
                                            </View>
                                        }           
                                        
                                    </View>    
                                    {
                                            isItemInCart == true?
                                            <View style={{position:'absolute',bottom:isKeyboardVisible?font.headerHeight*5:30}}>
                                                <OrderBar cartLength={cartLength} cartTotal={grandTotal}
                                                          placeOrder={this.placeOrder}
                                                          orderplaceLoader={orderplaceLoader}
                                                          toggle={this.toggle}
                                                          from={this.props.route.params.from}/>
                                            </View>
                                          :null
                                    }            
                            </>
                            :
                            <NoInternet/>
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
                    :null
                }                
            </View>
        )
    }
}

export default Menu