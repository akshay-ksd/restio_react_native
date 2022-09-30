import React from 'react';
import {View, Text, Dimensions, Pressable} from 'react-native';
import color from '../../../theme/colors';
import font from '../../../theme/font';
import Button from '../../atom/Button';
import style from './Style';
import moment from 'moment';
const {width, height} = Dimensions.get('window');
import * as Animatable from 'react-native-animatable';

// class OrderView extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             seeMore:this.props.product.length > 7 ? true:false
//         }
//     }

// seeMoreProduct=()=>{
//     this.setState({seeMore:!this.state.seeMore})
// }

//     render(){
//         const {seeMore} = this.state
// const {status,order_date,date,time,blow,index,uindex} = this.props
//         return(
//             <View style={[style.container,{borderColor:status == 4 ? color.gray:status == 0 ? color.white:color.white,
//                                            backgroundColor:status == 4?"#FFCCCB": status < 4 & status > 0 ? "#b8f5b5":"#FFD580"}]}>
//                 <View style={[style.header,{backgroundColor:time == date ? color.green:color.white}]}>
//                     <Text style={[style.headingText,{color:time == date ? color.white:color.darkGray}]}>{this.props.id}</Text>
//                     <Text style={[style.headingText,{color:time == date ? color.white:color.darkGray}]}>
//                         {`${new Date(order_date).getDate()}/${new Date(order_date).getMonth()}/${new Date(order_date).getFullYear()} ${new Date(order_date).getHours()} : ${new Date(order_date).getMinutes()}`}</Text>
//                 </View>

//                 <View style={[seeMore ? style.productListView1:style.productListView]}>
//                     <View style={style.productView}>
//                                     <View style={style.productNameView}>
//                                         <Text style={[style.productText,{color:color.darkGray,fontSize:font.size.font6}]}>Item</Text>
//                                     </View>
//                                     <View style={style.productCountView}>
//                                         <Text style={[style.productText,{color:color.darkGray,fontSize:font.size.font6}]}>Qnty</Text>
//                                     </View>
//                     </View>
//                     {
//                         this.props.product.map((x)=>(
//                             <View style={style.productView} key = {x.product_id}>
//                                 <View style={style.productNameView}>
//                                     <Text style={style.productText}>{x.name}</Text>
//                                 </View>
//                                 <View style={style.productCountView}>
//                                     <Text style={style.productText}>{x.quantity}</Text>
//                                 </View>
//                             </View>
//                         ))
//                     }
//                 </View>

//                <View style={style.footer}>
//                     <Text style={style.tableNumber}>{this.props.tableNumber}</Text>
//                </View>
//                <View style={style.footer}>
//                     <Text style={[style.orderPerson,{color:color.borderColor}]}>{this.props.user_id == "CO" ? "CUSTOMER  🙋‍♂️":"STAFF  👨‍💼"}</Text>
//                     {
//                         this.props.product.length > 7?
//                         <Button
//                             buttonStyle = {style.seeMore}
//                             onPress = {()=>this.seeMoreProduct()}
//                             disabled = {false}
//                             textStyle = {style.seeMoreText}
//                             text = {seeMore?"See less":`See more (${this.props.product.length-7} Item)`}
//                         />
//                         :null
//                     }

//                </View>
//                {
//                     status == 4?
//                         <View style={[style.footer,{position:'absolute',bottom:100,width:(width/2-10)}]}>
//                             <Text style={[style.tableNumber,{color:color.secondary}]}>Cancelled</Text>
//                         </View>
//                     :status > 0 & status < 4 ?
//                         <View style={[style.footer,{position:'absolute',bottom:100,width:(width/2-10)}]}>
//                             <Text style={[style.tableNumber,{color:color.green}]}>Paid</Text>
//                         </View>
//                     :null
//                }

//                {

//                }

//             </View>
//         )
//     }
// }

// export default OrderView

