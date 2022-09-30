import React from "react";
import { View ,Dimensions,Text} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Header from "../../molecules/custom_heder/Heder"
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import Realm from "realm";
import List from "../../organisms/expence_data_list/ExpenceList"
import ScreenFocus from "../../../global_functions/screen_focus/ScreenFocus";
import NoInternet from "../no_internet_view/NoInternet";
import NetInfo  from "@react-native-community/netinfo";

class ExpenceList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            type:this.props.route.params.type,
            expenceList:[],
            total:0,
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
            }),
            isConnected:false,
        },
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
        this.loadExpenceDetails(this.props.route.params.data)
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    loadExpenceList=async(type)=>{
        let date = JSON.stringify(new Date().toISOString().slice(0, 10))
        let curr = new Date 
        let week = []
        var month = new Date().getMonth() + 1; //To get the Current Month
        var year = new Date().getFullYear(); //To get the Current Year

        
        let schema = {
            name:"expence",
            properties:{
               id:"string",
               amount:"int",
               category:"string",
               paymentType:"int",
               date:"string",
               month:"int",
               year:"int",
            }
        };

        const realm = await Realm.open({
            path: "expence",
            schema: [schema]
        })

        const expence = realm.objects("expence");
        if(type == 1){
            const data = expence.filtered(`date == ${date}`); 
            this.loadExpenceDetails(data)
        }else if(type == 2){
            for (let i = 0; i < 7; i++) {
                let first = curr.getDate() - curr.getDay() + i 
                let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
                week.push(day)
                if(i == 6){
                    const startDate = JSON.stringify(week[0])
                    const endDate = JSON.stringify(week[6])
                    const data = expence.filtered(`date >= ${startDate} && date <= ${endDate}`);
                    this.loadExpenceDetails(data)
                }
            }
        }else if(type == 3){
            const data = expence.filtered(`month == ${month} && year == ${year}`);
            this.loadExpenceDetails(data)
        }else if(type == 4){
            const data = expence.filtered(`year == ${year}`);
            this.loadExpenceDetails(data)
        }
    }

    loadExpenceDetails=(data)=>{
        if(data.length !== 0){
            let total = 0
            for(let i = 0; i < data.length; i ++){
                this.state.expenceList.push({
                    type: 'NORMAL',
                    item: {
                        id:data[i].expenceId,
                        category:data[i].category,
                        amount:data[i].amount,
                        paymentType:data[i].paymentType
                    }
                })
                total += data[i].amount
                if(i == data.length-1){
                    this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.state.expenceList),total:total,loadData:true})
                }
            }
        }else{
            this.setState({loadData:false})
        }
      
    }

    goExpenceScreen(id,category,amount,paymentType){
        this.props.navigation.navigate("Expence",{from:"edit",id:id,category:category,amount:amount,paymentType:paymentType})
    }

    rowRenderer = (type,data,index)=>{
        const {id,category,amount,paymentType} = data.item
        return(
            <List id={id}
                  category={category}
                  amount={amount}
                  paymentType={paymentType}
                  index={index}
                  onPress={()=>this.goExpenceScreen(id,category,amount,paymentType)}/>
        )
    }


    renderFooter = () =>{
        return(
            <View style={style.footer}>

            </View>
        )
    }

    render(){
        const {loadData,total,isConnected} = this.state
        return(
            <View style={style.container}>
                <Header headerName={this.props.route.params.dayText}/>
                <ScreenFocus is_focused={()=>this.loadExpenceList(this.state.type)}/>
                <View style={style.heading}>
                    <View style={style.categoryView}>
                        <Text>Category</Text>
                    </View>
                    <View style={style.priceView}>
                        <Text>Amount</Text>
                    </View>
                    <Text>Type</Text>
                </View>
                {
                    loadData ?
                    <>
                    {
                        isConnected?
                        <>
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
                            />
                            <View style={style.totalView}>
                                <Text style={style.totalText}>Total : ₹ {total}</Text>
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

export default ExpenceList