import productsModel from "../dao/models/products.models.js";
import { Router } from "express"
import cartManager from "../dao/cartsManager.js";


// import productManager from "../dao/productManager.js" trabajando desde FS

const router = Router()

//RENDER DESDE FS

// router.get("/", async (req, res) => {

// const pM1 = new productManager("./src/db/lista.json");

// let respuesta = await pM1.getProducts()

//     res.render(`home`, { respuesta })
// })

// router.get("/realtimeproducts", async (req, res) => {

//     res.render(`realTimeProducts`)
// })



//este archivo lo usamos para dar los renderizados a las vista en cada apartado de las url , para no saturar el app.js

//RENDER DESDE MONGOOSE

router.get("/", (req, res) => {

    res.json("todo ok")

})

router.get("/products/", async (req, res) => {

    //desde FS//////////////////////////////////////////////////////////

    // const pM1 = new productManager();

    // let respuesta = await pM1.getProducts()

    ///////////////////////////////////////////////////////////////////////////

    const limit = parseInt(req.query?.limit ?? 10)

    const page = parseInt(req.query?.page ?? 1)

    const query = (req.query?.query ?? "")

    const category = Number(req.query?.category ?? 0)

    const sort = (req.query?.sort ?? "")

    const search = {}

    try {

        if (query) search.title = { "$regex": query, "$options": "i" }
        const options = {
            page,
            limit,
            lean: true
        }

        if (category) search.category = category

        if (sort != 0) {
            options["sort"] = { price: sort == "asc" ? 1 : -1 }
        }

        const result = await productsModel.paginate(search, options)


        result.payload = result.docs

        result.query = query

        result.status = "success"

        delete result.docs

        result.sortzero = sort === "0"


        result.sortasc = sort === "asc"


        result.sortdes = sort === "des"

        console.log(result)

        res.render(`home`, result)

    }

    catch (e) { (console.log(e)), result.status = "error" }
})


//RealTime Products //////////////////////////////////////////////////////

router.get("/realtimeproducts", async (req, res) => {

    res.render(`realTimeProducts`)
})

//CHAT///////////////////////////////////////////////////////////////////

router.get("/chat", (req, res) => {

    res.render("chat", {})

})

// vista 1 carrito (haciendo)

router.get("/carts/:cid", async (req, res) => {

    let idC = parseInt(req.params.cid)

    // let search = {}

    let cam1 = new cartManager()

    let resultados = await cam1.getCartId(idC)

    console.log(resultados)

    res.render("oneC", { res: resultados.doc })



})







export default router