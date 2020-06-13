const express = require('express');
const {verificaToken, verificaAdminRol} = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');


app.get('/categoria', verificaToken, (req, res)=>{
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categoriaDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            categorias: categoriaDB
        });

    });
});

app.get('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    Categoria.findById({_id: id}, (err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            categorias: categoriaDB
        });

    });
});


app.post('/categoria', verificaToken, (req, res)=>{
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


app.put('/categoria/:id', [verificaToken, verificaAdminRol], (req, res)=>{
    let id = req.params.id;
    let body = req.body;
    console.log(body.descripcion);
    let desCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, desCategoria, {new: true, runValidators: true, context: 'query'}, (err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });

    });
});


app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res)=>{
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'ID No existente'
                }
            });
        }

        return res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });

    });
});



module.exports = app;