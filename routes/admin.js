var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* Listado usuario */
router.get('/usuario', function (req, res, next) {
  dbConn.query('SELECT * FROM usuario', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/list/usuario-list', { data: '' });
    } else {
      res.render('admin/list/usuario-list', { data: rows });
    }
  });

});
/* Listado docente */
router.get('/docente', function (req, res, next) {
  dbConn.query('SELECT dc_id, dc_especialidad, dc_genero, date_format(dc_fecha_nacimiento, "%d-%m-%Y") as dc_fecha_nacimiento, dc_experiencia_labolar,u.usu_nombre_razon_social,u.usu_usuario FROM docente d, usuario u  WHERE u.usu_id=d.dc_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/list/docentes-list', { data: '' });
    } else {
      res.render('admin/list/docentes-list', { data: rows });
    }
  });

});
/* Listado egresado */
router.get('/egresado', function (req, res, next) {
  dbConn.query('SELECT eg_id, eg_carrera, date_format(eg_anio_egreso, "%d-%m-%Y") as eg_anio_egreso, eg_genero, date_format(eg_fecha_nacimiento, "%d-%m-%Y") as eg_fecha_nacimiento,eg_tercio_superior,u.usu_nombre_razon_social,u.usu_usuario FROM egresado e, usuario u  WHERE u.usu_id=e.eg_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/list/egresado-list', { data: '' });
    } else {
      res.render('admin/list/egresado-list', { data: rows });
    }
  });

});
/* Listado empresa */
router.get('/empresa', function (req, res, next) {
  dbConn.query('SELECT em_id,em_rubro,date_format(em_fecha_creacion, "%d-%m-%Y") as em_fecha_creacion,em_nro_sedes,em_tipo_gestion,em_pagina_web,em_nro_trabajadores,u.usu_nombre_razon_social,u.usu_usuario FROM empresas e, usuario u WHERE u.usu_id=e.em_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/list/empresas-list', { data: '' });
    } else {
      res.render('admin/list/empresas-list', { data: rows });
    }
  });

});
/* Listado institucion */
router.get('/institucion', function (req, res, next) {
  dbConn.query('SELECT ins_id,ins_nro_carrera, ins_nro_becados, date_format(ins_fecha_creacion, "%d-%m-%Y") as ins_fecha_creacion,u.usu_nombre_razon_social,u.usu_usuario FROM institucion i, usuario u WHERE u.usu_id=i.ins_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/list/institucion-list', { data: '' });
    } else {
      res.render('admin/list/institucion-list', { data: rows });
    }
  });

});
/* Listado monitoreo */
router.get('/monitoreo', function (req, res, next) {
  dbConn.query('SELECT moni_id,moni_motivo, date_format(moni_fecha, "%d-%m-%Y") as moni_fecha,moni_hora,moni_duracion,u.usu_nombre_razon_social,u.usu_usuario FROM monitoreo m, usuario u, docente d WHERE u.usu_id=d.dc_usu_id AND d.dc_id=m.moni_dc_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/list/monitoreo-list', { data: '' });
    } else {
      res.render('admin/list/monitoreo-list', { data: rows });
    }
  });

});
/* Listado oferta laboral */
router.get('/oferta_laboral', function (req, res, next) {
  dbConn.query('SELECT ol_id,date_format(ol_fecha_inicio_laborales, "%d-%m-%Y") as ol_fecha_inicio_laborales,date_format(ol_fecha_inicio_convocatoria, "%d-%m-%Y") as ol_fecha_inicio_convocatoria,date_format(ol_fecha_fin, "%d-%m-%Y") as ol_fecha_fin,ol_titulo,ol_descripcion,ol_horario,ol_salario,ol_estado,u.usu_nombre_razon_social,u.usu_usuario FROM oferta_laboral ol, empresas e , usuario u WHERE e.em_id=ol.ol_em_id AND u.usu_id=e.em_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/list/oferta_laboral-list', { data: '' });
    } else {
      res.render('admin/list/oferta_laboral-list', { data: rows });
    }
  });

});
/* Listado postulacion */
router.get('/postulacion', function (req, res, next) {
  dbConn.query('SELECT pc_id,date_format(pc_fecha_postulacion, "%d-%m-%Y") as pc_fecha_postulacion,pc_nro_postulacion,pc_ganador,usu_nombre_razon_social,ol_titulo FROM postulacion p, oferta_laboral ol, egresado e, usuario u WHERE u.usu_id=e.eg_usu_id AND e.eg_id=p.pc_eg_id AND ol.ol_id=p.pc_ol_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/list/postulacion-list', { data: '' });
    } else {
      res.render('admin/list/postulacion-list', { data: rows });
    }
  });

});

