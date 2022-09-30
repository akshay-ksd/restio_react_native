import React from "react";
import {View,ScrollView,Alert} from "react-native";
import style from "./Style";
import Header from "../../components/molecules/profile_header/Header";
import Button from "../../components/atom/Button";
import color from "../../theme/colors";
import font from "../../theme/font";
import CompanyLogo from "../../components/molecules/company_logo/ComponyLogo";
import Realm from "realm";
import { connect } from 'react-redux'

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loadData:false
        }
    }

    componentDidMount(){
        this.loadData()
    }

    loadData(){
        setTimeout(()=>{this.setState({loadData:true})},100)
    }

    goEditProfileScreen(){
        this.props.navigation.navigate("EditProfile")
    }

    goAddProductScreen(){
        this.props.navigation.navigate("AddProduct")
    }

    goEditProductScreen(){
        this.props.navigation.navigate("EditProduct")
    }

    goManageStaffScreen(){
        this.props.navigation.navigate('ManageStaff')
    }

    goManagePlanScreen(){
        this.props.navigation.navigate("ManagePlan")
    }

    goHelpScreen(){
        this.props.navigation.navigate("Help")
    }

    logOut(){
        Alert.alert(
            "Log Out",
            "Are sure want you log out",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () =>this.logOutAndDeleteData()}
            ]
        );
    }

    goChargesScreen(){
        this.props.navigation.navigate("Charges")
    }

    async logOutAndDeleteData(){
        let schema = {
            name: "user",
            properties: {
            name: "string",
            utoken: "string",
            rtoken: "string",
            access: "string",
            is_loged: "int",
            active_token: "string"
            },
        };

        const realm = await Realm.open({
            path: "myrealm",
            schema: [schema],
        });

        const user = realm.objects("user")
        realm.write(()=>{
            realm.delete(user)
        })
        this.props.logout()
    }

    goTableScreen =()=>{
        this.props.navigation.navigate("Table")
    }

    goAttendenceScreen =()=>{
        this.props.navigation.navigate("Atendence")
    }

    goLinkScreen =()=>{
        this.props.navigation.navigate("LinkDevice")
    }

    goPrinterScreen =()=>{
        this.props.navigation.navigate("Printer") 
    }

    goToQrcodeScreen =()=>{
        this.props.navigation.navigate("Qrcode")
    }

    render(){
        return(
            <View style={style.container}>
                {
                    this.state.loadData == true ?
                    <>
                     <Header/>

                <ScrollView style={style.buttonView}>
                    {/* <Button 
                        buttonStyle = {style.button}
                        onPress = {()=>this.goEditProfileScreen()}
                        disabled = {false}
                        textStyle = {style.buttonText}
                        text = {"Edit Profile"}
                        iconShow = {true}
                        iconName = {"person-circle"}
                        iconSize = {font.size.font12}
                        iconColor = {color.secondary}
                        iconStyle = {style.iconStyle}
                    /> */}
                    {
                        global.access == "ALL" ?
                        <>
                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goAddProductScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Add Product"}
                                iconShow = {true}
                                iconName = {"fast-food-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goEditProductScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Edit Product"}
                                iconShow = {true}
                                iconName = {"create-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goManageStaffScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Manage Staff"}
                                iconShow = {true}
                                iconName = {"person-add-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goAttendenceScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Staff Attendance"}
                                iconShow = {true}
                                iconName = {"people-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goTableScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Manage Table"}
                                iconShow = {true}
                                iconName = {"apps-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goToQrcodeScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Manage QR-CODE"}
                                iconShow = {true}
                                iconName = {"qr-code-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goChargesScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Hotel Charges"}
                                iconShow = {true}
                                iconName = {"reader-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goPrinterScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Manage Printer"}
                                iconShow = {true}
                                iconName = {"print-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goManagePlanScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Bill"}
                                iconShow = {true}
                                iconName = {"calendar-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goLinkScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Link With Desktop"}
                                iconShow = {true}
                                iconName = {"desktop-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />

                     </>
                        :null
                    }
                            <Button 
                                buttonStyle = {style.button}
                                onPress = {()=>this.goHelpScreen()}
                                disabled = {false}
                                textStyle = {style.buttonText}
                                text = {"Help & Contact Us"}
                                iconShow = {true}
                                iconName = {"help-circle-outline"}
                                iconSize = {font.size.font12}
                                iconColor = {color.secondary}
                                iconStyle = {style.iconStyle}
                            />
                    <Button 
                        buttonStyle = {style.button}
                        onPress = {()=>this.logOut()}
                        disabled = {false}
                        textStyle = {style.buttonText}
                        text = {"Log Out"}
                        iconShow = {true}
                        iconName = {"power-outline"}
                        iconSize = {font.size.font12}
                        iconColor = {color.secondary}
                        iconStyle = {style.iconStyle}
                    />
                </ScrollView>
                <CompanyLogo/>               
                </>
                :null
            }
            </View>
        )
    }
}
function mapStateToProps(state) {
    return {
      login_status: state.login_status
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
        login: () => dispatch({ type: 'LOGIN' }),
        logout: () => dispatch({ type: 'LOGOUT' }),
    }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(Profile)

