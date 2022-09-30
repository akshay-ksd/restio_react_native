import React from "react";
import {View,Text, ActivityIndicator, Dimensions, TouchableOpacity} from "react-native";
import style from "./Style";
import Button from "../../components/atom/Button";
import font from "../../theme/font";
import color from "../../theme/colors";
import RBSheet from "react-native-raw-bottom-sheet";
import Header from "../../components/molecules/custom_heder/Heder";
import Filter from "../../components/molecules/dashboard_filter/Filter";
import Icons from "../../components/atom/Icon";
import moment from "moment";
import ScreenFocus from "../../global_functions/screen_focus/ScreenFocus";
import Realm from "realm";
import { toast } from "../../global_functions/toast_message/Toast";
import NoInternet from "../../components/templates/no_internet_view/NoInternet";
import NetInfo from "@react-native-community/netinfo";
import {orderMasterSchema} from "../../global_functions/realm_database/Realm"
import DateTimePicker from '@react-native-community/datetimepicker';

const {height,width} = Dimensions.get('window')

class Sales extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loadData:false,
            bottomSheetType:"GRAPH",
            loadSheetData:false,
            income:0,
            expence:0,
            balance:0,
            order:0,
            selectedType:1,
            dayText:0,
            type:0,
            channel:null,
            isConnected:false,
            date:new Date(),
            date1:new Date(),
            showPicker:false,
            mode:"date",
            dateId:1,
            expenceData:[],
            loader:true
        }
    }

    componentDidMount(){
        // this.checkNetInfo()
        setTimeout(()=>{this.setState({loadData:true})},100)
    }

    checkNetInfo =()=>{
        this.unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == true){
                this.setState({isConnected:true})
                let date = JSON.stringify(new Date().toISOString().slice(0, 10))
                // this.loadData(1)
                // this.loadExpence(1)
                // this.getOrderCount(date,1)
                this.socketConnect()
            }else{
                this.setState({isConnected:false})
            }
          });
    }

    custom(){
        this.RBSheet.open()
        this.setState({loadSheetData:false,bottomSheetType:"CUSTOM"})
        setTimeout(()=>{this.setState({bottomSheetType:"CUSTOM",loadSheetData:true})},350)
    }

    selectGraphDate(){
        this.RBSheet.open()
        this.setState({loadSheetData:false,bottomSheetType:"GRAPH"})
        setTimeout(()=>{this.setState({loadSheetData:true})},350)
    }

    goExpenceScreen(){
        this.props.navigation.navigate("Expence",{from:"add"})
    }

    loadData=async(type)=>{
        this.setState({loader:true})
         data = {
            rToken:global.rtoken,
            date:moment(this.state.date).format('MMMM Do YYYY')
        }
        this.state.channel.push('get_report', { data: data})
    }

    loadOrder=async()=>{
        const {date,date1} = this.state;
        const realm = await orderMasterSchema()

        const order_master = realm.objects("order_master");
        const data = order_master.filtered(`status > 0 && status < 4`);

        const year = data.filter(x=>x.date.getFullYear() >= date.getFullYear() & x.date.getFullYear() <= date1.getFullYear())
        const month = year.filter(x=>x.date.getMonth() >= date.getMonth() & x.date.getMonth() <= date1.getMonth())
        const day = month.filter(x=>x.date.getDate() >= date.getDate() & x.date.getDate() <= date1.getDate())
        this.setState({order:day.length})

        let gTotal = 0
        let gstCharge = 0
        let sgstCharge = 0
        let charge = 0
        this.setState({income:0,expence:0})
        for(let i = 0; i < day.length; i ++){
            let total = 0
            
            for(let j = 0; j < day[i].orderDetails.length; j ++){
                total += day[i].orderDetails[j].price * day[i].orderDetails[j].quantity
                if(j == day[i].orderDetails.length-1){
                    gTotal += total
                    let gstPercentage = day[i].gst + "%"
                    let sgstPercentage = day[i].sgst + "%"

                    gstCharge += (total * parseInt(gstPercentage))/100
                    sgstCharge += (total * parseInt(gstPercentage))/100
                    charge += day[i].charge
                }
            }

            if(i == day.length-1){
                let total = gstCharge+charge+gTotal+sgstCharge
                setTimeout(()=>{this.setState({income:total.toFixed(2)})},100)
            }
        }
    }

    getOrderDetails=async(data)=>{
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
        const order = realm.objects("order");
        this.loadDetails(data,order)
    }

    loadDetails=(data,order)=>{
        let gTotal = 0
        this.setState({income:0,expence:0})
        for(let i = 0;i < data.length; i++){
            let order_id = JSON.stringify(data[i].order_id)
            let orderData = order.filtered(`order_id == ${order_id}`)
            let total = 0
            for(let p = 0; p < orderData.length; p++){
                total += orderData[p].price * orderData[p].quantity
                if(p == orderData.length-1){
                    gTotal += total
                }
            }
            if(i == data.length-1){
                let gstPercentage = data[i].gst + "%"
                let gstCharge = (gTotal * parseInt(gstPercentage))/100
                let total = gstCharge+data[i].charge+gTotal
                setTimeout(()=>{this.setState({income:total.toFixed(2)})},100)
            }
        }
    }

    selectType=(type)=>{
        setTimeout(()=>{this.setState({selectedType:type})},50)
        this.loadData(type)
        this.loadExpence(type)
    }

    loadExpence =async(type)=>{
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
            this.setState({type:type})
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
                    this.setState({type:type})
                }
            }
        }else if(type == 3){
            const data = expence.filtered(`month == ${month} && year == ${year}`);
            this.loadExpenceDetails(data)
            this.setState({type:type})
        }else if(type == 4){
            const data = expence.filtered(`year == ${year}`);
            this.loadExpenceDetails(data)
            this.setState({type:type})
        }
    }

    loadExpenceDetails=(expense)=>{
        if(expense.length !== 0){
            let total = 0;
            let data = expense.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.id === thing.id
            ))
            )
            for(let i = 0; i < data.length; i++){
                total += data[i].amount

                if(i == data.length-1){
                    setTimeout(()=>{this.setState({expence:total})},100)
                }
            }
        }else{
            setTimeout(()=>{this.setState({expence:0})},100)
        }
    }

    goExpenceList=()=>{
        this.props.navigation.navigate("ExpenceList",{type:this.state.type,dayText:this.state.dayText,data:this.state.expenceData})
    }

    getOrderCount=async(date,type)=>{
        // let curr = new Date 
        // let week = []
        // var month = new Date().getMonth() + 1; //To get the Current Month
        // var year = new Date().getFullYear()
        // let schema = {
        //     name:"order_master",
        //     properties:{
        //         order_id:"string",
        //         time:"string",
        //         status:"int",
        //         date:"string",
        //         month:"int",
        //         year:"int",
        //         is_upload:"int",
        //         gst:"int",
        //         charge:"int",
        //         tableNumber:"int"
        //     }
        // };

        // const realm = await Realm.open({
        //     path: "order_master",
        //     schema: [schema]
        // })

        // const order_master = realm.objects("order_master");
        // const master_data = order_master.filtered(`status > 0 && status < 4`);
        // if(type == 1){
        //     const data = master_data.filtered(`status > 0 && status < 4 && date == ${date}`); 
        //     this.setState({order:data.length})
        // }else if(type == 2){
        //     for (let i = 0; i < 7; i++) {
        //         let first = curr.getDate() - curr.getDay() + i 
        //         let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
        //         week.push(day)
        //         if(i == 6){
        //             const startDate = JSON.stringify(week[0])
        //             const endDate = JSON.stringify(week[6])
        //             const data = master_data.filtered(`status > 0 && status < 4 && date >= ${startDate} && date <= ${endDate}`);
        //             this.setState({order:data.length})
        //         }
        //     }
        // }else if(type == 3){
        //     const data = master_data.filtered(`status > 0 && status < 4 && month == ${month} && year == ${year}`);
        //     this.setState({order:data.length})
        // }else if(type == 4){
        //     const data = master_data.filtered(`status > 0 && status < 4 && year == ${year}`);
        //     this.setState({order:data.length})
        // }
    }

    async socketConnect(){
       
        const phxChannel = global.socket.channel('expence:' + global.rtoken)

        phxChannel.join().receive('ok',response => {
            this.setState({channel:phxChannel})
            // this.checkNewExpence()
            this.loadData()
        })

        phxChannel.on('get_report',expence => {
            this.loadSalesData(expence.data)
        })
    }

    componentWillUnmount(){
        this.state.channel.leave()
    }

    

    storeLocalDataBase=async(data)=>{
        // toast("Expence Added")
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

        let task1;
            realm.write(() => {
                task1 = realm.create("expence", {
                               id:data.expenceId,
                               amount:data.amount,
                               category:data.category,
                               paymentType:data.paymentType,
                               date:data.date,
                               month:data.month,
                               year:data.year
                        })
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: data.expenceId,
                task: "ADD"
            }
            this.state.channel.push("deleteQue", {data: mdata})
            // this.loadExpence(1)
        })
    }

    updateLocalDataBase=async(updateData)=>{
        // toast("Expence Updated")
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
        const id = JSON.stringify(updateData.expenceId)
        const data = expence.filtered(`id == ${id}`); 

        realm.write(()=>{
            data[0].amount = updateData.amount
            data[0].category = updateData.category
            data[0].paymentType = updateData.paymentType
            this.loadExpence(1)
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: updateData.expenceId,
                task: "UPDATE"
            }
            this.state.channel.push("deleteQue", {data: mdata})
        })
    }

    deleteLocalDataBase=async(updateData)=>{
        // toast("Expence Deleted")
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
        const id = JSON.stringify(updateData.expenceId)
        const data = expence.filtered(`id == ${id}`)

        realm.write(()=>{
            realm.delete(data)
            this.loadExpence(1)
            let mdata = {
                uToken: global.utoken,
                rToken: global.rtoken,
                accessid: updateData.expenceId,
                task: "DELETE"
            }
            this.state.channel.push("deleteQue", {data: mdata})
        })
    }

    checkNewExpence =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Expence",
            task:"ADD"
        }

        this.state.channel.push("checkQueue", {data: data})
    }

    storeExpencequeData =(expence)=>{
        if(expence.length !== 0){
            for(let i = 0; i < expence.length; i ++){
                let data = {
                    expenceId:expence[i].expenceId,
                    amount:expence[i].amount,
                    category:expence[i].category,
                    paymentType:expence[i].paymentType,
                    date:expence[i].date,
                    month:expence[i].month,
                    year:expence[i].year
                }
                this.storeLocalDataBase(data)
            }
        }
        this.checkUpdateExpenceQue()
    }

    checkUpdateExpenceQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Expence",
            task:"UPDATE"
        }

        this.state.channel.push("checkQueue", {data: data})
    }

    storeUpdateQueLocally =(expence)=>{
        if(expence.length !== 0){
            for(let i = 0; i < expence.length; i ++){
                let data = {
                    expenceId:expence[i].expenceId,
                    amount:expence[i].amount,
                    category:expence[i].category,
                    paymentType:expence[i].paymentType,
                    date:expence[i].date,
                    month:expence[i].month,
                    year:expence[i].year
                }
                this.updateLocalDataBase(data)
                this.checkDeleteExpenceQue()
            }
        }
    }

    checkDeleteExpenceQue =()=>{
        let data = {
            utoken:global.utoken,
            rtoken:global.rtoken,
            section:"Expence",
            task:"DELETE"
        }

        this.state.channel.push("checkQueue", {data: data})
    }

    changeDate=(dId)=>{
        setTimeout(()=>{this.setState({showPicker:true,dateId:dId})},10)
    }

    onChange =(date)=>{
        if(date.type == "set"){
            if(this.state.dateId == 1){
                this.setState({date:date.nativeEvent.timestamp})
                this.loadData("calender")
            }else{
                this.setState({date1:date.nativeEvent.timestamp})
                this.loadData("calender")
            }
        }else{
            // toast("Date not selected !!!")
        }
        this.setState({showPicker:false})
    }

    loadSalesData=(salesData)=>{
        if(salesData.orderCount !== 0){
            let total = 0
            for(let i = 0; i < salesData.orderData.length; i ++){
                let gTotal = salesData.orderData[i].total !== null? salesData.orderData[i].total : 0
                total += parseInt(gTotal)
    
                if(i == salesData.orderData.length - 1){
                    this.setState({income:total.toFixed(2),order:salesData.orderData.length,loader:false})
                }
            }
        }else{
            this.setState({income:0,order:0,loader:false})
        }
        
        if(salesData.expenceCount !== 0){
            let expence = 0
            for(let i = 0; i < salesData.expenceData.length; i ++){
                let gTotal = salesData.expenceData[i].amount
                expence += gTotal
                if(i == salesData.expenceData.length - 1){
                    this.setState({expence:expence.toFixed(2),expenceData:salesData.expenceData,loader:false})
                }
            }
        }else{
            this.setState({expence:0,loader:false})
        }
       
    }


    render(){
        const {loadData,income,expence,date,order,showPicker,loader,isConnected,mode} = this.state
        return(
            <View style={style.container}>
                <ScreenFocus is_focused = {()=>this.checkNetInfo()}/>
               {
                   loadData && (
                       <>
                       {
                        isConnected?
                        <>                          
                            <Header headerName = {"Dashboard"} />
                            
                            <View style={style.datePickerView}>
                                <Button 
                                    buttonStyle = {style.datePicker}
                                    onPress = {()=>this.changeDate(1)}
                                    disabled = {false}
                                    textStyle = {style.boxText}
                                    text = {moment(this.state.date).format('MMM Do YYYY')}
                                    iconShow = {true}
                                    iconName = {"chevron-down"}
                                    iconSize = {font.size.font18}
                                    iconColor = {color.white}
                                    iconStyle = {style.iconStyle}
                                />    
                            </View>

                            {showPicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={mode}
                                    is24Hour={true}
                                    display="default"
                                    onChange={(onchange)=>this.onChange(onchange)}
                                />
                            )}
                            <View style={style.buttonView}>
                                <TouchableOpacity style={[style.button,{borderColor:color.white}]}>
                                    <View style={style.buttonHeaderVie}>
                                        <Icons iconName = {"radio-button-off"}
                                                iconSize = {font.size.font12}
                                                iconColor = {color.green}
                                                iconStyle = {style.iconStyle}/>
                                        <Text style={style.buttonHeadingText}>income</Text>
                                    </View>
                                    <View style={style.amountView}>
                                        {
                                            loader?
                                            <ActivityIndicator size={font.size.font14} color={color.primary}/>
                                            :
                                            <Text style={style.amountText}>₹ {income}</Text>
                                        }
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={[style.button,{borderColor:color.white}]}
                                                onPress={()=>this.goExpenceList()}>
                                    <View style={style.buttonHeaderVie}>
                                        <Icons iconName = {"radio-button-off"}
                                                iconSize = {font.size.font12}
                                                iconColor = {color.primary}
                                                iconStyle = {style.iconStyle}/>
                                        <Text style={style.buttonHeadingText}>Expense</Text>
                                    </View>
                                    <View style={style.amountView}>
                                        {
                                            loader?
                                            <ActivityIndicator size={font.size.font14} color={color.primary}/>
                                            :
                                            <Text style={style.amountText}>₹ {expence}</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={style.buttonView}>
                                <View style={[style.button,{borderColor:color.white}]}>
                                    <View style={style.buttonHeaderVie}>
                                        <Icons iconName = {"radio-button-off"}
                                                iconSize = {font.size.font12}
                                                iconColor = {color.tertiary}
                                                iconStyle = {style.iconStyle}/>
                                        <Text style={style.buttonHeadingText}>Balance</Text>
                                    </View>
                                    <View style={style.amountView}>
                                        {
                                            loader?
                                            <ActivityIndicator size={font.size.font14} color={color.primary}/>
                                            :
                                            <Text style={[style.amountText,{color:income-expence<0?color.primary:color.green}]}>₹ {(income-expence).toFixed(2)}</Text>
                                        }
                                    </View>
                                </View>

                                <View style={[style.button,{borderColor:color.white}]}>
                                    <View style={style.buttonHeaderVie}>
                                        <Icons iconName = {"radio-button-off"}
                                                iconSize = {font.size.font12}
                                                iconColor = {color.secondaryLight}
                                                iconStyle = {style.iconStyle}/>
                                        <Text style={style.buttonHeadingText}>Orders</Text>
                                    </View>
                                    <View style={style.amountView}>
                                        {
                                            loader?
                                            <ActivityIndicator size={font.size.font14} color={color.primary}/>
                                            :
                                            <Text style={style.amountText}>{order}</Text>
                                        }
                                    </View>
                                </View>
                            </View>

                            <View style={style.dateDisplya}>
                                {/* <Text style={style.dateText}>{dayText}</Text> */}
                            </View>

                            <View style={style.expenceButtonView}>
                                <Button 
                                    buttonStyle = {style.expenceButton}
                                    onPress = {()=>this.goExpenceScreen()}
                                    disabled = {false}
                                    textStyle = {style.expenceButtonText}
                                    text = {"Add Expense"}
                                    iconShow = {false}
                                />
                            </View>
                        </>
                           :<NoInternet/>
                       }
                       </>
                   )
               }
            </View>
        )
    }
}

export default Sales