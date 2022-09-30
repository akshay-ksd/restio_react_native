import React from "react";
import {View,Text,FlatList, TouchableOpacity} from 'react-native';
import style from "./Style";
import Button from "../../atom/Button";
import font from "../../../theme/font";
import color from "../../../theme/colors";
import Icons from "../../atom/Icon";
import Realm from "realm";



class SideMenuCategory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            category:[],
            selectedIndex:0
        }
        this.flatListRef = null;
    }

    componentDidMount(){
        this.load_data()
    }

    load_data=async()=>{
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

        this.setState({category:filter})

            if(this.props.from == "edit"){
                let index = this.state.category.findIndex(x=>x.category_id === this.props.categoryId)
                setTimeout(()=>{ this.setState({selectedIndex:index})
                                 this.flatListRef.scrollToIndex({ index: index })},100)
            }
    }
    
    getItemLayout(data, index) {
        return { length: style.categoryList.height, offset: style.categoryList.height * index, index };
      }

    selectCategory=(category_id,index,categoryName)=>{
        setTimeout(()=>{ this.setState({selectedIndex:index})},300)
        this.props.selectedCategory(category_id,categoryName)
    }

    renderItem = ({ item,index }) => (
        <View style={style.categoryView}>
            <Button 
                buttonStyle = {[style.categoryList,{borderColor:this.state.selectedIndex == index ? color.secondary:color.white}]}
                onPress = {()=>this.selectCategory(item.category_id,index,item.categoryName)}
                disabled = {false}
                textStyle = {[style.categoryText,{color:this.state.selectedIndex == index ? color.borderColor:color.borderColor}]}
                text = {item.categoryName}
                iconShow = {false}
                gradient = {false}
            />
            
        </View>
      
    );
    render(){
        return(
            <View style={style.container}>
                <FlatList
                    ref={(ref) => this.flatListRef = ref}
                    data={this.state.category}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.category_id}
                    showsVerticalScrollIndicator={false}
                    getItemLayout={this.getItemLayout.bind(this)}
                />
            </View>
        )
    }
}

export default SideMenuCategory