import { Router } from "express"
import cartManager from "../dao/cartsManager.js"

const router = Router()

router.get("/", async (req, res) => {

    try {


        const cartm1 = new cartManager()

        let carritoTotal = await cartm1.getCarts()

        res.json(carritoTotal)
    }

    catch (e) { console.log(e) }


})


router.post("/", async (req, res) => {

    try {
        const body = req.body

        const cartM1 = new cartManager()

        await cartM1.addCart(body)

        res.json(body)
    }
    catch (e) { console.log(e) }

})

router.get("/:cid", async (req, res) => {


    try{
    const idCarrito = parseInt(req.params.cid)

    const cartM1 = new cartManager()

    let contenidoId = await cartM1.getCartId(idCarrito)

    res.json(contenidoId)
    }
    catch(e) {console.log(e);
        return res.json("no se encontro la ID") }
})



//2 si
router.put(`/:cid/product/:pid`, async (req, res) => {

    const cartM1 = new cartManager()

    const idC = parseInt(req.params.cid)

    const idP = parseInt(req.params.pid)

    const cart = cartM1.addProductCart(idC, idP)

    if (cart) { res.json(`actualizado con exito`) }

    else { res.json(`problemas al actualizar producto`) }

})

router.put(`/:cid/products/:pid`, async(req, res) => {

    const cartM1 = new cartManager()

    const idC = parseInt(req.params.cid)

    const idP = parseInt(req.params.pid)

    await cartM1.updateQ(idC, idP)


})


//si 1
router.delete(`/:cid/product/:pid`, async (req, res) => {


    try{
    const cartm1 = new cartManager()

    const idC = parseInt(req.params.cid)

    const idP = parseInt(req.params.pid)

    const delProd = await cartm1.delCartProd(idP, idC)

    if (delProd) {res.json("producto eliminado de carrito con exito")}

    else { res.json("producto inexistente")}

    }
    catch(e) {console.log(e)}


})

export default router