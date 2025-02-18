const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const router = Router();
/* 
Event Routes
/api/events
*/
//Todas las rutas deben de validar el JWT
router.use(validarJWT);

//Obtener eventos y deben pasar por la validacion del JWT
router.get('/', getEventos);

//Crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha fin es obligatoria').custom(isDate),
        validarCampos
    ],
     crearEvento
);

//Actualizar un evento
router.put('/:id', actualizarEvento);

//Borrar un evento
router.delete('/:id', eliminarEvento);

module.exports = router;