require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    //res.send('Hola');
    res.json('Hola');
});

app.get('/usuario', (req, res)=>{
    res.json('Hola');
});

app.post('/usuario', (req, res)=>{
    let body = req.body;

    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            msg: 'El nombre es necesario'
        });
    }else{
        res.json({
            body
        });
    }


});

app.put('/usuario/:id', (req, res)=>{
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', (req, res)=>{
    res.json('Hola');
});

app.listen(process.env.PORT);