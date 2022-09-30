import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "../screens/authentication/login_screen/Login";
import Home from "../screens/home/Home";
import Menu from "../screens/menu/Menu";
import Orders from "../screens/orders/Orders";
import Sales from "../screens/sales/Sales";
import Expence from "../screens/expence/Expence";
import Profile from "../screens/profile/Profile";
import EditProfile from "../components/templates/edit_profile/EditProfile";
import AddProduct from "../components/templates/add_product/AddProduct";
import EditProduct from "../components/templates/edit_product/EditProduct";
import ManageStaff from "../components/templates/manage_staff/ManageStaff"
import ManagePlan from "../components/templates/manage_plan/ManagePlan";
import Help from "../components/templates/help/Help";
import ContactUs from "../components/templates/contact_us/ContactUs";
import WebView from "../components/templates/web_view/WebView"
import { connect } from 'react-redux'
import {View,ActivityIndicator} from "react-native";
import color from "../theme/colors";
import font from "../theme/font";
import Realm from "realm";
import SendDelivery from "../components/templates/send_delivery/SendDelivery";
import StaffList from "../components/templates/staff_list/StaffList";
import OrderConform from "../components/templates/order_conform/OrderConform"
import DeliveryDetails from "../components/templates/delivery_details/DeliveryDetails"
import Kitchen from "../components/templates/kitchen_asign/Kitchen";
import ExpenceList from "../components/templates/expence_list/ExpenceList";
import Charges from "../components/templates/hotel_charges/Charges";
import AllInitialize from "../components/templates/all_data_initialize/AllInitialize";
import DeliveryInitialize from "../components/templates/delivery_data_initialize/DeliveryInitialize";
import KichenInitialize from "../components/templates/kitchen_data_initialize/KitchenInitialize";
import Varify from "../screens/authentication/varify/Varify";
import StaffVarify from "../components/templates/staff_number_varify/StaffVarify";
import EditOrder from "../components/templates/edit_order/EditOrder";
import Table from "../components/templates/manage_table/Table";
import Atendence from "../components/templates/staff_atendence/Atendence"
import Splash from "../components/organisms/splash_screen/Splash";
import LinkDevice from "../components/templates/link_device/LinkDevice";
import Printer from "../components/templates/printer/Printer";
import Qrcode from "../components/templates/qrcode_genaretor/Qrcode";
import Menu_access from "../components/templates/menu_access/MenuAccess"

const Stack = createNativeStackNavigator();

class StackNavigation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loader:true
        }
    }

    componentDidMount(){
      this.check_is_loged()
    }
    
    async check_is_loged(res){
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
      const tasks = realm.objects("user");
      if(tasks.length == 0){
        this.props.logout()
        this.setState({loader:false})
      }else if(tasks[0].is_loged == 1){
        global.access = tasks[0].access
        global.utoken = tasks[0].utoken
        global.rtoken = tasks[0].rtoken
        global.active_token = tasks[0].active_token
        this.props.login()
        this.setState({loader:false})
      }else{
        this.props.logout()
        this.setState({loader:false})
      }
    }
    render(){
      if(this.state.loader == true){
        return(
          <Splash/>
        )
      }else{
        return(
          <NavigationContainer>
            <Stack.Navigator screenOptions = {{headerShown: false}}>
            {
            this.props.login_status == false?
              <>
                  <Stack.Screen name="Login" component={Login}/>
                  <Stack.Screen name="AllInitialize" component={AllInitialize}/>
                  <Stack.Screen name="DeliveryInitialize" component={DeliveryInitialize}/>
                  <Stack.Screen name="KichenInitialize" component={KichenInitialize}/>
                  <Stack.Screen name="Varify" component={Varify}/>
              </>
              :
              <>
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="Menu" component={Menu} />
                  <Stack.Screen name="Orders" component={Orders} />
                  <Stack.Screen name="Sales" component={Sales}/>
                  <Stack.Screen name="Expence" component={Expence} />
                  <Stack.Screen name="Profile" component={Profile}/>
                  <Stack.Screen name="EditProfile" component={EditProfile}/>
                  <Stack.Screen name="AddProduct" component={AddProduct}/>
                  <Stack.Screen name="EditProduct" component={EditProduct}/>
                  <Stack.Screen name="ManageStaff" component={ManageStaff}/>
                  <Stack.Screen name="ManagePlan" component={ManagePlan}/>
                  <Stack.Screen name="Help" component={Help}/>
                  <Stack.Screen name="ContactUs" component={ContactUs}/>
                  <Stack.Screen name="WebView" component={WebView}/>
                  <Stack.Screen name="SendDelivery" component={SendDelivery}/>
                  <Stack.Screen name="StaffList" component={StaffList}/>
                  <Stack.Screen name="OrderConform" component={OrderConform}/>
                  <Stack.Screen name="DeliveryDetails" component={DeliveryDetails}/>
                  <Stack.Screen name="Kitchen" component={Kitchen}/>
                  <Stack.Screen name="ExpenceList" component={ExpenceList}/>
                  <Stack.Screen name="Charges" component={Charges}/>
                  <Stack.Screen name="StaffVarify" component={StaffVarify}/>
                  <Stack.Screen name="EditOrder" component={EditOrder}/>
                  <Stack.Screen name="Table" component={Table}/>
                  <Stack.Screen name="Atendence" component={Atendence}/>
                  <Stack.Screen name="LinkDevice" component={LinkDevice}/>
                  <Stack.Screen name="Printer" component={Printer}/>
                  <Stack.Screen name="Qrcode" component={Qrcode}/>
                  <Stack.Screen name="Menu_access" component={Menu_access}/>
              </>
            }
            </Stack.Navigator>
          </NavigationContainer>
        )
      }
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

export default connect(mapStateToProps,mapDispatchToProps)(StackNavigation)