// Cambiar a añadir usuario
router.get('/usuario-add', function (req, res, next) {
  res.render('admin/add/usuario-add');
})
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
      res.redirect('../admin/usuario');
    }
  })
});

// Cambiar a añadir egresado
router.get('/egresado-add', function (req, res, next) {
  dbConn.query('SELECT usu_id,usu_nombre_razon_social FROM usuario WHERE usu_rol="1"', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/add/egresado-add', { data: '' });
    } else {
      res.render('admin/add/egresado-add', { data: rows });
    }
  });
});
// Añadir egresado
router.post('/egresado-add', function (req, res, next) {

  let carrera = req.body.carrera;
  let ano_egreso = req.body.ano_egreso;
  let select_genero = req.body.select_genero;
  let fecha_naci = req.body.fecha_naci;
  let select_tercio_superior = req.body.select_tercio_superior;
  let id_usuario = req.body.id_usuario;

  var form_data = {
    eg_carrera: carrera,
    eg_anio_egreso: ano_egreso,
    eg_genero: select_genero,
    eg_fecha_nacimiento: fecha_naci,
    eg_tercio_superior: select_tercio_superior,
    eg_usu_id: id_usuario
  }

  dbConn.query('INSERT INTO egresado SET ?', form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Egresado agregado con exito');
      res.redirect('../admin/egresado');
    }
  })
});

// Cambiar a añadir docente
router.get('/docente-add', function (req, res, next) {
  dbConn.query('SELECT usu_id,usu_nombre_razon_social FROM usuario WHERE usu_rol="3"', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/add/docente-add', { data: '' });
    } else {
      res.render('admin/add/docente-add', { data: rows });
    }
  });
});
// Añadir docente
router.post('/docente-add', function (req, res, next) {

  let especialidad = req.body.especialidad;
  let select_genero = req.body.select_genero;
  let fecha_naci = req.body.fecha_naci;
  let select_xp = req.body.select_xp;
  let id_docente = req.body.id_docente;

  var form_data = {
    dc_especialidad: especialidad,
    dc_genero: select_genero,
    dc_fecha_nacimiento: fecha_naci,
    dc_experiencia_labolar: select_xp,
    dc_usu_id: id_docente
  }

  dbConn.query('INSERT INTO docente SET ?', form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Docente agregado con exito');
      res.redirect('../admin/docente');
    }
  })
});

// Cambiar a añadir empresa
router.get('/empresa-add', function (req, res, next) {
  dbConn.query('SELECT usu_id,usu_nombre_razon_social FROM usuario WHERE usu_rol="2"', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/add/empresa-add', { data: '' });
    } else {
      res.render('admin/add/empresa-add', { data: rows });
    }
  });
});
// Añadir empresa
router.post('/empresa-add', function (req, res, next) {

  let rubro = req.body.rubro;
  let fecha_create = req.body.fecha_create;
  let nro_sedes = req.body.nro_sedes;
  let tipo_gestion = req.body.tipo_gestion;
  let pagina_web = req.body.pagina_web;
  let trabajadores = req.body.trabajadores;
  let id_empresa = req.body.id_empresa;

  var form_data = {
    em_rubro: rubro,
    em_fecha_creacion: fecha_create,
    em_nro_sedes: nro_sedes,
    em_tipo_gestion: tipo_gestion,
    em_pagina_web: pagina_web,
    em_nro_trabajadores: trabajadores,
    em_usu_id: id_empresa
  }

  dbConn.query('INSERT INTO empresas SET ?', form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Empresa agregado con exito');
      res.redirect('../admin/empresa');
    }
  })
});

