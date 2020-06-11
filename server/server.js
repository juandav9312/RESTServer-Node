require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configuración de rutas
app.use(require('./routes/index'));


/*let conexion = async ()=>{
    let result = await mongoose.connect('mongodb://localhost:27017/cafe', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      return result;
}

conexion().then(e =>{
    console.log(e);
}).catch(e=>{
    console.log(e);
})

mongoose.connect('mongodb://localhost:27017/cafe', (err, res)=>{
    console.log(res);
});
*/


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }, (err,res)=>{
        if(err){
            throw new Error(err);
        }else{
            console.log('Conexión establecida Mongo');
        }
  });

app.listen(process.env.PORT, ()=>{
    console.log('Escucha de puerto');
});