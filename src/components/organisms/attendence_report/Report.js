import React from "react";
import {View,Text,Dimensions} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import moment from "moment";
import Button from "../../atom/Button";
import { RecyclerListView, DataProvider, LayoutProvider, AutoScroll } from 'recyclerlistview';
import ReportProfile from "../report_profile/ReportProfile";
import DateTimePicker from '@react-native-community/datetimepicker';
import { toast } from "../../../global_functions/toast_message/Toast";

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}
class Report extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            date:new Date(Date.now()),
            date1:new Date(Date.now()),
            staffList:[],
            list:new DataProvider((r1, r2) => {
                return r1 !== r2;
            }),
            showList:false,
            showPicker:false,
            mode:"date",
            dateId:1,
            sDate:new Date(Date.now())
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
          },(type, dim) => {
            dim.width = Dimensions.get('window').width;
            dim.height = Dimensions.get('window').height; 
          })
    }

    componentDidMount(){
        this.getStaffDetails("home")
    }

    getStaffDetails=async(from)=>{
        let schema = {
            name:"staff",
            properties:{
                name:"string",
                access:"string",
                number:"string",
                password:"string",
                restaurent_token:"string",
                token:"string",
                is_active:"int"
            }
        };

        const realm = await Realm.open({
            path: "staff",
            schema: [schema]
        })
        let data = realm.objects("staff");
        let id = 1
        let staff = data.filtered(`is_active == ${id}`)
        this.getAttendence(staff,from)
    }

    getAttendence=async(staff,from)=>{
        let schema = {
            name:"attendence",
            properties:{
               id:"int",
               name:"string",
               staffId:"string",
               present:"int",
               date:"date"
            }
        };

        const realm = await Realm.open({
            path: "attendence",
            schema: [schema]
        })

        let atendence = realm.objects("attendence")
        this.loadReport(staff,atendence,from)
    }

    loadReport=(staff,attendence,from)=>{
        
        let filAttendence = attendence.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                +t.date === +thing.date & t.id === thing.id
            ))
        )

        let date = this.state.date
        let date1 = this.state.date1
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const diffDays = Math.round(Math.abs((date - date1) / oneDay));
        if(date <= date1){
            for(let i = 0; i < staff.length; i ++){
                let data = filAttendence.filter(x=>x.staffId == staff[i].token)  
                let is_same = +date === +date1

                if(is_same == true){
                    let fildates = data.filter(x=>x.date.getDate() == date.getDate())
                    this.state.staffList.unshift({
                        type: 'NORMAL',
                        item: {
                            name:staff[i].name,
                            access:staff[i].access,
                            token:staff[i].token,
                            present:fildates.length,
                            absent:diffDays+1 - fildates.length
                        }
                    })
                }else{
                    const dates = date;
                    let fildates = data.filter(x=>x.date >= addDays(dates,1) & x.date <= date1)
                    this.state.staffList.unshift({
                        type: 'NORMAL',
                        item: {
                            name:staff[i].name,
                            access:staff[i].access,
                            token:staff[i].token,
                            present:fildates.length,
                            absent:diffDays+1 - fildates.length
                        }
                    })
                }   
            if(i == staff.length-1){
                let filterDdata = this.state.staffList.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.item.token === thing.item.token
                    ))
                )
                this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(filterDdata),showList:true})
            }
            }
        }else{
            toast("Invalid format !!!")
        }
    }


    changeDate=(dId)=>{
        setTimeout(()=>{this.setState({showPicker:true,dateId:dId})},10)
    }

    onChange =(date)=>{
        if(date.type == "set"){
            if(this.state.dateId == 1){
                this.setState({date:date.nativeEvent.timestamp,sDate:date.nativeEvent.timestamp})
                this.getStaffDetails("calender")
            }else{
                this.setState({date1:date.nativeEvent.timestamp,sDate:date.nativeEvent.timestamp})
                this.getStaffDetails("calender")
            }
        }else{
            // toast("Date not selected !!!")
        }
        this.setState({showPicker:false})
    }

    rowRenderer = (type,data,index)=>{
        const {token,name,access,present,absent} = data.item
        return(
           <ReportProfile 
                name={name}
                token={token}
                access={access}
                present={present}
                absent={absent}
           />
        )
    }

    renderFooter = () =>{
        return(
            <View style={style.footer}/>
        )
    }

    render(){
        const {showList,showPicker,date,mode,sDate} = this.state
        return(
            <View style={style.container}>
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

                    <Button 
                        buttonStyle = {style.datePicker}
                        onPress = {()=>this.changeDate(2)}
                        disabled = {false}
                        textStyle = {style.boxText}
                        text = {moment(this.state.date1).format('MMM Do YYYY')}
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
                            value={sDate}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={(onchange)=>this.onChange(onchange)}
                        />
                )}

                {
                    showList && (
                        <RecyclerListView
                            style={style.staffList}
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
                    )
                }
            </View>
        )
    }
}

export default Report;