// Cambiar a añadir institucion
router.get('/institucion-add', function (req, res, next) {
  dbConn.query('SELECT usu_id,usu_nombre_razon_social FROM usuario WHERE usu_rol="4"', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/add/institucion-add', { data: '' });
    } else {
      res.render('admin/add/institucion-add', { data: rows });
    }
  });
});
// Añadir institucion
router.post('/institucion-add', function (req, res, next) {

  let carreras = req.body.carreras;
  let becados = req.body.becados;
  let fecha_create = req.body.fecha_create;
  let id_institucion = req.body.id_institucion;

  var form_data = {
    ins_nro_carrera: carreras,
    ins_nro_becados: becados,
    ins_fecha_creacion: fecha_create,
    ins_usu_id: id_institucion
  }

  dbConn.query('INSERT INTO institucion SET ?', form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Instituto agregado con exito');
      res.redirect('../admin/institucion');
    }
  })
});

// Cambiar a añadir oferta laboral
router.get('/oferta_laboral-add', function (req, res, next) {
  dbConn.query('SELECT u.usu_nombre_razon_social,e.em_id FROM empresas e , usuario u WHERE u.usu_id=e.em_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/add/oferta_laboral-add', { data: '' });
    } else {
      res.render('admin/add/oferta_laboral-add', { data: rows });
    }
  });
});
// Añadir oferta laboral
router.post('/oferta_laboral-add', function (req, res, next) {

  let labores = req.body.labores;
  let convocatorias = req.body.convocatorias;
  let finconvocatorias = req.body.finconvocatorias;
  let titulo = req.body.titulo;
  let descripcion = req.body.descripcion;
  let horario = req.body.horario;
  let salario = req.body.salario;
  let estado = req.body.estado;
  let id_empresa = req.body.id_empresa;

  var form_data = {
    ol_fecha_inicio_laborales: labores,
    ol_fecha_inicio_convocatoria: convocatorias,
    ol_fecha_fin: finconvocatorias,
    ol_titulo: titulo,
    ol_descripcion: descripcion,
    ol_horario: horario,
    ol_salario: salario,
    ol_estado: estado,
    ol_em_id: id_empresa
  }

  dbConn.query('INSERT INTO oferta_laboral SET ?', form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Oferta Laboral agregado con exito');
      res.redirect('../admin/oferta_laboral');
    }
  })
});

// Cambiar a añadir postulacion
router.get('/postulacion-add', function (req, res, next) {
  dbConn.query('SELECT u.usu_nombre_razon_social,e.eg_id,ol.ol_titulo,ol.ol_id FROM oferta_laboral ol,egresado e, usuario u WHERE u.usu_id=e.eg_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/add/postulacion-add', { data: '' });
    } else {
      res.render('admin/add/postulacion-add', { data: rows });
    }
  });
});
// Añadir postulacion
router.post('/postulacion-add', function (req, res, next) {

  let ol_id = req.body.ol_id;
  let fecha = req.body.fecha;
  let id_egresado = req.body.id_egresado;
  let numero = req.body.numero;
  let ganador = req.body.ganador;

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
      res.redirect('../admin/usuario');
    }
  })
});

// Cambiar a añadir monitoreo
router.get('/monitoreo-add', function (req, res, next) {
  dbConn.query('SELECT u.usu_nombre_razon_social,d.dc_id FROM docente d, usuario u WHERE u.usu_id=d.dc_usu_id ', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('admin/add/monitoreo-add', { data: '' });
    } else {
      res.render('admin/add/monitoreo-add', { data: rows });
    }
  });
});
// Añadir monitoreo
router.post('/monitoreo-add', function (req, res, next) {

  let motivo = req.body.motivo;
  let fecha = req.body.fecha;
  let hora = req.body.hora;
  let duracion = req.body.duracion;
  let id_docente = req.body.id_docente;

  var form_data = {
    moni_motivo: motivo,
    moni_fecha: fecha,
    moni_hora: hora,
    moni_duracion: duracion,
    moni_dc_id: id_docente
  }

  dbConn.query('INSERT INTO monitoreo SET ?', form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Monitoreo agregado con exito');
      res.redirect('../admin/monitoreo');
    }
  })
});

