const express = require('express')
const server = express()


//pegar o banco de dados

const db = require("./database/db")

//habilitar o uso do body

server.use(express.urlencoded({extended:true}))


//config pasta publica
server.use(express.static("public"))

//Ligar o servidor
server.listen(3000)



//utilizando template engine

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {

    express: server,
    noCache: true

})




//Configurar caminhos da aplicacao
server.get("/", (req,res) => {

    res.render("index.html")
})




server.get("/create-point", (req,res) => {

    
    res.render("create-point.html")
})

server.post("/savepoint", (req,res) => {
      
      
    const query = `
    INSERT INTO places (
    image,
    name,
    address,
    address2,
    state,
    city,
    items
    ) VALUES (?,?,?,?,?,?,?); 
`
    const values = [
     req.body.image,
     req.body.name,
     req.body.address,
     req.body.address2,
     req.body.state,
     req.body.city,
     req.body.items

    ]

    console.log(values)

    function afterInsertData(err){
        if(err){

           console.log(err)
           return res.render("create-point.html", {error:true})
        }

         console.log("Cadastrado com sucesso")
         console.log(this)

         return res.render("create-point.html", {saved:true})
    } 

    db.run(query,values, afterInsertData)
    
})




server.get("/search", (req,res) => {

    const search = req.query.search

    if (search == ""){

        return res.render("search-results.html",{
            total: 0
        })
    }
    
    //pegar dados do banco de dados

    db.all(`SELECT * FROM places WHERE city = '${search}'`,function(err,rows){
        if(err) return console.log(err)

        const total = rows.length

        //mostrar a pagina html com os dados do banco de dados
        res.render("search-results.html",{
            places:rows,
            total: total
        })
    })

   
})