const OrderView = props => {
  const [seeMore, setseeMore] = React.useState(
    props.product.length > 7 ? true : false,
  );
  const {status, order_date, date, time, blow, index, uindex} = props;

  const seeMoreProduct = () => {
    setseeMore(!seeMore);
  };

  return (
    <Animatable.View
      animation="pulse"
      iterationCount={
        props.user_id == 'CO' ? (status == 0 ? 'infinite' : 1) : 1
      }
      direction={'alternate'}>
      <Pressable
        style={[
          style.container,
          {
            backgroundColor:
          status == 4
            ? "rgba(255, 99, 71, 0.4)"
            : (status < 4) & (status > 0)
            ? "rgba(20, 255, 0, 0.2)"
            : status == 5
            ? "rgba(255, 253, 194, 0.87)"
            : "rgba(228, 241, 254, 1)",
        borderColor: status == 4
        ? "rgba(255, 99, 71, 0.8)"
        : (status < 4) & (status > 0)
        ? "green"
        : status == 5
        ? "rgba(255, 244, 102, 0.87)"
        :"rgba(82, 179, 217, 1)",
          },
        ]}
        onPress={() => props.seeOrderDetails()}>
        <View
          style={[
            style.header,
            {backgroundColor: time == date ? color.green : color.white},
          ]}>
          <Text
            style={[
              style.headingText,
              {color: time == date ? color.white : color.darkGray},
            ]}>
            {props.id}
          </Text>
          <Text
            style={[
              style.headingText,
              {color: time == date ? color.white : color.darkGray},
            ]}>
            {`${new Date(order_date).getDate()}/${new Date(
              order_date,
            ).getMonth()}/${new Date(order_date).getFullYear()} ${new Date(
              order_date,
            ).getHours()} : ${new Date(order_date).getMinutes()}`}
          </Text>
        </View>

        <View
          style={[seeMore ? style.productListView1 : style.productListView]}>
          <View style={style.productView}>
            <View style={style.productNameView}>
              <Text
                style={[
                  style.productText,
                  {color: color.darkGray, fontSize: font.size.font6},
                ]}>
                Item
              </Text>
            </View>
            <View style={style.productCountView}>
              <Text
                style={[
                  style.productText,
                  {color: color.darkGray, fontSize: font.size.font6},
                ]}>
                Qnty
              </Text>
            </View>
          </View>
          {props.product.map(x => (
            <View style={style.productView} key={x.product_id}>
              <View style={style.productNameView}>
                <Text style={style.productText}>{x.name}</Text>
              </View>
              <View style={style.productCountView}>
                <Text style={style.productText}>{x.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={style.footer}>
          <Text style={style.tableNumber}>{props.tableNumber}</Text>
        </View>
        <View style={style.footer}>
          <Text style={[style.orderPerson, {color: color.borderColor}]}>
            {props.user_id == 'CO' ? 'CUSTOMER  🙋‍♂️' : 'STAFF  👨‍💼'}
          </Text>
          {props.product.length > 7 ? (
            <Button
              buttonStyle={style.seeMore}
              onPress={() => seeMoreProduct()}
              disabled={false}
              textStyle={style.seeMoreText}
              text={
                seeMore
                  ? 'See less'
                  : `See more (${props.product.length - 7} Item)`
              }
            />
          ) : null}
        </View>
        {status == 4 ? (
          <View
            style={[
              style.footer,
              {position: 'absolute', bottom: 100, width: width / 2 - 10},
            ]}>
            <Text style={[style.tableNumber, {color: color.secondary}]}>
              Cancelled
            </Text>
          </View>
        ) : (status > 0) & (status < 4) ? (
          <View
            style={[
              style.footer,
              {position: 'absolute', bottom: 100, width: width / 2 - 10},
            ]}>
            <Text style={[style.tableNumber, {color: color.green}]}>Paid</Text>
          </View>
        ) : status == 5 ? (
          <View
            style={[
              style.footer,
              {position: 'absolute', bottom: 100, width: width / 2 - 10},
            ]}>
            <Text style={[style.tableNumber, {color: color.black}]}>
              Preparing
            </Text>
          </View>
        ) : null}

        {}
      </Pressable>
    </Animatable.View>
  );
};

export default React.memo(OrderView);
