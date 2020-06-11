const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();



app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Usuario o contraseña invalida'
                }
            });
        }

        //let password = bcrypt.hashSync(body.password, 10);
        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Usuario o contraseña invalida'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        return res.status(200).json({
            ok: true,
            usr: usuarioDB,
            token
        });

    })
});


module.exports = app;