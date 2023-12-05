import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

    id: Number,
    products: []

})

const cartModel = mongoose.model("carts", cartSchema )

export default cartModel