const { database } = require('../db');

class Products {
    constructor(tabla) {
        this.connection = database;
        this.tabla = tabla;
    };


    async CreateTableProductos() {
        try {

            if (!this.connection) {

                await this.connection.schema.createTable(this.tabla, articulo => {
                    articulo.increments('id').notNullable().primary()
                    articulo.string('producto', 50).notNullable()
                    articulo.float('precio').notNullable()
                    articulo.string('thumbnail')
                });

                console.log('Table Created');
                this.connection.destroy()
            };
        } catch (err) {
            console.log(err)

        };
    };


    async insertProductos(product) {
        try {
            await this.connection(this.tabla).insert(product);
        } catch (err) {
            console.log(err)
        }
    }


    async getAll() {
        try {
            const cars = await this.connection(`${this.tabla}`).select('producto', 'precio', 'thumbnail');
            return cars

        } catch (err) {
            console.log(err)
        };
    };


    async deleteProduct(id) {
        try {
            await this.connection(this.tabla).where({ id }).del();
        } catch (err) {
            console.log(err)
        };
    };
};



module.exports = new Products('Contenedor')
