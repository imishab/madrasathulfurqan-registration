var express = require("express");
var userHelper = require("../helper/userHelper");
var router = express.Router();
const path = require('path');


const verifySignedIn = (req, res, next) => {
  if (req.session.signedIn) {
    next();
  } else {
    res.redirect("/signup");
  }
};

/* GET home page. */
router.get("/", async function (req, res, next) {
  let user = req.session.user;
  userHelper.getAllProducts().then((products) => {
    res.render("users/home", { admin: false, products, user, layout: "empty" });
  });
});

router.get("/registered", function (req, res, next) {
  let user = req.session.user;
  res.render("users/registered", { admin: false, user, layout: "empty" });
});

router.get("/profile", verifySignedIn, function (req, res, next) {
  let user = req.session.user;
  res.render("users/profile", { admin: false, user, layout: "empty" });
});

// Route for displaying the signup form
router.get("/signup", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/signup", { admin: false, layout: "empty" });
  }
});



// Route for handling form submission
router.post("/signup", function (req, res) {
  // Handle photo upload
  if (!req.files || !req.files.avatar) {
    // Handle case where no file is uploaded
    // Redirect back to the signup form with an error message
    res.render("users/signup", { admin: false, layout: "empty", error: "Please upload an image." });
    return;
  }

  let avatar = req.files.avatar;
  let signature = req.body.signature; // Get signature data from the form

  // Move the uploaded image to the destination directory
 

    // Proceed with user signup after successful file upload
    userHelper.doSignup(req.body, signature).then((response) => {
      console.log(response,"resssp")
      req.session.signedIn = true;
      req.session.user = response;
      avatar.mv("./public/images/user-profiles/" + response._id+".png", function (err) {
        if (err) {
          console.log(err);
          // Handle error (e.g., show an error message to the user)
          return;
        }
    
      })
      res.redirect("/registered");
    });

});


// router.post("/signup", function (req, res) {
//   if (!req.files || !req.files.avatar) {

//     res.render("users/signup", { admin: false, layout: "empty", error: "Please upload an image." });
//     return;
//   }

//   let avatar = req.files.avatar;
//   let signature = req.body.signature; 

//   avatar.mv("./public/images/user-profiles/" + avatar.name, function (err) {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     userHelper.doSignup(req.body, signature).then((response) => {
//       req.session.signedIn = true;
//       req.session.user = response;
//       res.render("/registered", { avatarName: avatar.name });
//     });
//   });
// });




router.get("/signin", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/signin", {
      admin: false,
      layout: "empty",
      signInErr: req.session.signInErr,
    });
    req.session.signInErr = null;
  }
});

router.post("/signin", function (req, res) {
  userHelper.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.signedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.signInErr = "Invalid Email/Password";
      res.redirect("/signin");
    }
  });
});

router.get("/signout", function (req, res) {
  req.session.signedIn = false;
  req.session.user = null;
  res.redirect("/");
});

router.get("/cart", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  let cartProducts = await userHelper.getCartProducts(userId);
  let total = null;
  if (cartCount != 0) {
    total = await userHelper.getTotalAmount(userId);
  }
  res.render("users/cart", {
    admin: false,
    user,
    cartCount,
    cartProducts,
    total,
  });
});

router.get("/add-to-cart/:id", function (req, res) {
  console.log("api call");
  let productId = req.params.id;
  let userId = req.session.user._id;
  userHelper.addToCart(productId, userId).then(() => {
    res.json({ status: true });
  });
});

router.post("/change-product-quantity", function (req, res) {
  console.log(req.body);
  userHelper.changeProductQuantity(req.body).then((response) => {
    res.json(response);
  });
});

router.post("/remove-cart-product", (req, res, next) => {
  userHelper.removeCartProduct(req.body).then((response) => {
    res.json(response);
  });
});

router.get("/place-order", verifySignedIn, async (req, res) => {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  let total = await userHelper.getTotalAmount(userId);
  res.render("users/place-order", { admin: false, user, cartCount, total });
});

router.post("/place-order", async (req, res) => {
  let user = req.session.user;
  let products = await userHelper.getCartProductList(req.body.userId);
  let totalPrice = await userHelper.getTotalAmount(req.body.userId);
  userHelper
    .placeOrder(req.body, products, totalPrice, user)
    .then((orderId) => {
      if (req.body["payment-method"] === "COD") {
        res.json({ codSuccess: true });
      } else {
        userHelper.generateRazorpay(orderId, totalPrice).then((response) => {
          res.json(response);
        });
      }
    });
});

router.post("/verify-payment", async (req, res) => {
  console.log(req.body);
  userHelper
    .verifyPayment(req.body)
    .then(() => {
      userHelper.changePaymentStatus(req.body["order[receipt]"]).then(() => {
        res.json({ status: true });
      });
    })
    .catch((err) => {
      res.json({ status: false, errMsg: "Payment Failed" });
    });
});

router.get("/order-placed", verifySignedIn, async (req, res) => {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  res.render("users/order-placed", { admin: false, user, cartCount });
});

router.get("/orders", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  let orders = await userHelper.getUserOrder(userId);
  res.render("users/orders", { admin: false, user, cartCount, orders });
});

router.get(
  "/view-ordered-products/:id",
  verifySignedIn,
  async function (req, res) {
    let user = req.session.user;
    let userId = req.session.user._id;
    let cartCount = await userHelper.getCartCount(userId);
    let orderId = req.params.id;
    let products = await userHelper.getOrderProducts(orderId);
    res.render("users/order-products", {
      admin: false,
      user,
      cartCount,
      products,
    });
  }
);

router.get("/cancel-order/:id", verifySignedIn, function (req, res) {
  let orderId = req.params.id;
  userHelper.cancelOrder(orderId).then(() => {
    res.redirect("/orders");
  });
});

router.post("/search", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = await userHelper.getCartCount(userId);
  userHelper.searchProduct(req.body).then((response) => {
    res.render("users/search-result", { admin: false, user, cartCount, response });
  });
});

module.exports = router;