// Editar Usuario
router.get('/usuario-edit/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT * FROM usuario WHERE usu_id = ' + id, function (err, rows, fields) {
    if (err) throw err
    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'No se encontro el registro con el usu_id = ' + id)
      res.redirect('/usuario')
    }
    // if book found
    else {
      // render to edit.ejs
      res.render('admin/usuario-edit', {
        id: rows[0].usu_id,
        nombre: rows[0].usu_nombre_razon_social,
        dni: rows[0].usu_dni_ruc,
        correo: rows[0].usu_correo,
        celular: rows[0].usu_celular,
        direccion: rows[0].usu_direccion,
        rol: rows[0].usu_rol,
        usuario: rows[0].usu_usuario,
        password: rows[0].usu_password
      })
    }
  })
});
// Actualizar usuario
router.post('/usuario-edit/:id', function (req, res, next) {
  let id = req.params.id;
  let nombre = req.body.nombre;
  let dni = req.body.dni;
  let correo = req.body.correo;
  let celular = req.body.celular;
  let dirección = req.body.dirección;
  let rol = req.body.rol;
  let usuario = req.body.usuario;
  let password = req.body.password;

  var form_data = {
    usu_nombre_razon_social: nombre,
    usu_dni_ruc: dni,
    usu_correo: correo,
    usu_celular: celular,
    usu_direccion: dirección,
    usu_rol: rol,
    usu_usuario: usuario,
    usu_password: password
  }
  // update query
  dbConn.query('UPDATE usuario SET ? WHERE usu_id = ' + id, form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Usuario editado con exito');
      res.redirect('../../admin/usuario');
    }
  })
});

// Editar egresado
router.get('/egresado-edit/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT eg_id,eg_carrera,eg_anio_egreso,eg_genero,eg_fecha_nacimiento,eg_tercio_superior,eg_usu_id,usu_id,usu_nombre_razon_social FROM egresado, usuario WHERE usu_rol="1" AND eg_id = ' + id, function (err, rows, fields) {
    if (err) throw err
    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'No se encontro el registro con el usu_id = ' + id)
      res.redirect('/egresado')
    }
    // if book found
    else {
      // render to edit.ejs
      res.render('admin/egresado-edit', {
        data: rows,
        id: rows[0].eg_id,
        carrera: rows[0].eg_carrera,
        ano_egreso: rows[0].eg_anio_egreso,
        select_genero: rows[0].eg_genero,
        fecha_naci: rows[0].eg_fecha_nacimiento,
        select_tercio_superior: rows[0].eg_tercio_superior,
        id_usuario: rows[0].eg_usu_id
      })
    }
  })
});
// Actualizar egresado
router.post('/egresado-edit/:id', function (req, res, next) {
  
  let id = req.params.id;
  let carrera = req.body.carrera;
  let ano_egreso = req.body.ano_egreso;
  let select_genero = req.body.select_genero;
  let fecha_naci = req.body.fecha_naci;
  let select_tercio_superior = req.body.select_tercio_superior;
  let id_usuario = req.body.id_usuario;

  var form_data = {
    eg_carrera: carrera,
    eg_anio_egreso: ano_egreso,
    eg_genero: select_genero,
    eg_fecha_nacimiento: fecha_naci,
    eg_tercio_superior: select_tercio_superior,
    eg_usu_id: id_usuario
  }
  // update query
  dbConn.query('UPDATE egresado SET ? WHERE eg_id = ' + id, form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Egresado editado con exito');
      res.redirect('../../admin/egresado');
    }
  })
});

// Editar docente
router.get('/docente-edit/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT dc_id,dc_especialidad,dc_genero,dc_fecha_nacimiento,dc_experiencia_labolar,dc_usu_id,usu_id,usu_nombre_razon_social FROM docente, usuario WHERE usu_rol="3" AND dc_id = ' + id, function (err, rows, fields) {
    if (err) throw err
    if (rows.length <= 0) {
      req.flash('error', 'No se encontro el registro con el usu_id = ' + id)
      res.redirect('/docente')
    }
    else {
      res.render('admin/docente-edit', {
        data: rows,
        id: rows[0].dc_id,
        especialidad: rows[0].dc_especialidad,
        select_genero: rows[0].dc_genero,
        fecha_naci: rows[0].dc_fecha_nacimiento,
        select_xp: rows[0].dc_experiencia_labolar,
        id_docente: rows[0].dc_usu_id
      })
    }
  })
});
// Actualizar docente
router.post('/docente-edit/:id', function (req, res, next) {

  let id = req.params.id;
  let especialidad = req.body.especialidad;
  let select_genero = req.body.select_genero;
  let fecha_naci = req.body.fecha_naci;
  let select_xp = req.body.select_xp;
  let id_docente = req.body.id_docente;

  var form_data = {
    dc_especialidad: especialidad,
    dc_genero: select_genero,
    dc_fecha_nacimiento: fecha_naci,
    dc_experiencia_labolar: select_xp,
    dc_usu_id: id_docente
  }
  // update query
  dbConn.query('UPDATE docente SET ? WHERE dc_id = ' + id, form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Docente editado con exito');
      res.redirect('../../admin/docente');
    }
  })
});

