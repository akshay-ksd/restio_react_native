import React from "react";
import {View,Text,Dimensions,Alert} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Heder from "../../molecules/menu_header/Header"
import MenuCategory from "../../organisms/menu_category/MenuCategory"
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import ProductDisplay from "../../molecules/product_display/ProductDisplay";
import Realm from "realm";
import RBSheet from "react-native-raw-bottom-sheet";
import ProductAddView from "../../organisms/product_add_view/ProductAddView"
import {toast} from "../../../global_functions/toast_message/Toast"
import NoInternet from "../no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";
import SideMenuCategory from "../../organisms/side_menu/SideMenuCategory";


class EditProduct extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
              }),
            productList:[],
            loadData:false,
            index:0,
            selectProduct:{},
            name:null,
            description:null,
            price:null,
            stock:null,
            channel:'',
            is_veg:1,
            selecteddCategoryId:0,
            loadSheetData:false,
            emptyData:true,
            isConnected:false,
            categoryId:0,
            loadCategory:true,
            schema:""
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
        setTimeout(()=>{this.setState({loadData:true})},100)
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                this.getCategory()
                this.socketConnect()
            }else{
                this.setState({isConnected:false})
            }
          });
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
        //   this.setState({emptyProduct:true}) 
        }
    }

    loadData=async(category_id)=>{
        setTimeout(async()=>{
            this.setState({selecteddCategoryId:category_id})
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
            const data = categoryData.filtered(`category_id == ${id}`);
            this.state.productList.splice(0,this.state.productList.length)
            if(data.length !== 0){
                for(let i = 0; i < data.length; i ++){
                    this.state.productList.push({
                        type: 'NORMAL',
                        item: {
                            id: data[i].id,
                            productName: data[i].name,
                            categoryId: data[i].category_id,
                            price: data[i].price,
                            about: data[i].description,
                            isVeg: data[i].is_veg,
                            count: data[i].quantity,
                            product_id: data[i].product_id,
                            isHide: data[i].isHide
                        } 
                    })

                    if(i == data.length-1){
                        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList),emptyData:false})
                    }
                }
            }else{
                this.setState({emptyData:true})
            }
        },50)
    }


    selectProduct=(index)=>{
        this.setState({index:index})
    }

    editProduct=(orderData)=>{
        if(this.state.isConnected){
            setTimeout(()=>{this.RBSheet.open()
                this.setState({loadSheetData:true})},50)
            this.setState({name:orderData.productName,
                        description:orderData.about,
                        price:orderData.price,
                        stock:0,
                        is_veg:orderData.isVeg,
                        categoryId:orderData.categoryId})
            this.setState({selectProduct:orderData})
        }else{
            this.setState({isConnected:false})
        }
       
    }

    changeCategory=()=>{

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

    updateData=(id,isEnabled,selectedCategory)=>{
        this.setState({selecteddCategoryId:selectedCategory})
        if(this.state.isConnected){
            const {name,description,price,stock,is_veg,selecteddCategoryId} = this.state

            if(name.length !== 0){
                if(price.length !== 0){

                    let propductDetails = {
                        product_id:id,
                        name:name,
                        description:description,
                        price:typeof price == "number" ? JSON.stringify(price):price,
                        stock:JSON.stringify(10),
                        category_id:selectedCategory,
                        restaurent_id:global.rtoken,
                        is_veg:is_veg,
                        isHide:isEnabled
                    }

                    this.state.channel.push('updateProduct', { product: propductDetails})
                }else{
                    toast("Please Input Price")
                }
            }else{
                toast("Please Input Product Name")
            }
        }else{
            this.setState({isConnected:false})
        }       
    }

    updateStock=(productName,about,isVeg,price,isEnabled,categoryId,id)=>{
        this.setState({selecteddCategoryId:categoryId})
        if(this.state.isConnected){
                    let propductDetails = {
                        product_id:id,
                        name:productName,
                        description:about,
                        price:typeof price == "number" ? JSON.stringify(price):price,
                        stock:JSON.stringify(10),
                        category_id:categoryId,
                        restaurent_id:global.rtoken,
                        is_veg:isVeg,
                        isHide:isEnabled
                    }

            this.state.channel.push('updateProduct', { product: propductDetails})
        }else{
            this.setState({isConnected:false})
        }       
    }

    async socketConnect(){
        const phxChannel = global.socket.channel('product:' + global.rtoken)
        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
        })

        phxChannel.on('updateProduct',product => {
            this.updateDataBase(product.product)
        })

        phxChannel.on('deleteProduct',product => {
            this.deleteProductDataBase(product.product)
        })
    }

     updateDataBase=async(data)=>{
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

        const pData = realm.objects("product");
        const cId = JSON.stringify(data.category_id)
        const pId = JSON.stringify(data.product_id)
        const product = pData.filtered(`product_id == ${pId}`);
        let cproduct = pData.filtered(`product_id == ${pId} && category_id == ${cId}`);
        for(let i = 0; i < product.length; i ++){
            realm.write(()=>{
                product[i].description = data.description
                product[i].is_veg = data.is_veg
                product[i].name = data.name
                product[i].price = typeof data.price == "string" ? parseInt(data.price) : data.price
                product[i].stock = typeof data.stock == "string" ? parseInt(data.stock) : data.stock
                product[i].isHide = data.isHide == false?1:0
                product[i].category_id = data.category_id
            })
        }
        this.setState({selecteddCategoryId:data.category_id})
        setTimeout(()=>{this.setState({loadCategory:false})},10)
        setTimeout(()=>{this.loadData(data.category_id)
                        this.setState({loadCategory:true})},500)

       

        toast("Product Updated")
        let pdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: data.product_id,
            task: "UPDATE"
        }
        this.state.channel.push("deleteQue", {data: pdata})

        this.RBSheet.close()

    }

    updateUi=(data,type)=>{
        let index = this.state.productList.findIndex(x=>x.item.product_id === data.product_id)

        if(type == "update"){
            this.state.productList[index].item.productName = data.name
            this.state.productList[index].item.price = data.price
            this.state.productList[index].item.about = data.description
            this.state.productList[index].item.isVeg = data.is_veg
            this.state.productList[index].item.isHide = data.isHide == false?1:0
            this.setState({productList:this.state.productList})
            this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList)})
        }else{
            this.state.productList.splice(index,1)
            this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.productList)})
            if(this.state.productList.length == 0){
                this.setState({emptyData:true})
            }
        }
    }

    deleteProduct=(id,isHide)=>{
        if(this.state.isConnected){
            let propductDetails = {
                product_id:id,
                restaurent_id:global.rtoken,
                isHide:isHide
            }
            this.state.channel.push('deleteProduct', { product: propductDetails})
        }else{
            this.setState({isConnected:false})
        }      
    }

    deleteAlert=(id,isHide)=>{
        Alert.alert(
            "Delete",
            "",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => this.deleteProduct(id,isHide) }
            ]
          );
    }

    deleteProductDataBase=async(product)=>{
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

        const pData = realm.objects("product");
        const pId = JSON.stringify(product.product_id)
        const products = pData.filtered(`product_id == ${pId}`);
        this.setState({schema:realm})
        realm.write(()=>{
            products[0].isHide = 1
        })

        setTimeout(()=>{this.updateUi(product,"delete")},500)
        toast("Product Deleted")
        let pdata = {
            uToken: global.utoken,
            rToken: global.rtoken,
            accessid: product.product_id,
            task: "DELETE"

        }
        this.state.channel.push("deleteQue", {data: pdata})
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
                 this.setState({emptyData:true})
             }
             
        }else{
         this.setState({emptyData:false})
        //  this.selectedCategory(this.state.lastSelectedCategoryId)
        }
     }
     

    rowRenderer = (type,data,index,extendedState)=>{
        const {product_id,productName,price,about,isVeg,count,isHide,categoryId} = data.item
        return(
            <ProductDisplay id = {product_id}
                            productName = {productName}
                            price = {price}
                            about = {about}
                            isVeg = {isVeg}
                            count = {count}
                            edit = {true}
                            isHide = {isHide}
                            categoryId = {categoryId}
                            onPress = {()=>this.selectProduct(index)}
                            selectedIndex = {extendedState.index}
                            index = {index}
                            editProduct = {this.editProduct}
                            deleteProduct = {this.deleteAlert}
                            updateStock = {this.updateStock}
                            from={"edit"}/>   
        )
    }

    render(){
        const {loadData,index,categoryData,selectProduct,loadSheetData,emptyData,isConnected,loadCategory} = this.state
        return(
            <View style={style.container}>
                {
                    loadData == true ?
                    <>
                    {
                        isConnected?
                        <>
                                <Heder headerName = {"Edit Product"} searchProduct = {this.searchProduct}/>
                                {/* {
                                    loadCategory?
                                    <MenuCategory edit = {true}
                                                  selectedCategory = {this.loadData}
                                                  categoryId = {this.state.selecteddCategoryId}
                                                  from = {"edit"}/>
                                    :
                                    <View style={style.blankView}>

                                    </View>
                                } */}
                                <View style={style.productmenuView}>
                                    <SideMenuCategory edit = {true}
                                                      selectedCategory = {this.loadData}
                                                      categoryId = {this.state.selecteddCategoryId}
                                                      from = {"edit"}/>
                                    {
                                        emptyData !== true?
                                        <View style={style.productListView}>
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
                                                extendedState={{index:index}}
                                            />
                                        </View>
                                        :
                                        <View style={style.noProductFoundView}>
                                            <Text style={style.emptyText}> 🤷‍♂️</Text>
                                            <Text style={style.emptyText}>No Product Found</Text>
                                        </View>
                                    }
                                </View>
                                
                        </>
                        :<NoInternet/>
                    }                      
                    </>
                    :null
                }
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={Dimensions.get('window').height-font.headerHeight/2}
                    openDuration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    }}
                >     
                <>
                    {
                        loadSheetData && (
                            <ProductAddView categoryData = {categoryData}
                                            changeCategory = {()=>this.changeCategory()}
                                            loadUserData = {this.loadUserData}
                                            from = {"edit"}
                                            selectProduct = {selectProduct}
                                            update = {this.updateData}/>
                        )
                    }
                </>                    
                </RBSheet>
            </View>
        )
    }
}

export default EditProduct;