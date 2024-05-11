var db = require("../config/connection");
var collections = require("../config/collections");
const bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;
const Razorpay = require("razorpay");
const nodemailer = require('nodemailer');

var instance = new Razorpay({
  key_id: "rzp_test_8NokNgt8cA3Hdv",
  key_secret: "xPzG53EXxT8PKr34qT7CTFm9",
});

module.exports = {
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collections.PRODUCTS_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },

  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Insert user data into the database
        let user = await db.get().collection(collections.USERS_COLLECTION).insertOne(userData);

        // Send email to admin
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'madrasathulfurqaninternational@gmail.com',  // Replace with your admin email
            pass: 'cecbuirhobayeouj'
            // buekcxygvhmrqska

            // Replace with your admin email password or app password
          }
        });

        const mailOptions = {
          from: userData.email,
          to: 'madrasathulfurqaninternational@gmail.com',   // Replace with your actual admin email
          subject: 'New User Registration',
          html: `
          <center><h4>Madrasathulfurqan international online Madrassa Admission form 2023-24</h4></center>
            <table style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr style="background-color: #000000;">
                    <th style="border: 1px solid #dddddd; text-align: left; padding: 5px; color:white;">Title</th>
                    <th style="border: 1px solid #dddddd; text-align: left; padding: 5px; color:white;">Data</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Full Name</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.fname} ${userData.lname}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Date of birth</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.dob}</td>
                </tr>
                <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Age of the Student</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.age}</td>
            </tr>
            <tr>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Gender</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.Gender}</td>
        </tr>
        <tr>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Father's Name</td>
        <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.father}</td>
    </tr>
    <tr>
    <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Mother's Name</td>
    <td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.mother}</td>
</tr>
<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Occupation</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.occ}</td>
</tr>
<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Name of the guardian and address</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.gname}, ${userData.gaddress}, ${userData.gcity}, ${userData.gstate}, ${userData.gcountry}</td>
</tr>
<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Phone</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.mobile}</td>
</tr>
<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Whatsapp</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.whatsapp}</td>
</tr>
<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Mother Tongue</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.tongue}</td>
</tr>

<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Residential Address</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.address1}, ${userData.address2}, ${userData.city}, ${userData.state}, ${userData.zipcode}</td>
</tr>

<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Student E-mail</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.email}</td>
</tr>

<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Class in which admission sought</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.admission}</td>
</tr>

<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Type a question</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">${userData.qtype}</td>
</tr>

<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Agreement</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">
Name : ${userData.afname} ${userData.alname}<br>
Date : ${userData.adate}<br>
Place : ${userData.aplace}
</td>
</tr>

<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Student Photo</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">
<a href="http://localhost:1000/images/user-profiles/${userData.avatar}" target="_blank">View Student Photo</a></td>
</tr>

<tr>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">Student Signature</td>
<td style="border: 1px solid #dddddd; text-align: left; padding: 5px;">
<a href="${userData.signature}" target="_blank">View Student Signature</a></td>
</tr>



              
               
            </tbody>
        </table>
    </body>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });

        resolve(user.ops[0]);
      } catch (error) {
        console.error('Error signing up:', error);
        reject(error);
      }
    });
  },

  doSignin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collections.USERS_COLLECTION)
        .findOne({ Email: userData.Email });
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failed");
        resolve({ status: false });
      }
    });
  },

  addToCart: (productId, userId) => {
    console.log(userId);
    let productObject = {
      item: objectId(productId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (userCart) {
        let productExist = userCart.products.findIndex(
          (products) => products.item == productId
        );
        console.log(productExist);
        if (productExist != -1) {
          db.get()
            .collection(collections.CART_COLLECTION)
            .updateOne(
              { user: objectId(userId), "products.item": objectId(productId) },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve();
            });
        } else {
          db.get()
            .collection(collections.CART_COLLECTION)
            .updateOne(
              { user: objectId(userId) },
              {
                $push: { products: productObject },
              }
            )
            .then((response) => {
              resolve();
            });
        }
      } else {
        let cartObject = {
          user: objectId(userId),
          products: [productObject],
        };
        db.get()
          .collection(collections.CART_COLLECTION)
          .insertOne(cartObject)
          .then((response) => {
            resolve();
          });
      }
    });
  },

  getCartProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCTS_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      // console.log(cartItems);
      resolve(cartItems);
    });
  },

  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (cart) {
        var sumQuantity = 0;
        for (let i = 0; i < cart.products.length; i++) {
          sumQuantity += cart.products[i].quantity;
        }
        count = sumQuantity;
      }
      resolve(count);
    });
  },

  changeProductQuantity: (details) => {
    details.count = parseInt(details.count);
    details.quantity = parseInt(details.quantity);

    return new Promise((resolve, reject) => {
      if (details.count == -1 && details.quantity == 1) {
        db.get()
          .collection(collections.CART_COLLECTION)
          .updateOne(
            { _id: objectId(details.cart) },
            {
              $pull: { products: { item: objectId(details.product) } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        db.get()
          .collection(collections.CART_COLLECTION)
          .updateOne(
            {
              _id: objectId(details.cart),
              "products.item": objectId(details.product),
            },
            {
              $inc: { "products.$.quantity": details.count },
            }
          )
          .then((response) => {
            resolve({ status: true });
          });
      }
    });
  },

  removeCartProduct: (details) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.CART_COLLECTION)
        .updateOne(
          { _id: objectId(details.cart) },
          {
            $pull: { products: { item: objectId(details.product) } },
          }
        )
        .then(() => {
          resolve({ status: true });
        });
    });
  },

  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCTS_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", "$product.Price"] } },
            },
          },
        ])
        .toArray();
      console.log(total[0].total);
      resolve(total[0].total);
    });
  },

  getCartProductList: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      resolve(cart.products);
    });
  },

  placeOrder: (order, products, total, user) => {
    return new Promise(async (resolve, reject) => {
      console.log(order, products, total);
      let status = order["payment-method"] === "COD" ? "placed" : "pending";
      let orderObject = {
        deliveryDetails: {
          mobile: order.mobile,
          address: order.address,
          pincode: order.pincode,
        },
        userId: objectId(order.userId),
        user: user,
        paymentMethod: order["payment-method"],
        products: products,
        totalAmount: total,
        status: status,
        date: new Date(),
      };
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .insertOne({ orderObject })
        .then((response) => {
          db.get()
            .collection(collections.CART_COLLECTION)
            .removeOne({ user: objectId(order.userId) });
          resolve(response.ops[0]._id);
        });
    });
  },

  getUserOrder: (userId) => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collections.ORDER_COLLECTION)
        .find({ "orderObject.userId": objectId(userId) })
        .toArray();
      // console.log(orders);
      resolve(orders);
    });
  },

  getOrderProducts: (orderId) => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collections.ORDER_COLLECTION)
        .aggregate([
          {
            $match: { _id: objectId(orderId) },
          },
          {
            $unwind: "$orderObject.products",
          },
          {
            $project: {
              item: "$orderObject.products.item",
              quantity: "$orderObject.products.quantity",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCTS_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      resolve(products);
    });
  },

  generateRazorpay: (orderId, totalPrice) => {
    return new Promise((resolve, reject) => {
      var options = {
        amount: totalPrice * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        console.log("New Order : ", order);
        resolve(order);
      });
    });
  },

  verifyPayment: (details) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "xPzG53EXxT8PKr34qT7CTFm9");

      hmac.update(
        details["payment[razorpay_order_id]"] +
        "|" +
        details["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");

      if (hmac == details["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },

  changePaymentStatus: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              "orderObject.status": "placed",
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },

  cancelOrder: (orderId) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .removeOne({ _id: objectId(orderId) })
        .then(() => {
          resolve();
        });
    });
  },

  searchProduct: (details) => {
    console.log(details);
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .createIndex({ Name: "text" }).then(async () => {
          let result = await db
            .get()
            .collection(collections.PRODUCTS_COLLECTION)
            .find({
              $text: {
                $search: details.search,
              },
            })
            .toArray();
          resolve(result);
        })

    });
  },
};