// Editar empresa
router.get('/empresa-edit/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT em_id,em_rubro,em_fecha_creacion,em_nro_sedes,em_tipo_gestion,em_pagina_web,em_nro_trabajadores,em_usu_id,usu_id,usu_nombre_razon_social FROM empresas, usuario WHERE usu_rol="2" AND em_id =' + id, function (err, rows, fields) {
    if (err) throw err
    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'No se encontro el registro con el usu_id = ' + id)
      res.redirect('/empresa')
    }
    // if book found
    else {
      // render to edit.ejs
      res.render('admin/empresa-edit', {
        data: rows,
        id: rows[0].em_id,
        rubro: rows[0].em_rubro,
        fecha_create: rows[0].em_fecha_creacion,
        nro_sedes: rows[0].em_nro_sedes,
        tipo_gestion: rows[0].em_tipo_gestion,
        pagina_web: rows[0].em_pagina_web,
        trabajadores: rows[0].em_nro_trabajadores,
        id_empresa: rows[0].em_usu_id
      })
    }
  })
});
// Actualizar empresa
router.post('/empresa-edit/:id', function (req, res, next) {
  
  let id = req.params.id;
  let rubro = req.body.rubro;
  let fecha_create = req.body.fecha_create;
  let nro_sedes = req.body.nro_sedes;
  let tipo_gestion = req.body.tipo_gestion;
  let pagina_web = req.body.pagina_web;
  let trabajadores = req.body.trabajadores;
  let id_empresa = req.body.id_empresa;

  var form_data = {
    em_rubro: rubro,
    em_fecha_creacion: fecha_create,
    em_nro_sedes: nro_sedes,
    em_tipo_gestion: tipo_gestion,
    em_pagina_web: pagina_web,
    em_nro_trabajadores: trabajadores,
    em_usu_id: id_empresa
  }
  console.log(form_data);
  // update query
  dbConn.query('UPDATE empresas SET ? WHERE em_id = ' + id, form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Empresa editado con exito');
      res.redirect('../../admin/empresa');
    }
  })
});

// Editar institucion
router.get('/institucion-edit/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT ins_id,ins_nro_carrera,ins_nro_becados,ins_fecha_creacion,ins_usu_id,usu_id,usu_nombre_razon_social FROM institucion, usuario WHERE usu_rol="4" AND ins_id = ' + id, function (err, rows, fields) {
    if (err) throw err
    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'No se encontro el registro con el ins_id = ' + id)
      res.redirect('/institucion')
    }
    // if book found
    else {
      // render to edit.ejs
      res.render('admin/institucion-edit', {
        data: rows,
        id: rows[0].ins_id,
        carreras: rows[0].ins_nro_carrera,
        becados: rows[0].ins_nro_becados,
        fecha_create: rows[0].ins_fecha_creacion,
        id_institucion: rows[0].ins_usu_id
      })
    }
  })
});
// Actualizar institucion
router.post('/institucion-edit/:id', function (req, res, next) {

  let id = req.params.id;
  let carreras = req.body.carreras;
  let becados = req.body.becados;
  let fecha_create = req.body.fecha_create;
  let id_institucion = req.body.id_institucion;

  var form_data = {
    ins_nro_carrera: carreras,
    ins_nro_becados: becados,
    ins_fecha_creacion: fecha_create,
    ins_usu_id: id_institucion
  }
  // update query
  dbConn.query('UPDATE institucion SET ? WHERE ins_id = ' + id, form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Institucion editado con exito');
      res.redirect('../../admin/institucion');
    }
  })
});

