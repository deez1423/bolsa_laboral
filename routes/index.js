var express = require('express');
var router = express.Router();
/* aqui requiere la base de datos */
var dbConn = require('../lib/db');
const ejs = require('ejs');

/* GET home page. */
/* esto es para la base de datos de los cards jala los datos de las ofertas */
router.get('/', function (req, res, next) {
  dbConn.query('SELECT ol_id,date_format(ol_fecha_inicio_laborales, "%d-%m-%Y") as ol_fecha_inicio_laborales,date_format(ol_fecha_inicio_convocatoria, "%d-%m-%Y") as ol_fecha_inicio_convocatoria,date_format(ol_fecha_fin, "%d-%m-%Y") as ol_fecha_fin,ol_titulo,ol_descripcion,ol_horario,ol_salario,ol_estado,u.usu_nombre_razon_social,u.usu_usuario FROM oferta_laboral ol, empresas e , usuario u WHERE e.em_id=ol.ol_em_id AND u.usu_id=e.em_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('index', { data: '' });
    } else {
      res.render('index', { data: rows });
    }
  });
});
router.get('/oferta', function (req, res, next) {
  dbConn.query('SELECT ol_id,date_format(ol_fecha_inicio_laborales, "%d-%m-%Y") as ol_fecha_inicio_laborales,date_format(ol_fecha_inicio_convocatoria, "%d-%m-%Y") as ol_fecha_inicio_convocatoria,date_format(ol_fecha_fin, "%d-%m-%Y") as ol_fecha_fin,ol_titulo,ol_descripcion,ol_horario,ol_salario,ol_estado,u.usu_nombre_razon_social,u.usu_usuario FROM oferta_laboral ol, empresas e , usuario u WHERE e.em_id=ol.ol_em_id AND u.usu_id=e.em_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('ofertas', { data: '' });
    } else {
      res.render('ofertas', { data: rows });
    }
  });
});
router.get('/nosotros', function (req, res, next) {
      res.render('nosotros');
});
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  email = req.body.email;
  password = req.body.password;
  console.log(email);
  dbConn.query("SELECT * FROM usuario WHERE usu_correo='" + email + "' AND usu_password='" + password + "'", function (err, rows) {

    if (err) {
      req.flash('error', err);
      console.log(err);
    } else {
      console.log(rows);
      if (rows.length) {
        nombre = rows[0]["usu_nombre_razon_social"];
        console.log(nombre);
        req.session.idu = rows[0]["usu_id"];
        req.session.user = rows[0]["usu_nombre_razon_social"];
        req.session.email = rows[0]["usu_correo"];
        req.session.admin=true;
        res.redirect("/admin");
      } else {
        res.redirect("/");
      }
    } });

  });


router.get('/admin', function (req, res, next) {
    if (req.session.admin) {
      res.render('admin/index');
    }else{
      res.redirect("/login");
    }
});

router.get('/logout',function(req,res){
    req.session.destroy();
    res.redirect("/");
});

// Añadir usuario
router.post('/usuario-add', function (req, res, next) {

  let nombre = req.body.nombre;
  let dni = req.body.dni;
  let correo = req.body.correo;
  let celular = req.body.celular;
  let direccion = req.body.direccion;
  let rol = req.body.rol;
  let usuario = req.body.usuario;
  let password = req.body.password;

  var form_data = {
    usu_nombre_razon_social: nombre,
    usu_dni_ruc: dni,
    usu_correo: correo,
    usu_celular: celular,
    usu_direccion: direccion,
    usu_rol: rol,
    usu_usuario: usuario,
    usu_password: password
  }
  dbConn.query('INSERT INTO usuario SET ?', form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Usuario agregado con exito');
      
      dbConn.query("SELECT * FROM usuario WHERE usu_correo='" + correo + "' AND usu_password='" + password + "'", function (err, rows) {

        if (err) {
          req.flash('error', err);
          console.log(err);
        } else {
          console.log(rows);
          if (rows.length) {
            nombre = rows[0]["usu_nombre_razon_social"];
            console.log(nombre);
            req.session.idu = rows[0]["usu_id"];
            req.session.user = rows[0]["usu_nombre_razon_social"];
            req.session.email = rows[0]["usu_correo"];
            req.session.admin=true;
            res.redirect("/admin");
          } else {
            res.redirect("/");
          }
           } });
    }
  })
})


  module.exports = router;