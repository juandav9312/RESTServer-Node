const express = require('express');
const {verificaToken} = require('../middlewares/autenticacion');
const app = express();

let Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) =>{
    let desde = Number(req.query.desde) || 0;
    Producto.find({disponible: true})
    .skip(desde)
    .limit(5)
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });   
        }

        return res.status(200).json({
            ok: true,
            producto: productoDB
        });
    });
});


app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    
    Producto.find({nombre: regex})
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El producto no existe'
                }
            });   
        }

        return res.status(200).json({
            ok: true,
            producto: productoDB
        });


    })

});



app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    
    Producto.findById(id)
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El producto no existe'
                }
            });   
        }

        return res.status(200).json({
            ok: true,
            producto: productoDB
        });


    })

});


app.post('/producto', verificaToken, (req, res)=>{
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario
    });

    producto.save((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});


app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let update = {
        nombre: body.nombre,
        disponible: body.disponible
    }
    
    Producto.findByIdAndUpdate(id, update, {new: true, runValidators: true}, (err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El producto no existe'
                }
            });   
        }

        return res.status(200).json({
            ok: true,
            producto: productoDB
        });

        // productoDB.save  actualizar campo por campo


    })

});


app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let disponible = {
        disponible: false
    }
    
    Producto.findByIdAndUpdate(id, disponible, {new: true, runValidators: true}, (err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El producto no existe'
                }
            });   
        }

        return res.status(200).json({
            ok: true,
            producto: productoDB,
            msg: 'Producto eliminado'
        });


    })

});


module.exports = app;