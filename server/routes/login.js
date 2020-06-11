const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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


//configuraciones de google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req,res) =>{
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(err=>{
        return res.status(403).json({
            ok: false,
            err
        });
    });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( usuarioDB ){

            if( usuarioDB.google === false ){
                return res.status(400).json({
                    ok: false,
                    err: {
                        mgs: 'Debe usar sus credenciales'
                    }
                });
            } else {
                
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
    
                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }

        } else {
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = '=)';

            usuario.save((err,usuarioDB)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
    
                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });


            });

        }


    });
})


module.exports = app;