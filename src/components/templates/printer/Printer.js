import React from "react";
import {View,Text,Dimensions} from "react-native";
import color from "../../../theme/colors";
import font from "../../../theme/font";
import style from "./Style";
import Heder from "../../molecules/custom_heder/Heder";
import Textiput from "../../atom/TextInput";
import Button from "../../atom/Button";
import Realm from "realm";
import {toast} from "../../../global_functions/toast_message/Toast"

const {width,height} = Dimensions.get('window');

class Printer extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            loadData:false,
            name:"",
            address:"",
            phone:"",
            loader:false
        }
    }

    componentDidMount(){
        setTimeout(()=>{this.setState({loadData:true})},100)
        this.getDetails()
    }



    onChangeText=(text,type)=>{
        console.log("type",type)
        if(type == "name"){
            this.setState({name:text})
        }else if(type == "address"){
            this.setState({address:text})
        }else if(type == "phone"){
            this.setState({phone:text})
        }
    }

    addPrintDetails=async()=>{
        const {name,address,number} = this.state
        if(name !== "" & address !== "" & number !== ""){
            this.setState({loader:true})
            let schema = {
                name: "print_details",
                properties: {
                name: "string",
                address:"string",
                phone:"int"
                },
            };

            const realm = await Realm.open({
                path: "print_details",
                schema: [schema],
            });

            const print_details = realm.objects("print_details")

            if(print_details.length == 0){
                let task1;
                realm.write(() => {
                    task1 =  realm.create("print_details", {
                            name:this.state.name,
                            address:this.state.address,
                            phone:parseInt(this.state.phone)
                            })
                })
            }else{
                realm.write(()=>{
                    print_details[0].name = this.state.name
                    print_details[0].address = this.state.address
                    print_details[0].phone = parseInt(this.state.phone)
                })
            }
            toast("Details Updated")
            this.setState({loader:false})
        }else{
            toast("Inputs are empty")
        }
    }

    getDetails=async()=>{
        let schema = {
            name: "print_details",
            properties: {
            name: "string",
            address:"string",
            phone:"int"
            },
        };

        const realm = await Realm.open({
            path: "print_details",
            schema: [schema],
        });

        const print_details = realm.objects("print_details")
        if(print_details.length !== 0){
            this.setState({name:print_details[0].name,address:print_details[0].address,phone:print_details[0].phone.toString()})
        }
    }

    render(){
        const {loadData,name,address,phone,loader} = this.state
        return(
            <View style={style.container}>
                <Heder headerName={"Manage Printer"}/>
                {
                    loadData && (
                        <>
                        <View style={style.printBox}>
                            <Textiput inputViewStyle={style.restNameInputView}
                                      inputStyle={style.restInput}
                                      placeHolder={"Enter Restaurent Name"}
                                      value={name}
                                      type={"name"}
                                      load_data={this.onChangeText}
                                      />
                             <Textiput inputViewStyle={style.addressnputView}
                                      inputStyle={style.restInput}
                                      placeHolder={"Enter Restaurent Address"}
                                      value={address}
                                      type={"address"}
                                      load_data={this.onChangeText}
                                      multiline={true}
                                      />
                             <Textiput inputViewStyle={style.restNameInputView}
                                      inputStyle={style.restInput}
                                      placeHolder={"Enter Restaurent Phone Number"}
                                      value={phone}
                                      type={"phone"}
                                      keyboardType={"number-pad"}
                                      load_data={this.onChangeText}
                                      maxLength={12}
                                      />
                            <View style={style.updateButtonView}>
                                <Button 
                                    buttonStyle = {[style.button,{width:loader ?font.headerHeight:font.headerHeight*3}]}
                                    onPress = {()=>this.addPrintDetails()}
                                    disabled = {false}
                                    textStyle = {style.buttonText}
                                    text = {loader?0:"UPDATE"}
                                    iconShow = {false}
                                    loader = {loader}
                                    loaderSize = {font.size.font16} 
                                    loaderColor = {color.white}
                                />
                            </View>
                        </View>
                        </>
                    )
                }
            </View>
        )
    }
}

export default Printer