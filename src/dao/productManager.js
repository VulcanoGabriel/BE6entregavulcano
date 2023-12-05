//Importamos el modelo de producto que vamos a utilizar en nuestro proyecto con mongoose y socket io desde el app

import productsModel from "./models/products.models.js";

class productManager {
  constructor() {
    this.listado = [];
  }

  addProduct = async (title, description, price, thumbnail, code, stock, category) => {


    let p = await this.getProducts()

    console.log(p)

    let totalId = (await p).length

    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status: true,
      id: totalId + 1,
    };


    try {
      if (p) {
        const data = p;
        this.listado = data;

        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
          return "Faltan parametros";
        }


        if (this.listado.some((product) => product.code === code)) {
          return `El codigo delproducto ${code} ya esta ingresado`;
        } else {
          this.listado.push(product);

          //usamos el modelo de producto para insertar productos a nuestra base de datos

          await productsModel.insertMany(product)

          return product
        }
      }
    }
    catch (e) { console.log(e) }
  };

  // PRODUCTOS OBTENIDOS CON MONGOOOSE

  getProducts = async () => {

    try {

      //usamos modelo de producto para leer nuestra base de datos , junto a lean y exec para traerlo en el formato parseado(objeto) con el que trabajamos

      const productosSi = await productsModel.find().lean().exec()

      if (productosSi) {
        this.listado = productosSi

      } else {
        return `No se encontraron productos.`
      }
      return this.listado

    }
    catch (e) { console.log(e) }

  }

  //Metodo para traer un producto de this.path por su ID ///////////////////////////////////////////////////////////////////////////////

  getProductById = async (id) => {
    try {


      // usamos el metodo ya creado para ahorrar codigo para llamar a los productos
      let productosT = await this.getProducts()

      this.listado = productosT

      const idEncontrada = this.listado.find((idE) => idE.id === id);

      if (idEncontrada) {
        return idEncontrada;
      } else {
        return `No se encontro la ID.`;
      }
    }
    catch (e) { console.log(e) }
  };

  //Metodo para actualizar un producto de this.path ////////////////////////////////////////////////////////////////////////////////////////////////

  updateProduct = async (idU, campo) => {
    try {

      let datosSi = await this.getProducts()

      if (datosSi) {
        // this.listado = datosSi;

        //  let buscado =   await productsModel.find({"id": idU})

        // console.log(buscado)
        await productsModel.updateOne({ "id": idU }, { $rename: { campo } })


      } else {
        return `No hay productos en la base de datos.`
      }
      //buscamos el ID del producto a actualizar

      // let idEncontrada2 = await this.listado.find((idE) => idE.id === idU);

      //creamos un array nuevo para poner el producto modificado

      // let newArr = await this.listado.filter((prod) => prod !== idEncontrada2);

      // console.log(newArr)

      // de existir la ID buscamos el campo a actualizar en el objeto y lo reemplazamos en la ubicacion de this.listado

      // for (let llaveCampo in campo) {
      //   if (idEncontrada2.hasOwnProperty(llaveCampo)) {
      //     idEncontrada2[llaveCampo] = campo[llaveCampo];
      //     newArr.push(idEncontrada2);
      //     this.listado = newArr;
      //     await productsModel.updateMany(this.listado) 
      //     ;
      // return `Producto ${idU} actualizado`;
      // }

      // return "producto no encontrado";
      // }

      //escribimos el arhivo con los datos de nuestro listado a su vercion final

      // await productsModel.insertMany(this.listado) ;
    }
    catch (e) { console.log(e) }
  };

  //Metodo para eliminar un producto por ID /////////////////////////////////////////////////////////////////////////////////////////

  deleteProduct = async (id) => {
    try {

      //usamos metodo que encuentra y borra un dato , le pasamos la id desde el html por el socket hasta el manager

      await productsModel.findOneAndDelete(id),

        await this.getProducts()

      return await this.getProducts()
    }
    catch (e) { console.log(e) }
  }

}

export default productManager;
