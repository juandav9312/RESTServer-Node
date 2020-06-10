const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email obligatorio']
    },
    password: {
        type: String,
        required: [true, 'Obligatorio']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        required: true,
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//METODO PARA NO IMPRIMIR CONTRASEÑA DEL USUARIO
usuarioSchema.methods.toJSON = function(){

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//METODO PARA AGREGAR MENSAJES A LOS VALIDADORES
usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);