import React from "react";
import {View,Text} from "react-native";
import style from "./Style";
import Heder from "../../molecules/custom_heder/Heder";
import Button from "../../atom/Button";
import CategoryList from "../../organisms/category_list/CategoryList";
import ProductAddView from "../../organisms/product_add_view/ProductAddView";
import { toast } from "../../../global_functions/toast_message/Toast";
import {shatoken} from "../../../global_functions/shaToken/shaToken"
import moment from "moment";
import {socket_connect} from "../../../global_functions/socket/Socket"
import Realm from "realm";
import NoInternet from "../no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";

class AddProduct extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loadData:false,
            step:1,
            categoryData:null,
            name:null,
            description:null,
            price:null,
            stock:0,
            channel:'',
            is_veg:1,
            isConnected:false,
        }
    }

    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})})
        this.checkNetInfo()
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                this.socketConnect()
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    changeStep(){
        if(this.state.categoryData !== null){
            this.setState({step:2})
        }else{
            toast("Select Category")
        }
    }

    categoryData=(categoryData)=>{
        this.setState({categoryData:categoryData})
    }

    changeCategory =()=>{
        this.setState({step:1})
        this.setState({categoryData:null})
    }

    loadUserData=(text,type)=>{
        if(type == "name"){
            this.setState({name:text})
        }else if(type == "description"){
            this.setState({description:text})
        }else if(type == "price"){
            this.setState({price:text})
        }else if(type == "stock"){
            this.setState({stock:text})
        }else if(type == "is_veg"){
            this.setState({is_veg:text})
        }
    }

    uploadProduct=async()=>{
        if(this.state.isConnected){
            const { categoryData,name,description,price,stock,is_veg} = this.state
            const data = global.rtoken+moment().format('MMMM Do YYYY, h:mm:ss a')
            let product_id = await shatoken(data)
            if(categoryData !== null & name !== null & price !== null){
                let propductDetails = {
                    product_id:product_id,
                    name:this.state.name,
                    description:this.state.description == null?"___":this.state.description,
                    price:this.state.price,
                    stock:"0",
                    category_id:this.state.categoryData.category_id,
                    restaurent_id:global.rtoken,
                    is_veg:is_veg
                }
                this.state.channel.push('addProduct', { product: propductDetails})
            }else{
                toast("Form Not Completed")
            }
        }else{
            this.setState({isConnected:false})
        }      
    }

    async socketConnect(){
        const phxChannel = global.socket.channel('product:' + global.rtoken)
        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
        })

        phxChannel.on('addProduct',product => {
            this.storeProductLocaly(product)
        })
    }

    async storeProductLocaly(product){
        this.setState({step:3})
        this.setState({step:2})

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

        let task1;
        realm.write(() => {
            task1 = realm.create("product", {
                            category_id:product.product.category_id,
                            product_id:product.product.product_id,
                            name:product.product.name,
                            description:product.product.description,
                            price:parseInt(product.product.price),
                            stock:parseInt(product.product.stock),
                            is_veg:parseInt(product.product.is_veg),
                            quantity:0,
                            isHide:0
                    })
        })
        toast("Product Added")

        let data = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: product.product.product_id,
            task: "ADD"
        }
        this.state.channel.push("deleteQue", {data: data})
    }

    render(){
        const {loadData,step,categoryData,isConnected} = this.state
        return(
            <View style={style.container}>
                {
                    loadData == true ?
                    <>
                    {
                        isConnected?
                        <>
                                <Heder headerName = {"Add Product"} />

                                <View style={style.currentStepView}>
                                    <Text style={style.stepText}>{step == 1 ? "Step 1 : Select Category" : "Step 2 : Add Product Details"}</Text>
                                </View>

                                {
                                    step == 1 ?
                                    <View style={style.categoryselectView}>
                                        <CategoryList categoryData={this.categoryData}/>
                                    </View>
                                    :step == 2 ?
                                    <View style={style.productAddView}>
                                        <ProductAddView categoryData = {categoryData}
                                                        changeCategory = {()=>this.changeCategory()}
                                                        loadUserData = {this.loadUserData}/>
                                    </View>:null
                                }

                                <View style={style.buttonView}>
                                    {
                                        step == 1 ?
                                        categoryData !== null?
                                        <Button 
                                            buttonStyle = {style.nextButton}
                                            onPress = {()=>this.changeStep()}
                                            disabled = {false}
                                            textStyle = {style.nextButtonText}
                                            text = {"NEXT"}
                                            iconShow = {false}
                                        />
                                        :null
                                        :
                                        <Button 
                                            buttonStyle = {style.nextButton}
                                            onPress = {()=>this.uploadProduct()}
                                            disabled = {false}
                                            textStyle = {style.nextButtonText}
                                            text = {"SAVE"}
                                            iconShow = {false}
                                        />
                                    }
                                    
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
}

export default AddProduct