// Editar monitoreo
router.get('/monitoreo-edit/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT moni_id,moni_motivo,moni_fecha,moni_hora,moni_duracion,moni_dc_id,dc_id,usu_nombre_razon_social FROM monitoreo m, usuario u, docente d WHERE u.usu_id=d.dc_usu_id AND moni_id = ' + id, function (err, rows, fields) {
    if (err) throw err
    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'No se encontro el registro con el usu_id = ' + id)
      res.redirect('/monitoreo')
    }
    // if book found
    else {
      // render to edit.ejs
      res.render('admin/monitoreo-edit', {
        data: rows,
        id: rows[0].moni_id,
        motivo: rows[0].moni_motivo,
        fecha: rows[0].moni_fecha,
        hora: rows[0].moni_hora,
        duracion: rows[0].moni_duracion,
        id_docente: rows[0].moni_dc_id
      })
    }
  })
});
// Actualizar monitoreo
router.post('/monitoreo-edit/:id', function (req, res, next) {

  let id = req.params.id;
  let motivo = req.body.motivo;
  let fecha = req.body.fecha;
  let hora = req.body.hora;
  let duracion = req.body.duracion;
  let id_docente = req.body.id_docente;

  var form_data = {
    moni_motivo: motivo,
    moni_fecha: fecha,
    moni_hora: hora,
    moni_duracion: duracion,
    moni_dc_id: id_docente
  }
  // update query
  dbConn.query('UPDATE monitoreo SET ? WHERE moni_id = ' + id, form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Monitoreo editado con exito');
      res.redirect('../../admin/monitoreo');
    }
  })
});

// Editar oferta_laboral
router.get('/oferta_laboral-edit/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT ol_id,ol_fecha_inicio_laborales,ol_fecha_inicio_convocatoria,ol_fecha_fin,ol_titulo,ol_descripcion,ol_horario,ol_salario,ol_estado,ol_em_id,em_id,usu_nombre_razon_social FROM oferta_laboral ol, empresas e, usuario u WHERE u.usu_id=e.em_usu_id AND ol_id =  ' + id, function (err, rows, fields) {
    if (err) throw err
    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'No se encontro el registro con el usu_id = ' + id)
      res.redirect('/oferta_laboral')
    }
    // if book found
    else {
      // render to edit.ejs
      res.render('admin/oferta_laboral-edit', {
        data: rows,
        id: rows[0].ol_id,
        labores: rows[0].ol_fecha_inicio_laborales,
        convocatorias: rows[0].ol_fecha_inicio_convocatoria,
        finconvocatorias: rows[0].ol_fecha_fin,
        titulo: rows[0].ol_titulo,
        descripcion: rows[0].ol_descripcion,
        horario: rows[0].ol_horario,
        salario: rows[0].ol_salario,
        estado: rows[0].ol_estado,
        id_empresa: rows[0].ol_em_id
      })
    }
  })
});
// Actualizar oferta_laboral
router.post('/oferta_laboral-edit/:id', function (req, res, next) {

  let id = req.params.id;
  let labores = req.body.labores;
  let convocatorias = req.body.convocatorias;
  let finconvocatorias = req.body.finconvocatorias;
  let titulo = req.body.titulo;
  let descripcion = req.body.descripcion;
  let horario = req.body.horario;
  let salario = req.body.salario;
  let estado = req.body.estado;
  let id_empresa = req.body.id_empresa;

  var form_data = {
    ol_fecha_inicio_laborales: labores,
    ol_fecha_inicio_convocatoria: convocatorias,
    ol_fecha_fin: finconvocatorias,
    ol_titulo: titulo,
    ol_descripcion: descripcion,
    ol_horario: horario,
    ol_salario: salario,
    ol_estado: estado,
    ol_em_id: id_empresa
  }
  // update query
  dbConn.query('UPDATE oferta_laboral SET ? WHERE ol_id = ' + id, form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Oferta Laboral editado con exito');
      res.redirect('../../admin/oferta_laboral');
    }
  })
});

