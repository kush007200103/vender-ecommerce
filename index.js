const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
const PORT = process.env.PORT || 8080;
const Stripe =require('stripe')
// MongoDB connection
console.log(process.env.MONGODB_URL);
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

// User schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  image: String,
  confirmPassword: String,
});

// User model
const userModel = mongoose.model("users", userSchema);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Sign up route
app.post("/SignUp", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userModel.findOne({ email: email });

    if (result) {
      res.send({ message: "Email is already registered" });
    } else {
      const data = new userModel(req.body);
      await data.save();
      res.send({ message: "Email registered successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to register email" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userModel.findOne({ email: email });

    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      res.send({ message: "Login successful", alert: true, data: dataSend });
    } else {
      res.status(404).send({ message: "This ID is not registered", alert: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to process login" });
  }
});

// Product schema
const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});

// Product model
const productModel = mongoose.model("product", schemaProduct);

// Upload product route
app.post("/uploadProduct", async (req, res) => {
  try {
    const data = new productModel(req.body);
    await data.save();
    res.send({ message: "Product uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to upload product" });
  }
});

// Get all products route
app.get("/product", async (req, res) => {
  try {
    const data = await productModel.find({});
    res.send(JSON.stringify(data));
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to fetch products" });
  }
});

// 
app.get("/product",async(req,res)=>{
  const data =await productModel.find({}).toArray()
  res.send(JSON.stringify(data))
})

// payment gateway
console.log(process.env.STRIPE_SECRET_KEY)


const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY)

app.post("/create-checkout-session",async(req,res)=>{

     try{
      const params = {
          submit_type : 'pay',
          mode : "payment",
          payment_method_types : ['card'],
          billing_address_collection : "auto",
          shipping_options : [{shipping_rate : "shr_1NUoDySHdvcFIFNJRdNES2GQ"}],

          line_items : req.body.map((item)=>{
            return{
              price_data : {
                currency : "inr",
                product_data : {
                  name : item.name,
                  // images : [item.image]
                },
                unit_amount : item.price * 100,
              },
              adjustable_quantity : {
                enabled : true,
                minimum : 1,
              },
              quantity : item.qty
            }
          }),

          success_url : `${process.env.FRONTEND_URL}/success`,
          cancel_url : `${process.env.FRONTEND_URL}/cancel`,

      }

      
      const session = await stripe.checkout.sessions.create(params)
      // console.log(session)
      res.status(200).json(session.id)
     }
     catch (err){
        res.status(err.statusCode || 500).json(err.message)
     }

})

// Start the server
app.listen(PORT, () => console.log("Server is running on port: " + PORT));
