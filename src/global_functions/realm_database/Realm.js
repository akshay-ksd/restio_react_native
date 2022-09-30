import Realm from "realm";

export const create_schema =async(data)=>{
    const schema = data

    const realm = await Realm.open({
        schema: [schema]
    })
    return realm
}

export const write_data =(schema_name,data)=>{
    Realm.create("user", {
        _id: 1,
        name: "go grocery shopping",
        status: "Open",
      });
}

export const orderMasterSchema =async()=>{
    let ParentSchema = {
        name:"order_master",
        properties:{
            order_id:"string",
            time:"string",
            status:"int",
            user_id:"string",
            date:"date",
            is_upload:"int",
            gst:"int",
            sgst:"int",
            charge:"int",
            tableNumber:"int",
            orderDetails:{type: 'list', objectType: 'order'}
        }
    };

    let childSchema = {
        name:"order",
        embedded: true,
        properties:{
            order_detail_id:"string",
            order_id:"string",
            product_id:"string",
            quantity:"int",
            price:"int",
            name:{ type: "string", default: "0" },
            isVeg:{ type: "int", default: 0 }
        }
    };
    let realm;
    return realm = await Realm.open({
                    path: "order_master",
                    schema: [childSchema, ParentSchema]
    })
}

export const menu_access =async()=>{
    let schema = {
        name:'menu_access',
        properties:{
            menu_id:"string",
            menu_name:"string"
        }
    }

    let realm;
    return realm = await Realm.open({
                    path: "order_master",
                    schema: [schema]
    })
}

export const cart =async()=>{
    let schema = {
        name:"cart",
        properties:{
            order_id:"string",
            product_id:"string",
            category_id:"string",
            quantity:"int",
            price:"int",
            name:"string",
            isVeg:"int"
        }
    };
    let realm;
    return realm = await Realm.open({
                    path: "cart",
                    schema: [schema]
    })
}

export const order =async()=>{
    let ParentSchema = {
        name:"orders",
        properties:{
            order_id:"string",
            charge:"int",
            tableNumber:"string",
            orderDetails:{type: 'list', objectType: 'order_details'}
        }
    };

    let childSchema = {
        name:"order_details",
        embedded: true,
        properties:{
            order_detail_id:"string",
            category_id:"string",
            order_id:"string",
            product_id:"string",
            quantity:"int",
            price:"int",
            restaurent_id:"string",
            name:{ type: "string", default: "0" },
            isVeg:{ type: "int", default: 0 },
            task:"string",
        }
    };
    let realm;
    return realm = await Realm.open({
                    path: "orders",
                    schema: [childSchema, ParentSchema]
    })
}