// Editar postulacion
router.get('/postulacion-edit/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT * FROM usuario WHERE usu_id = ' + id, function (err, rows, fields) {
    if (err) throw err
    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'No se encontro el registro con el usu_id = ' + id)
      res.redirect('/usuario')
    }
    // if book found
    else {
      // render to edit.ejs
      res.render('admin/usuario-edit', {
        data: rows,
        id: rows[0].usu_id,
        nombre: rows[0].usu_nombre_razon_social,
        dni: rows[0].usu_dni_ruc,
        correo: rows[0].usu_correo,
        celular: rows[0].usu_celular,
        direccion: rows[0].usu_direccion,
        rol: rows[0].usu_rol,
        usuario: rows[0].usu_usuario,
        password: rows[0].usu_password
      })
    }
  })
});
// Actualizar postulacion
router.post('/postulacion-edit/:id', function (req, res, next) {
  let id = req.params.id;
  let nombre = req.body.nombre;
  let dni = req.body.dni;
  let correo = req.body.correo;
  let celular = req.body.celular;
  let dirección = req.body.dirección;
  let rol = req.body.rol;
  let usuario = req.body.usuario;
  let password = req.body.password;

  var form_data = {
    usu_nombre_razon_social: nombre,
    usu_dni_ruc: dni,
    usu_correo: correo,
    usu_celular: celular,
    usu_direccion: dirección,
    usu_rol: rol,
    usu_usuario: usuario,
    usu_password: password
  }
  // update query
  dbConn.query('UPDATE usuario SET ? WHERE usu_id = ' + id, form_data, function (err, result) {
    if (err) {
      req.flash('error', err)
    } else {
      req.flash('success', 'Usuario editado con exito');
      res.redirect('../../admin/usuario');
    }
  })
});

// Eliminar usuario
router.get('/usuario-del/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM usuario WHERE usu_id = ' + id, function (err, result) {
    if (err) {
      req.flash('error', err)
      res.redirect('/usuario')
    } else {
      req.flash('success', 'Usuario eliminado con exito ID = ' + id)
      res.redirect('../usuario')
    }
  })
});

// Eliminar docente
router.get('/docente-del/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM docente WHERE dc_id = ' + id, function (err, result) {
    if (err) {
      req.flash('error', err)
      res.redirect('/docente')
    } else {
      req.flash('success', 'Docente eliminado con exito ID = ' + id)
      res.redirect('../docente')
    }
  })
});

// Eliminar egresado
router.get('/egresado-del/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM egresado WHERE eg_id = ' + id, function (err, result) {
    if (err) {
      req.flash('error', err)
      res.redirect('/egresado')
    } else {
      req.flash('success', 'Egresado eliminado con exito ID = ' + id)
      res.redirect('../egresado')
    }
  })
});

// Eliminar empresa
router.get('/empresa-del/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM empresas WHERE em_id = ' + id, function (err, result) {
    if (err) {
      req.flash('error', err)
      res.redirect('../empresa')
    } else {
      req.flash('success', 'Empresa eliminado con exito ID = ' + id)
      res.redirect('../empresa')
    }
  })
});

// Eliminar institucion
router.get('/institucion-del/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM institucion WHERE ins_id = ' + id, function (err, result) {
    if (err) {
      req.flash('error', err)
      res.redirect('../institucion')
    } else {
      req.flash('success', 'Institucion eliminado con exito ID = ' + id)
      res.redirect('../institucion')
    }
  })
});

// Eliminar monitoreo
router.get('/monitoreo-del/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM monitoreo WHERE moni_id = ' + id, function (err, result) {
    if (err) {
      req.flash('error', err)
      res.redirect('../monitoreo')
    } else {
      req.flash('success', 'Monitoreo eliminado con exito ID = ' + id)
      res.redirect('../monitoreo')
    }
  })
});

// Eliminar oferta_laboral
router.get('/oferta_laboral-del/(:id)', function (req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM oferta_laboral WHERE OL_id = ' + id, function (err, result) {
    if (err) {
      req.flash('error', err)
      res.redirect('../oferta_laboral')
    } else {
      req.flash('success', 'Oferta Laboral eliminado con exito ID = ' + id)
      res.redirect('../oferta_laboral')
    }
  })
});
module.exports = router;
