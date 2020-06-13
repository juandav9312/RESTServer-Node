const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'descripción obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario'
    }
});

//METODO PARA AGREGAR MENSAJES A LOS VALIDADORES
categoriaSchema.plugin(uniqueValidator,{message: '{PATH} debe ser único'});

module.exports = mongoose.model('Categoria', categoriaSchema);