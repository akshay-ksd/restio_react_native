import React from "react";
import {View,Text,Dimensions,TouchableOpacity} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import Style from "./Style";
import Header from "../../molecules/menu_access_header/Header";
import Icons from "../../atom/Icon";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import {menu_access} from "../../../global_functions/realm_database/Realm";
import {toast} from "../../../global_functions/toast_message/Toast"

class Menu_access extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            menu:[],
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
            }),
            extendState:{},
            isSelected:false
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = Dimensions.get('window').height; 
        })
    }

    componentDidMount(){
        this.get_menu_data()
    }

    get_menu_data=async()=>{
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

        const data = realm.objects("category").sorted("categoryName");

        let filter = data.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.category_id === thing.category_id
        )))
        
        this.loadMenu(filter)
        this.checkAllMenuIsAdded(filter.length)
    }

    loadMenu=async(filter)=>{
        const realm = await menu_access()
        this.state.menu.splice(0,this.state.menu.length)
        for(let i = 0; i < filter.length; i ++){
            let menu_id = JSON.stringify(filter[i].category_id)
            let data = realm.objects("menu_access").filtered(`menu_id == ${menu_id}`)
            this.state.menu.push({
                type: 'NORMAL',
                item: {
                    id:filter[i].category_id,
                    categoryName:filter[i].categoryName,
                    isSelected:data.length == 0 ? false:true
                }
            })

            if(i == filter.length - 1){
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.menu)})
            }
        }
    }

    selectMenu=(id,menu_name)=>{
        let index = this.state.list._data.findIndex((x)=>x.item.id === id)
        this.state.list._data[index].item.isSelected = !this.state.list._data[index].item.isSelected
        this.setState({extendState:{data:this.state.list[index]}})
        this.storeAccessDetails(id,menu_name)

        if(this.state.list._data[index].item.isSelected == true){
            toast(`${menu_name} added`)
        }else{
            toast(`${menu_name} removed`)
        }

        if(this.state.isSelected == true){
            this.setState({isSelected:false})
        }

        this.checkAllMenuIsAdded(this.state.menu.length)
    }

    storeAccessDetails=async(id,menu_name)=>{
        const realm = await menu_access()
        let menu_id = JSON.stringify(id)
        const data = realm.objects("menu_access").filtered(`menu_id == ${menu_id}`)

        if(data.length == 0){
            realm.write(() => {
                realm.create("menu_access", {
                    menu_id:id,
                    menu_name:menu_name
                })
            })
        }else{
            realm.write(()=>{
                realm.delete(data)
            })
        }
    }

    selectAll=async()=>{
        const realm = await menu_access()
        const data = realm.objects("menu_access")
        realm.write(()=>{
            realm.delete(data)
        })

        let schema = {
            name:"category",
            properties:{
                category_id:"string",
                categoryName:"string",
                is_upload:"int"
            }
        };

        const realms = await Realm.open({
            path: "category",
            schema: [schema]
        })

        const menu = realms.objects("category");

        if(this.state.isSelected == false){
            for(let i = 0; i < menu.length; i ++){
                realm.write(() => {
                    realm.create("menu_access", {
                        menu_id:menu[i].category_id,
                        menu_name:menu[i].categoryName
                    })
                })
    
                if(i == menu.length - 1){
                    this.setState({isSelected:true})
                    this.get_menu_data()
                    toast("Added all menu")
                }
            }
        }else{
            realm.write(()=>{
                realm.delete(data)
                this.setState({isSelected:false})
                this.get_menu_data()
                toast("Removed all menu")
            })
        }

       
    }

    checkAllMenuIsAdded=async(menuCount)=>{
        const realm = await menu_access()
        let data = realm.objects("menu_access")
        let filter = data.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.menu_id === thing.menu_id
        )))
        if(menuCount == filter.length){
            this.setState({isSelected:true})
        }else{
            this.setState({isSelected:false}) 
        }
    }

    filterProduct=async(product)=>{

    }

    rowRenderer = (type,data,index,extendState)=>{
        const {id,categoryName,isSelected} = data.item
        return(
            <TouchableOpacity style={Style.menuContainer} onPress={()=>this.selectMenu(id,categoryName)}>
                <Text style={Style.menuName}>{categoryName}</Text>
                <Icons iconName={"checkmark-circle"} 
                    iconSize={font.size.font16} 
                    iconColor={isSelected?color.secondary:color.white}
                    />
            </TouchableOpacity>   
           
        )
      
    }
    render(){
        const {menu,isSelected} = this.state
        return(
            <View style={Style.container}>
                <Header isSelected={isSelected} selectAll={()=>this.selectAll()}/>
                <RecyclerListView
                    style={Style.menuListView}
                    rowRenderer={this.rowRenderer}
                    dataProvider={this.state.list}
                    layoutProvider={this.layoutProvider}
                    forceNonDeterministicRendering={true}
                    canChangeSize={true}
                    disableRecycling={true}
                    initialOffset={3}
                    onEndReachedThreshold={2}
                    extendedState={{data:this.state.extendState}}
                />
            </View>
        )
    }
}

export default Menu_access