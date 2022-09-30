import React from "react";
import {View,Text,FlatList, TouchableOpacity} from 'react-native';
import style from "./Style";
import Button from "../../atom/Button";
import font from "../../../theme/font";
import color from "../../../theme/colors";
import Icons from "../../atom/Icon";
import Realm from "realm";



class MenuCategory extends React.Component{
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

        const data = realm.objects("category");
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

    selectCategory=(category_id,index)=>{
        setTimeout(()=>{ this.setState({selectedIndex:index})},300)
        this.props.selectedCategory(category_id)
    }

    renderItem = ({ item,index }) => (
        <View style={style.categoryView}>
            <Button 
                buttonStyle = {[style.categoryList,{borderColor:this.state.selectedIndex == index ? color.primary:color.white}]}
                onPress = {()=>this.selectCategory(item.category_id,index)}
                disabled = {false}
                textStyle = {[style.categoryText,{color:this.state.selectedIndex == index ? color.borderColor:color.borderColor}]}
                text = {item.categoryName}
                iconShow = {false}
                gradient = {false}
            />
            {/* {
                props.edit == true ?
                    <TouchableOpacity style={style.editIconView}>
                            <Icons  iconName = {"create"}
                                    iconSize = {font.size.font20}
                                    iconColor = {color.secondary}
                                    iconStyle = {style.iconstyle}/>
                            <Text>Edit</Text>
                    </TouchableOpacity>
                :null
            } */}
            
        </View>
      
    );
    render(){
        return(
            <View style={style.container}>
                <FlatList
                    ref={(ref) => this.flatListRef = ref}
                    horizontal={true}
                    data={this.state.category}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.category_id}
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={this.getItemLayout.bind(this)}
                />
            </View>
        )
    }
}

export default MenuCategory