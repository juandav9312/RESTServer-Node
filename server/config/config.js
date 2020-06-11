process.env.PORT = process.env.PORT || 3000;

//=====================================
//             ENTORNO
//=====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================================
//             BD
//=====================================

if(process.env.NODE_ENV == 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;

//=====================================
//             TOKEN VENCIMIENTO
//=====================================

process.env.CADUCIDAD_TOKEN = 60*60*24*30;


//=====================================
//             SECRETO
//=====================================

process.env.SEED = process.env.SEED ||'este-es-secret-desarrollo';
