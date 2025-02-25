const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response)=>{
    const {correo, password} = req.body;

    try {

        let usuario = await Usuario.findOne({correo});
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo',           
            });
        }

        usuario = new Usuario(req.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
        
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,    
            token       
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el admin',           
        });
    }
}

const loginUsuario = async(req, res = response)=>{
    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese correo',           
            });
        }
        //confirmar los password
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto',           
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token    
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el admin',           
        });
    }

    /* res.status(200).json({
        ok: true,
        msg: 'login',
        correo,
        password
    }); */
}

const revalidarToken = async(req, res = response)=>{

    const {uid, name} = req;

    //Generar JWT
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
		uid, name,
        token
    });
}

module.exports = {
    crearUsuario, loginUsuario, revalidarToken
}