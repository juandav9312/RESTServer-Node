const jwt = require('jsonwebtoken');

let verificaToken = ( req, res, next ) =>{
    let token = req.get('token'); // header token

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
}

let verificaAdminRol = ( req, res, next ) =>{
    let usuario = req.usuario;
    if(usuario.role !== 'ADMIN_ROLE'){
        return res.status(400).json({
            ok: false,
            err: 'Permisos insuficientes'
        });
    }

    next();
    return;
}

module.exports = {
    verificaToken,
    verificaAdminRol
}