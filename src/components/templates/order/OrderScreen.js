import React from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  DeviceEventEmitter,
  Pressable,
  ScrollView,
} from 'react-native';
import color from '../../../theme/colors';
import font from '../../../theme/font';
import style from './Style';
import Heder from '../../molecules/order_header/Header';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
  AutoScroll,
} from 'recyclerlistview';
import OrderView from '../../organisms/order_view/OrderView';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from '../no_internet_view/NoInternet';
import {toast} from '../../../global_functions/toast_message/Toast';
import Icons from '../../atom/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from '@brooons/react-native-bluetooth-escpos-printer';
import RBSheet from 'react-native-raw-bottom-sheet';
import BillType from '../../molecules/bill_type/BillType';
import {
  menu_access,
  order,
} from '../../../global_functions/realm_database/Realm';
import AdminProductList from '../../organisms/admin_product_list/AdminProductList';
import ScreenFocus from '../../../global_functions/screen_focus/ScreenFocus';
import MenuButton from '../../molecules/menu_button/MenuButton';

var Sound = require('react-native-sound');
const {width, height} = Dimensions.get('window');

const filter_data = [
  {name: 'All', iconName: 'checkmark-circle', id: 0},
  {name: 'Pending', iconName: 'checkmark-circle', id: 1},
  {name: 'Paid', iconName: 'checkmark-circle', id: 2},
  {name: 'Cancelled', iconName: 'checkmark-circle', id: 3},
  {name: 'Custom', iconName: 'calendar', id: 4},
];

class OrderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: '',
      offset: 0,
      limit: 6,
      list: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      loadData: false,
      loader: true,
      order: [],
      noOrders: false,
      paginationLoader: false,
      isConnected: false,
      filter: false,
      filterType: 0,
      date: false,
      mode: 'date',
      show: false,
      emptyOrder: false,
      extendState: {blow: false, data: false, index: false},
      isPrinterConnected: false,
      print_data: [],
      btDevices: [],
      printerName: '',
      showOrderDetailS: false,
      orderData: {},
    };
    this.layoutProvider = new LayoutProvider(
      i => {
        return this.state.list.getDataForIndex(i).type;
      },
      (type, dim) => {
        dim.width = Dimensions.get('window').width;
        dim.height = Dimensions.get('window').height;
      },
    );
  }

  async componentDidMount() {
    this.checkNetInfo();
    setTimeout(() => {
      this.setState({loadData: true});
    }, 50);
    const devices = await this.checkAvailableDevice();
    this.setState({btDevices: devices});
    this.getDetailsPrint();
    this.checkIsPrinterConnected();
    this.checkConnection();
  }

  checkNetInfo = () => {
    this.unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected == true) {
        this.setState({isConnected: true, loadData: true});
      } else {
        this.setState({isConnected: false});
        toast('No internet connection 🤷‍♂️');
      }
    });
  };

  socketConnect = async () => {
    let data = {
      offset: this.state.offset,
      limit: this.state.limit,
      restaurentId: global.rtoken,
      filterType: this.state.filterType,
      date: false,
    };
    const phxChannel = global.socket.channel('order:' + global.rtoken);

    phxChannel.join().receive('ok', response => {
      this.setState({channel: phxChannel});
      if (this.state.order.length == 0) {
        phxChannel.push('getOrder', {data: data});
      }
    });

    phxChannel.on('getOrder', order => {
      if (order.data.data !== false) {
        this.loadOrderData(order.data);
      } else {
        if (this.state.order.length == 0) {
          this.setState({
            emptyOrder: true,
            noOrders: true,
            paginationLoader: false,
            loader: false,
          });
        }
        this.setState({noOrders: true, paginationLoader: false});
      }
    });

    phxChannel.on('addOrder', product => {
      if (product.product.type == 'update') {
        this.updateOrderStatus(product.product);
      } else {
        this.loadNewOrder(product.product);
        this.printKot(product.product);
      }
    });

    phxChannel.on('updateOrder', product => {
      this.realTimeUpdateOrderDetails(product.product);
    });
  };

  loadOrderData = async order => {
    for (let i = 0; i < order.length; i++) {
      let filterd_product = await this.filterProduct(order[i].product);
      if(filterd_product !== false){
      if (filterd_product.length !== 0) {
        this.state.order.push({
          type: 'NORMAL',
          item: {
            time: order[i].time,
            id: order[i].id,
            order_id: order[i].order_id,
            user_id: order[i].user_id,
            tableNumber: order[i].tableNumber,
            status: order[i].status,
            product: filterd_product,
            order_date: order[i].order_date,
            charge: order[i].charge,
            gst: order[i].gst,
          },
        });
      }

      if (i == order.length - 1) {
        this.setState({
          list: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
            this.state.order,
          ),
          loader: false,
          offset: this.state.offset + 15,
          noOrders: false,
          paginationLoader: false,
          emptyOrder: false,
        });
      }
    }else{
        this.setState({noOrders:true,paginationLoader:false})
    }
    }
    // if(filterd_product !== false){
    //         if(filterd_product.length !== 0){
    //             this.state.order.push({
    //             type: 'NORMAL',
    //             item: {
    //                 time:order.data.time,
    //                 id:order.data.id,
    //                 order_id:order.data.order_id,
    //                 user_id:order.data.user_id,
    //                 tableNumber:order.data.tableNumber,
    //                 status:order.data.status,
    //                 product:filterd_product,
    //                 order_date:order.data.order_date,
    //                 charge:order.data.charge,
    //                 gst:order.data.gst
    //             }
    //         })
    //         let data = this.state.order.filter((thing, index, self) =>
    //         index === self.findIndex((t) => (
    //             t.item.order_id === thing.item.order_id
    //         )))
    //         this.setState({list:new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data),
    //                     loader:false,offset:this.state.offset+1,noOrders:false,paginationLoader:false,
    //                     emptyOrder:false})
    //         }else {
    //             this.setState({noOrders:true,paginationLoader:false})
    //         }
    // }else{
    //     this.setState({noOrders:true,paginationLoader:false,emptyOrder:true,loader:false})
    // }
  };

  loadNewOrder = async order => {
    this.orderNotification();
    let filterd_product = await this.filterProduct(order.product);
    if (filterd_product !== false) {
      if (filterd_product.length !== 0) {
        this.state.order.unshift({
          type: 'NORMAL',
          item: {
            time: order.time,
            id:
              order.order_id[0] +
              order.order_id[1] +
              order.order_id[2] +
              order.order_id[3],
            order_id: order.order_id,
            user_id: order.user_id,
            tableNumber: order.tableNumber,
            status: order.status,
            product: filterd_product,
            order_date: order.o_date,
            charge: order.charge,
            gst: order.gst,
          },
        });
        let data = this.state.order.filter(
          (thing, index, self) =>
            index ===
            self.findIndex(t => t.item.order_id === thing.item.order_id),
        );
        this.setState({
          list: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data),
          loader: false,
          offset: this.state.offset + 1,
          noOrders: false,
          paginationLoader: false,
          emptyOrder: false,
        });
      } else {
        this.setState({
          loader: false,
          offset: this.state.offset + 1,
          noOrders: false,
          paginationLoader: false,
          emptyOrder: false,
        });
      }
    } else {
      this.setState({
        noOrders: true,
        paginationLoader: false,
        emptyOrder: true,
        loader: false,
      });
    }
  };

  pagination = async () => {
    this.setState({paginationLoader: true});
    let data = {
      offset: this.state.offset,
      limit: this.state.limit,
      restaurentId: global.rtoken,
      filterType: this.state.filterType,
      date: this.state.date,
    };
    this.state.channel.push('getOrder', {data: data});
  };

  showFilter = async () => {
    this.setState({filter: !this.state.filter});
  };

  changeFilter = type => {
    if (type !== 4) {
      this.setState({
        filterType: type,
        offset: 0,
        loader: true,
        order: [],
        filter: false,
        date: false,
      });
      let data = {
        offset: 0,
        limit: this.state.limit,
        restaurentId: global.rtoken,
        filterType: type,
        date: false,
      };
      this.state.channel.push('getOrder', {data: data});
    } else {
      this.setState({show: true});
    }
  };

  onChange = date => {
    this.setState({show: false});
    if (date.type == 'set') {
      this.state.order.splice(0, this.state.order.length);
      this.setState({
        offset: 0,
        loader: true,
        filter: false,
        date: date.nativeEvent.timestamp,
      });
      let data = {
        offset: 0,
        limit: this.state.limit,
        restaurentId: global.rtoken,
        filterType: this.state.filterType,
        date: moment(date.nativeEvent.timestamp).format('MMMM Do YYYY'),
      };
      this.state.channel.push('getOrder', {data: data});
    }
  };

  orderNotification = () => {
    var whoosh = new Sound('task.mp3', Sound.MAIN_BUNDLE, error => {
      whoosh.play(success => {});
    });
    whoosh.play();
  };

  realTimeUpdateOrderDetails = product => {
    this.orderNotification();
    for (let i = 0; i < product.product.length; i++) {
      if (product.product[i].task == 'INSERT') {
        this.inserOrderDetails(product.product[i], product.product.length);
      } else if (product.product[i].task == 'UPDATE') {
        this.updateOrderDetailsData(product.product[i], product.product.length);
      } else if (product.product[i].task == 'DELETE') {
        this.deleteOrderDetailsData(product.product[i], product.product.length);
      }

      if (i == product.product.length - 1) {
        this.updateCharges(product);
      }
    }
  };

  inserOrderDetails = async (product, count) => {
    let data = [];
    data.push({
      category_id: product.category_id,
      isVeg: product.isVeg,
      name: product.name,
      order_detail_id: product.order_detail_id,
      order_id: product.order_id,
      price: product.price,
      product_id: product.product_id,
      quantity: product.quantity,
      restaurent_id: product.restaurent_id,
      total: product.total,
    });
    let filterd_product = await this.filterProduct(data);
    if (filterd_product !== false) {
      if (filterd_product.length !== 0) {
        let index = this.state.list._data.findIndex(
          x => x.item.order_id === filterd_product[0].order_id,
        );

        this.state.list._data[index].item.product.push({
          category_id: filterd_product[0].category_id,
          isVeg: filterd_product[0].isVeg,
          name: filterd_product[0].name,
          order_detail_id: filterd_product[0].order_detail_id,
          order_id: filterd_product[0].order_id,
          price: filterd_product[0].price,
          quantity: filterd_product[0].quantity,
          product_id: filterd_product[0].product_id,
          restaurent_id: filterd_product[0].restaurent_id,
          total: filterd_product[0].quantity * filterd_product[0].price,
        });
        this.setState({
          extendState: {data: this.state.list[index], index: index, blow: true},
        });
        setTimeout(() => {
          this.setState({
            extendState: {
              data: this.state.list[index],
              index: index,
              blow: false,
            },
          });
        }, 10);
      }
    } else {
      this.setState({
        noOrders: true,
        paginationLoader: false,
        emptyOrder: true,
        loader: false,
      });
    }
  };

  updateOrderDetailsData = async product => {
    let data = [];
    data.push({
      category_id: product.category_id,
      isVeg: product.isVeg,
      name: product.name,
      order_detail_id: product.order_detail_id,
      order_id: product.order_id,
      price: product.price,
      product_id: product.product_id,
      quantity: product.quantity,
      restaurent_id: product.restaurent_id,
      total: product.total,
    });
    let filterd_product = await this.filterProduct(data);
    if (filterd_product !== false) {
      if (filterd_product.length !== 0) {
        let index = this.state.list._data.findIndex(
          x => x.item.order_id === filterd_product[0].order_id,
        );
        let pindex = this.state.list._data[index].item.product.findIndex(
          x => x.product_id === filterd_product[0].product_id,
        );
        this.state.list._data[index].item.product[pindex].quantity =
          filterd_product[0].quantity;
        this.setState({
          extendState: {data: this.state.list[index], index: index, blow: true},
        });
        setTimeout(() => {
          this.setState({
            extendState: {
              data: this.state.list[index],
              index: index,
              blow: false,
            },
          });
        }, 10);
      }
    } else {
      this.setState({
        noOrders: true,
        paginationLoader: false,
        emptyOrder: true,
        loader: false,
      });
    }
  };

  deleteOrderDetailsData = product => {
    let index = this.state.list._data.findIndex(
      x => x.item.order_id === product.order_id,
    );
    if (index !== -1) {
      let pindex = this.state.list._data[index].item.product.findIndex(
        x => x.product_id === product.product_id,
      );
      if (pindex !== -1) {
        this.state.list._data[index].item.product.splice(pindex, 1);
        this.setState({
          extendState: {data: this.state.list[index], index: index, blow: true},
        });
        setTimeout(() => {
          this.setState({
            extendState: {
              data: this.state.list[index],
              index: index,
              blow: false,
            },
          });
        }, 10);
      }
    }
  };

  updateCharges = product => {
    let index = this.state.list._data.findIndex(
      x => x.item.order_id === product.order_id,
    );
    this.state.list._data[index].item.charge = product.charge;
    this.state.list._data[index].item.tableNumber = product.tableNumber;
    this.setState({
      extendState: {data: this.state.list[index], index: index, blow: true},
    });
  };

  async checkAvailableDevice() {
    const devices = await BluetoothManager.enableBluetooth();

    return devices
      .reduce((acc, device) => {
        try {
          return [...acc, JSON.parse(device)];
        } catch (e) {
          return acc;
        }
      }, [])
      .filter(device => device.address);
  }

  getDetailsPrint = async () => {
    let schema = {
      name: 'print_details',
      properties: {
        name: 'string',
        address: 'string',
        phone: 'int',
      },
    };

    const realm = await Realm.open({
      path: 'print_details',
      schema: [schema],
    });

    const print_details = realm.objects('print_details');
    if (print_details.length !== 0) {
      this.setState({print_data: print_details});
    }
  };

  checkConnection = async () => {
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_CONNECTION_LOST,
      response => {
        if (this.state.isPrinterConnected == true) {
          this.unpairPrinter();
        }
      },
    );

    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_UNABLE_CONNECT,
      response => {
        toast('Unable to connect');
      },
    );

    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
      response => {
        toast('Not Support');
      },
    );
  };

  checkIsPrinterConnected = async () => {
    const c_device = await BluetoothManager.getConnectedDeviceAddress();
    if (c_device.length !== 0) {
      const index = this.state.btDevices.findIndex(x => x.address == c_device);
      if (index !== -1) {
        const name = this.state.btDevices[index].name;
        this.setState({isPrinterConnected: true, printerName: name});
      }
    } else {
      this.setState({isPrinterConnected: false});
    }
  };

  unpairPrinter = async () => {
    const c_device = await BluetoothManager.getConnectedDeviceAddress();
    const d_divice = await BluetoothManager.unpair(c_device);
    const index = this.state.btDevices.findIndex(x => x.address == d_divice);
    const name = this.state.btDevices[index].name;
    toast(name + ' Is Disconnected');
    this.setState({isPrinterConnected: false});
  };

  printKot = async product => {
    if (this.state.isPrinterConnected == true) {
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      {
        global.access == 'ORDER'
          ? await BluetoothEscposPrinter.printText('kitchenName' + '\n\r', {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 1,
              heigthtimes: 1,
              fonttype: 1,
            })
          : await BluetoothEscposPrinter.printText('name' + '\n\r', {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 1,
              heigthtimes: 1,
              fonttype: 1,
            });
      }

      await BluetoothEscposPrinter.printText(
        '__________________________\n\r',
        {},
      );
      await BluetoothEscposPrinter.printText('KOT\n\r', {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0.5,
        heigthtimes: 0.5,
        fonttype: 1,
      });
      await BluetoothEscposPrinter.printText(
        '...........................\n\r',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [40],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [product.time.toString()],
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1,
        },
      );
      await BluetoothEscposPrinter.printColumn(
        [30, 10],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [
          product.order_id[0] +
            product.order_id[1] +
            product.order_id[2] +
            product.order_id[3].toString(),
          'KOT',
        ],
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1,
        },
      );
      await BluetoothEscposPrinter.printColumn(
        [40],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [`Table No:${product.tableNumber}`],
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1,
        },
      );
      await BluetoothEscposPrinter.printText(
        '...........................\n\r',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [19, 8],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
        ],
        ['ITEM', 'QTY'],
        {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0.8,
          heigthtimes: 1,
          fonttype: 1,
        },
      );
      // for (let i = 0; i < product.product.length; i++) {
      //   await BluetoothEscposPrinter.printColumn(
      //     [19, 8],
      //     [
      //       BluetoothEscposPrinter.ALIGN.LEFT,
      //       BluetoothEscposPrinter.ALIGN.CENTER,
      //     ],
      //     [
      //       product.product[i].name.toString(),
      //       product.product[i].quantity.toString(),
      //     ],
      //     {
      //       encoding: 'GBK',
      //       codepage: 0,
      //       widthtimes: 0.5,
      //       heigthtimes: 0.5,
      //       fonttype: 1,
      //     },
      //   );
      //   if (i == product.product.length - 1) {
      //     await BluetoothEscposPrinter.printText(
      //       '...........................\n\r',
      //       {},
      //     );
      //     await BluetoothEscposPrinter.printText(
      //       '...........................\n\r',
      //       {},
      //     );
      //     await BluetoothEscposPrinter.printText('\n\r', {});
      //     await BluetoothEscposPrinter.printText('\n\r', {});
      //   }
      // }
    } else {
      toast('Printer not connected');
    }
  };

  showListOrUnpaired(isPrinterConnected) {
    if (isPrinterConnected) {
      this.unpairPrinter();
    } else {
      this.RBSheet.open();
    }
  }

  connectPrinter = async address => {
    await BluetoothManager.connect(address);
    const index = this.state.btDevices.findIndex(x => x.address == address);
    const name = this.state.btDevices[index].name;
    this.setState({isPrinterConnected: true, printerName: name});
    this.RBSheet.close();
    toast(name + ' Connected');
  };

  filterProduct = async product => {
    let realm = await menu_access();
    let access_data = realm.objects('menu_access');
    let filterd_product = [];
    if (access_data.length !== 0) {
      for (let i = 0; i < access_data.length; i++) {
        for (let j = 0; j < product.length; j++) {
          if (product[j].category_id == access_data[i].menu_id) {
            filterd_product.push({
              category_id: product[j].category_id,
              isVeg: product[j].isVeg,
              name: product[j].name,
              order_detail_id: product[j].order_detail_id,
              order_id: product[j].order_id,
              price: product[j].price,
              product_id: product[j].product_id,
              quantity: product[j].quantity,
              restaurent_id: product[j].restaurent_id,
              total: product[j].total,
            });
          }
        }
        if (i == access_data.length - 1) {
          return filterd_product;
        }
      }
    } else {
      return false;
    }
  };

  seeOrderDetails = (
    id,
    time,
    product,
    tableNumber,
    user_id,
    status,
    order_date,
    charge,
    gst,
    order_id,
  ) => {
    let sgst = gst / 2;
    let cgst = gst / 2;
    let gstPercentage = cgst + '%';
    let sgstPercentage = sgst + '%';
    let total = 0;
    for (let i = 0; i < product.length; i++) {
      let t = product[i].price * product[i].quantity;
      total += t;

      if (i == product.length - 1) {
        let gstCharge = (total * parseFloat(gstPercentage)) / 100;
        let sgstCharge = (total * parseFloat(sgstPercentage)) / 100;
        let Total = gstCharge + charge + total + sgstCharge;

        this.setState({
          orderData: {
            id: id,
            time: time,
            product: product,
            tableNumber: tableNumber,
            user_id: user_id,
            status: status,
            order_date: order_date,
            gst: gstCharge,
            sgst: sgstCharge,
            charge: charge,
            Total: Total,
            order_id: order_id,
          },
        });
        this.setState({showOrderDetailS: true});
      }
    }
  };

  hideOrderDetails = () => {
    this.setState({showOrderDetailS: false});
  };

  paymentConform = async (type, ordedr_id) => {
    this.hideOrderDetails();
    if (this.state.isConnected) {
      let order_data = {
        type: 'update',
        order_id: ordedr_id,
        status: type,
        restaurent_id: global.rtoken,
      };
      this.state.channel.push('updateStatus', {order_data: order_data});
    } else {
      this.setState({isConnected: false});
    }
  };

  updateOrderStatus = product => {
    this.orderNotification();
    let index = this.state.list._data.findIndex(
      x => x.item.order_id === product.order_id,
    );
    if (index !== -1) {
      this.state.list._data[index].item.status = product.status;
      this.setState({
        extendState: {data: this.state.list[index], index: index, blow: true},
      });
    }
  };

  orderNotification = () => {
    var whoosh = new Sound('when.mp3', Sound.MAIN_BUNDLE, error => {
      whoosh.play(success => {});
    });
    whoosh.play();
  };

  checkOrderUpdations = async () => {
    this.socketConnect();
    let realm = await order();

    let data = realm.objects('orders');

    for (let i = 0; i < data.length; i++) {
      let index = this.state.list._data.findIndex(
        x => x.item.order_id === data[i].order_id,
      );

      if (index !== -1) {
        this.state.list._data[index].item.charge = data[i].charge;
        this.state.list._data[index].item.tableNumber = data[i].tableNumber;
        for (let p = 0; p < data[i].orderDetails.length; p++) {
          let task = data[i].orderDetails[p].task;
          if (task == 'INSERT') {
            this.state.list._data[index].item.product.push({
              isVeg: data[i].orderDetails[p].isVeg,
              name: data[i].orderDetails[p].name,
              category_id: data[i].orderDetails[p].category_id,
              order_detail_id: data[i].orderDetails[p].order_detail_id,
              order_id: data[i].orderDetails[p].order_id,
              price: data[i].orderDetails[p].price,
              quantity: data[i].orderDetails[p].quantity,
              product_id: data[i].orderDetails[p].product_id,
              restaurent_id: global.rtoken,
              total:
                data[i].orderDetails[p].quantity *
                data[i].orderDetails[p].price,
            });
            this.setState({
              extendState: {
                data: this.state.list[index],
                index: index,
                blow: true,
              },
            });
          } else if (task == 'UPDATE') {
            let pindex = this.state.list._data[index].item.product.findIndex(
              x => x.product_id === data[i].orderDetails[p].product_id,
            );
            this.state.list._data[index].item.product[pindex].quantity =
              data[i].orderDetails[p].quantity;
            this.setState({
              extendState: {
                data: this.state.list[index],
                index: index,
                blow: true,
              },
            });
          } else if (task == 'DELETE') {
            let pindex = this.state.list._data[index].item.product.findIndex(
              x => x.product_id === data[i].orderDetails[p].product_id,
            );
            this.state.list._data[index].item.product.splice(pindex, 1);
            this.setState({
              extendState: {
                data: this.state.list[index],
                index: index,
                blow: true,
              },
            });
          }
        }

        let id = JSON.stringify(data[i].order_id);
        let deleteData = data.filtered(`order_id == ${id}`);

        realm.write(() => {
          realm.delete(deleteData);
        });
        this.orderNotification();
      }
    }
  };

  rowRenderer = (type, data, index, extendState) => {
    const {
      id,
      time,
      product,
      tableNumber,
      user_id,
      status,
      order_date,
      charge,
      gst,
      order_id,
    } = data.item;
    return (
      <View style={style.orderView}>
        <OrderView
          id={id}
          time={time}
          product={product}
          tableNumber={tableNumber}
          user_id={user_id}
          status={status}
          blow={extendState.data.blow}
          uindex={extendState.data.index}
          index={index}
          order_date={order_date}
          order_id={order_id}
          date={
            this.state.date !== false
              ? moment(this.state.date).format('MMMM Do YYYY')
              : false
          }
          seeOrderDetails={() =>
            this.seeOrderDetails(
              id,
              time,
              product,
              tableNumber,
              user_id,
              status,
              order_date,
              charge,
              gst,
              order_id,
            )
          }
        />
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View style={style.footer}>
        {this.state.paginationLoader ? (
          <ActivityIndicator color={color.secondary} size={font.size.font14} />
        ) : (
          <Text style={style.noOrderText}>No more orders</Text>
        )}
        {/* {
                    this.state.noOrders && (
                        <Text style={style.noOrderText}>No more orders</Text>
                    )
                } */}
        {this.state.isConnected == false ? (
          <Text style={style.noOrderText}>No Internet Connection 🤷‍♂️</Text>
        ) : null}
      </View>
    );
  };

  goMenuScreen = () => {
    this.props.navigation.navigate('Menu');
  };

  componentWillUnmount() {
    this.state.channel.leave();
  }

  render() {
    const {
      loadData,
      loader,
      isConnected,
      filter,
      filterType,
      show,
      mode,
      emptyOrder,
      date,
      isPrinterConnected,
      printerName,
      btDevices,
      showOrderDetailS,
      orderData,
    } = this.state;
    return (
      <View style={style.container}>
        <Heder
          headerName={'Order'}
          filter={() => this.showFilter()}
          filterType={this.state.filterType}
          date={date}
        />
        <View style={style.printerConnectionView}>
          <View
            style={[
              style.priterConnectionButton,
              {backgroundColor: isPrinterConnected ? color.green : color.gray},
            ]}>
            <Icons
              iconName={'print-outline'}
              iconSize={font.size.font16}
              iconColor={color.white}
            />
            <Text
              style={[
                style.connectText,
                {color: isPrinterConnected ? color.white : color.borderColor},
              ]}>
              {isPrinterConnected
                ? printerName + ' Connected'
                : 'Printer Not Connected'}
            </Text>
            <TouchableOpacity
              style={style.closeButton}
              onPress={() => this.showListOrUnpaired(isPrinterConnected)}>
              <Icons
                iconName={isPrinterConnected ? 'close' : 'chevron-down'}
                iconSize={font.size.font16}
                iconColor={
                  isPrinterConnected ? color.secondary : color.tertiary
                }
              />
            </TouchableOpacity>
          </View>
        </View>
        {loadData && (
          <>
            {loader ? (
              <View style={style.loader}>
                <ActivityIndicator
                  size={font.size.font14}
                  color={color.secondary}
                />
                {isConnected == false ? (
                  <Text>No Internet Connection 🤷‍♂️</Text>
                ) : null}
              </View>
            ) : emptyOrder ? (
              <View style={style.emptyOrder}>
                <Text style={style.emptyOrderText}>No Orders</Text>
              </View>
            ) : (
              <RecyclerListView
                style={style.orderListView}
                rowRenderer={this.rowRenderer}
                dataProvider={this.state.list}
                layoutProvider={this.layoutProvider}
                forceNonDeterministicRendering={true}
                canChangeSize={true}
                disableRecycling={true}
                renderFooter={this.renderFooter}
                onEndReached={this.pagination}
                initialOffset={3}
                onEndReachedThreshold={2}
                extendedState={{data: this.state.extendState}}
              />
            )}
          </>
        )}
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(Date.now())}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onchange => this.onChange(onchange)}
          />
        )}
        <ScreenFocus is_focused={() => this.checkOrderUpdations()} />
        {filter && (
          <TouchableOpacity
            style={style.filterContainer}
            onPress={() => this.showFilter()}>
            <View style={style.filterView}>
              {filter_data.map(x => (
                <TouchableOpacity
                  onPress={() => this.changeFilter(x.id)}
                  style={style.filtertView}
                  key={x.id}>
                  <Text style={style.filterText}>{x.name}</Text>
                  <Icons
                    iconName={x.iconName}
                    iconSize={font.size.font14}
                    iconColor={
                      (filterType == x.id) & (x.id < 4)
                        ? color.green
                        : x.id == 4
                        ? color.borderColor
                        : color.white
                    }
                    iconStyle={style.iconStyle}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        )}
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={height / 2}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}>
          <>
            <BillType
              btDevices={btDevices}
              setConnectedDevice={this.connectPrinter}
            />
          </>
        </RBSheet>

        {showOrderDetailS && (
          <ScrollView
            style={{
              flex: 1,
              overflow: 'scroll',
              height: height - 10,
              bottom: 0,
              position: 'absolute',
            }}>
            <Pressable
              onPress={() => this.hideOrderDetails()}
              style={{
                flex: 1,
                height: height * 1.2,
                backgroundColor: color.tranceparrent,
              }}>
              <AdminProductList
                order_id={orderData.order_id}
                time={orderData.time}
                status={orderData.status}
                product={orderData.product}
                gTotal={orderData.Total.toFixed(2)}
                id={orderData.id}
                paymentConform={this.paymentConform}
                // delivery = {delivery}
                // deliveryStaffName = {deliveryStaffName}
                // deliveryId = {deliveryId}
                // deliveryChannel = {this.state.deliveryChannel}
                // extendedState = {extendedState.data}
                gst={orderData.gst.toFixed(2)}
                sgst={orderData.sgst.toFixed(2)}
                charge={orderData.charge.toFixed(2)}
                tableNumber={orderData.tableNumber}
                btDevices={btDevices}
                print_data={this.state.print_data}
                isPrinterConnected={isPrinterConnected}
                kitchenName={this.state.kitchenName}
                user_id={orderData.user_id}
                hideOrderDetails={() => this.hideOrderDetails()}
              />
            </Pressable>
          </ScrollView>
        )}
        {global.access == 'ALL' || global.access == 'MENU' ? (
          <View style={style.menuButton}>
            <MenuButton />
          </View>
        ) : null}
      </View>
    );
  }
}

export default OrderScreen;
