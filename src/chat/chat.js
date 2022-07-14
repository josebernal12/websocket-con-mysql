const { databaseSqlite } = require('../db')


class chat {
    constructor(tabla) {
        this.connection = databaseSqlite;
        this.tabla = tabla;
    };


    async CreateTableChat() {
        try {

            if (!this.connection) {

                await this.connection.schema.createTable(this.tabla, mensajes => {
                    mensajes.increments('id').notNullable().primary()
                    mensajes.string('username', 50).notNullable()
                    mensajes.string('mensaje').notNullable()
                    mensajes.float('resultado')
                    mensajes.float('time')
                });

                console.log('Table Created');
                this.connection.destroy()
            };
        } catch (err) {
            console.log(err)

        };
    };


    async insertMessages(product) {
        try {
            await this.connection(this.tabla).insert(product);
        } catch (err) {
            console.log(err)
        }
    }


    async getAll() {
        try {
            const cars = await this.connection(`${this.tabla}`).select('username', 'mensaje', 'resultado', 'time');
            return cars

        } catch (err) {
            console.log(err)
        };
    };

}

module.exports = new chat('ContenedorChat')