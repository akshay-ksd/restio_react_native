import React from "react";
import {View,Text,Dimensions, TouchableOpacity, ActivityIndicator} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import style from "./Style";
import Icons from "../../atom/Icon";
import Button from "../../atom/Button";
import CategoryAdd from "../../molecules/category_add/CategoryAdd";
import Realm from "realm";
import {toast} from "../../../global_functions/toast_message/Toast"

class CategoryList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
              }),
            CategoryList:[],
            selectCategory:null,
            categoryAdd:false,
            loadButton:true,
            is_joined:false,
            channel:null,
            schema:'',
            loadData:false,
            category_id:"",
            selected_category_id:null
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = Dimensions.get('window').height; 
          })
    }

    componentDidMount(){
        this.socketConnect()
        this.getCategoryData()
    }

    async socketConnect(){
        
        const phxChannel = global.socket.channel('menu:' + global.rtoken)
        
        phxChannel.join().receive('ok',response => {
          this.setState({is_joined:response.status,channel:phxChannel})
        })

        phxChannel.on('new_category',category => {
            this.changeStatus(category)
        })

        phxChannel.on('deleteCategory',category => {
            let category_id = category.category_id
            this.deleteCategory_synced_device(category_id)
        })
    }

    selectCategory(index,category_id,categoryName){
        let categoryData = {
            category_id:category_id,
            categoryName:categoryName
        }
        this.props.categoryData(categoryData)
        this.setState({categoryAdd:false,
                       selectCategory:index,
                       selected_category_id:category_id})
        setTimeout(()=>{this.setState({loadButton:true})},150)
    }

    categoryAdd(){
        this.setState({categoryAdd:true,loadButton:false})
    }

    categoryLoad=(category_id,categoryName)=>{
        this.setState({categoryAdd:false,loadButton:true})
        this.state.CategoryList.unshift({
            type: 'NORMAL',
            item: {
                category_id: category_id,
                categoryName: categoryName,
                is_upload: 0
            } 
        })

        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.CategoryList),loadData:true})
        this.setState({selectCategory:null,loadButton:true})
    }

    async getCategoryData(){
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
        this.setState({schema:realm,CategoryList:[],loadData:false})
        const cdata = realm.objects("category");
        let data = cdata.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.category_id === thing.category_id
        )))
        for(let i = 0; i < data.length; i ++){
            if(data[i].category_id !== this.state.category_id){
                this.setState({category_id:data[i].category_id})
                this.state.CategoryList.push({
                    type: 'NORMAL',
                    item: {
                        category_id: data[i].category_id,
                        categoryName: data[i].categoryName,
                        is_upload: data[i].is_upload
                    } 
                })
            }
            

            if(data[i].is_upload == 0){
                this.checkStatusAndReupload()
            }

            if(i == data.length-1){
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.CategoryList),loadData:true})
                this.checkStatusAndReupload()
            }
        }
    }

    changeStatus(category){
        const index = this.state.CategoryList.findIndex(obj => obj.item.category_id === category.category_name.category_id)
        if(index !== -1){
            this.state.CategoryList.splice(index, 1);
            let category_data = {
                        type: 'NORMAL',
                        item: {
                            category_id: category.category_name.category_id,
                            categoryName: category.category_name.categoryName,
                            is_upload: 1,
                        } 
                }

            this.state.CategoryList.splice(index, 0, category_data)
            this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.CategoryList)})

            this.updateDataBase(category.category_name.category_id) 
        }else{
            this.insertNewCategory(category)
        }
       
    }

    updateDataBase(category_id){
        const data = this.state.schema.objects("category");
        const id = JSON.stringify(category_id)
        const categoryData = data.filtered(`category_id == ${id}`);
        this.state.schema.write(() => {
            categoryData[0].is_upload = 1;
          });
    }

    insertNewCategory(category){
        let task1;
        this.state.schema.write(() => {
            task1 = this.state.schema.create("category", {
                        category_id: category.category_name.category_id,
                        categoryName: category.category_name.categoryName,
                        is_upload: 1,
                    })
        })

        this.state.CategoryList.unshift({
            type: 'NORMAL',
            item: {
                category_id: category.category_name.category_id,
                categoryName: category.category_name.categoryName,
                is_upload: 1
            } 
        })

        this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.CategoryList),loadData:true})
    }

    checkStatusAndReupload(){
        const data = this.state.schema.objects("category");

        const interval = setInterval(() => {
            if(this.state.is_joined == true & this.state.channel !== null){
                for(let i = 0; i < data.length; i ++){
                    if(data[i].is_upload == 0){
                        let categoryData = {
                            category_id: data[i].category_id,
                            categoryName: data[i].categoryName,
                        }        
                        this.state.channel.push('addCategory', { category: categoryData})
                    }

                    if(i == data.length - 1){
                        clearInterval(interval)
                    }
                } 
            }
        }, 3000);
    }

    deleteCategory(){
        if(this.state.selected_category_id !== null){
            this.state.channel.push('deleteCategory', { category: this.state.selected_category_id})
        }
    }

    deleteCategory_synced_device(category_id){

       const data = this.state.schema.objects("category");
       const id = JSON.stringify(category_id)
       const categoryData = data.filtered(`category_id == ${id}`);
       this.state.schema.write(() => {
            this.state.schema.delete(categoryData)
       })
       this.setState({selectCategory:null,loadButton:true})
       this.getCategoryData()
    }

    rowRenderer = (type,data,index,extendedState)=>{
        const {category_id,categoryName,is_upload} = data.item
        return(
           <TouchableOpacity style={style.categoryListView} onPress={()=>this.selectCategory(index,category_id,categoryName)}>
               {
                   is_upload == 0 ?

                 <View style={style.categoryUploadLoaderView}>
                     <ActivityIndicator size={font.size.font12}
                                        color={color.primary}/>
                 </View>:null
               }
               <Text style={style.categoryText}>{categoryName}</Text>
               {
                   extendedState.extendedState == index?
                        <Icons iconName = {"checkmark-circle"}
                            iconSize = {font.size.font18}
                            iconColor = {color.primary}
                            iconStyle = {style.iconStyle}
                        />
                    :null
               }
             
           </TouchableOpacity>  
        )
    }

    renderFooter = () =>{
        return(
            <View style={style.footer}/>
        )
    }
    
    render(){
        const {list,selectCategory,categoryAdd,loadButton,loadData} = this.state
        return(
            <View style={style.container}>
                {
                    categoryAdd == true?
                     <CategoryAdd channel = {this.state.channel}
                                  categoryLoad = {this.categoryLoad}
                                  schema = {this.state.schema}/>
                    :
                    <View style={style.categoryeditButton}>
                      {
                        loadButton == true ?
                        <>
                            {
                                selectCategory !== null ?
                                <Button 
                                    buttonStyle = {style.buttonView}
                                    onPress = {()=>this.deleteCategory()}
                                    disabled = {false}
                                    textStyle = {style.buttonText}
                                    text = {"Delete"}
                                    iconShow = {true}
                                    iconName = {"trash"}
                                    iconSize = {font.size.font18}
                                    iconColor = {color.primary}
                                    style = {style.iconStyle}
                                />
                                :null
                            }
                        

                                <Button 
                                    buttonStyle = {[style.buttonView]}
                                    onPress = {()=>this.categoryAdd()}
                                    disabled = {false}
                                    textStyle = {style.buttonText}
                                    text = {"New Category"}
                                    iconShow = {true}
                                    iconName = {"add-circle"}
                                    iconSize = {font.size.font18}
                                    iconColor = {color.secondary}
                                    style = {style.iconStyle}
                                />
                            </>
                        :null
                    }  
                    </View>

                }
                
                {/* {
                    selectCategory !== null && loadButton == true?
                    <View style={style.selectedCategory}>
                        <Text style={style.selectedCategoryText}>{this.state.CategoryList[selectCategory].item.categoryName+" Selected"}</Text>
                    </View>
                    :null
                } */}
                
                {
                    loadData == true ?
                    <RecyclerListView
                        style={{flex:1}}
                        rowRenderer={this.rowRenderer}
                        dataProvider={list}
                        layoutProvider={this.layoutProvider}
                        forceNonDeterministicRendering={true}
                        canChangeSize={true}
                        disableRecycling={true}
                        renderFooter={this.renderFooter}
                        initialOffset={3}
                        onEndReachedThreshold={2}
                        extendedState={{extendedState:selectCategory}}
                    />:null
                }
               
            </View>
        )
    }
}

export default CategoryList;