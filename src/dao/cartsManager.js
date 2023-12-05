import cartModel from "./models/cart.models.js"

class cartManager {

    constructor() {
        this.lista = []
    }

    getCarts = async () => {
        try {
            //buscamos si existe el documento con los datos

            let carritoSi = await cartModel.find()

            if (carritoSi) {

                //de la constante pasamos el contenido a this.lista en formato javascript

                this.lista = carritoSi
            }

            //de no existir el archivo escribimos el mismo con el contenido de this.lista

            else { return "No hay carritos en la base de datos" }

            //devolvemos el contenido de los carritos para usarlo en los proximos metodos

            return this.lista
        }

        catch (e) { return console.log(e) }
    }

    addCart = async (body) => {

        //usamos el metodo para traer todos los carritos

        let carritoId = await this.getCarts()

        //contamos la totalidad de carritos para darle un id que no se repita

        let carritoL = await carritoId.length

        //creamos un objeto molde para darle una id y un array nuevo por dentro para agregar productos proximamente al carrito

        const carritoMolde = {

            id: carritoL + 1,
            products: body.map(p => ({product: p.id}))
        }

        // traemos los carritos , y le agregamos el objeto nuevo lo escribimos en el archivo principal
        try {
            if (carritoId) {

                await cartModel.insertMany([carritoMolde])

            } 
        }
        catch (error) {
            console.error(error);
            return `No se pudo agregar el carrito o el producto.`;
        }
    }

    getCartId = async (id) => {

        try{
        let obtenerCarrito = await this.getCarts()

        this.lista = obtenerCarrito

        //de todos los carritos encontramos el que coincida por ID

        let encontrarCarrito = await this.lista.find((f) => f.id === id)


        if (encontrarCarrito) { return encontrarCarrito }

        //sino encontramos el carrito >>>>
         else { return `carrito no encontrado por ID`}
        

        }
    catch (e) {console.log(e)
    }
    }

    delCartProd = async (pid, cid) => {

        try{

            //usamos updateOne para actualizar datos en un documento en este caso borrar uno en especifico
            //le decimos que busque el id del primer array que son los carritos que coincida con el pasado desde router.cart por url


        await cartModel.updateOne({id: cid},
            
            //como segundo parametro le decimos lo que queremos hacer en este caso pull , borrar un dato de el array products el id que coincida por el pasado desde 
            //router.cart por url 

            {$pull: {products: {id: pid}}}
            
            )

    }
    catch(e) {console.log(e)}

}



    addProductCart = async (carritoNum, productoId) => {

        try{
        let carritoId = await this.getCartId(carritoNum)

        if (!carritoId) return (`no se encontro el carrito por el ID ingresado`)

        let productoEncontrado = carritoId.products.find(item => item.product === productoId)

        if (productoEncontrado) {

            await cartModel.updateMany({id: carritoNum, 'products.product': productoId},
                {$inc:  {'products.$.quantity': 1}}
                
                )

        } else {

            await cartModel.updateOne({id: carritoNum},
                    {$push: {products: {product: productoId, quantity: 1}}}
                
                )

        }
       
    }
    catch(e) {console.log(e)}

}
    


}

export default cartManager