var express = require('express');
var mysql = require('mysql');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


//Se establece los parametros de conexion  
var conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'articulosdb'
});

conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log("conexion exxitosa de la BD")
    }
});



//configuarar rutas 
app.get('/', function (req, res) {
    res.send('RUTA DE INICIO');
})

//mostrar todos los articulos 
app.get('/api/articulos', (req, res) => {
    conexion.query('SELECT * FROM articulos', (error, fila) => {
        if (error) {
            throw error;
        } else {
            res.send(fila);
        }
    })
});


//mostrar un solo articulo 
app.get('/api/articulos/:id', (req, res) => {
    conexion.query('SELECT * FROM articulos WHERE id = ?', [req.params.id], (error, fila) => {
        if (error) {
            throw error;
        } else {
            res.send(fila);
            //res.send(fila[0].descrpcion);
        }
    })
});

//CREAR UN ARTICULO
app.post('/api/articulos', (req, res) => {
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    let sql ="INSERT INTO articulos set ?";
    conexion.query(sql, data, function (error, results) {

        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

//EDITAR ARTICULO 
app.put('/api/articulos/:id', (req, res)=>{

    let id= req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock =req.body.stock;
    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";

    conexion.query(sql, [descripcion, precio, stock, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });

});

//ELIMINAR ARTICULO
app.delete('/api/articulos/:id', (req,res)=>{
    conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id], function(error, filas){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});


const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function () {
    console.log("servidor OK en el puerto: " + puerto);
});