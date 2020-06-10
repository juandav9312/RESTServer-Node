const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore'); //libreria para funciones de JS como filtar campos de objetos
const Usuario = require('../models/usuario');

app.get('/', (req, res)=>{
    //res.send('Hola');
    res.json('Hola');
});

app.get('/usuario', (req, res)=>{
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({estado: true}, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((err,usuarios)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Usuario.count({estado: true}, (err,count)=>{
            res.status(200).json({
                ok: true,
                usuarios: usuarios,
                count
            });
        });

    });
});

app.post('/usuario', (req, res)=>{
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role,
    });

    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });
    });

});


app.put('/usuario/:id', (req, res)=>{
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

app.delete('/usuario/:id', (req, res)=>{
        let id = req.params.id;
        //let body = _.pick(req.body, ['estado']);
        //Usuario.findByIdAndRemove(id, (err,usuarioDB)=>{
        Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, usuarioDB)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })

});


module.exports = app;
