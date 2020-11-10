const express = require("express")
const app = express()
const md5 = require("md5")

// call model of admin
const admin = require("../models/index").admin

// middleware for allow the request from body (agar bisa membaca data" yang kita kirimkan di body)
app.use(express.urlencoded({extended:true}))

const verifyToken = require("./verifyToken")

app.get("/",verifyToken, async(req,res) => {
    admin.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", async(req, res) => {
    // tampung data request yang akan digunakan
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nama_admin: req.body.nama_admin,
        id_level: req.body.id_level
    }

    // execute insert data
    admin.create(data)
    .then(result => {
        res.json({
            message: "Data has been inserted",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.put("/", verifyToken, async(req, res) => {
    // tampung data request yang akan di ubah 
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nama_admin: req.body.nama_admin,
        id_level: req.body.id_level
    }

    // key yg menunjukkan data yang akan diubah
    let param = {id_admin: req.body.id_admin}

    // execute update data
    admin.update(data,{where : param})
    .then(result => {
        res.json({
            message: "Data has been updated",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:id_admin",verifyToken, async(req, res) => {
    let id_admin = req.params.id_admin
    let parameter = {
        id_admin: id_admin
    }

    // execute delete data
    admin.destroy({where : parameter})
    .then(result => {       res.json({
            message: "Data has been destroyed",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app