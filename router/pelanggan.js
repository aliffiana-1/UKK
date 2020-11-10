const express = require("express")
const app = express()
const md5 = require("md5")
//authorization
const verifyToken = require('./verifyToken')
app.use(verifyToken)

// call model of pelanggan
const pelanggan = require("../models/index").pelanggan

// middleware for allow the request from body (agar bisa membaca data" yang kita kirimkan di body)
app.use(express.urlencoded({extended:true}))

app.get("/",verifyToken,  async(req,res) => {
    pelanggan.findAll()
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
        nomor_kwh: req.body.nomor_kwh,
        nama_pelanggan: req.body.nama_pelanggan,
        alamat: req.body.alamat,
        id_tarif: req.body.id_tarif
    }

    // execute insert data
    pelanggan.create(data)
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
        nomor_kwh: req.body.nomor_kwh,
        nama_pelanggan: req.body.nomor_kwh,
        alamat: req.body.alamat,
        id_tarif: req.body.id_tarif
    }

    // key yg menunjukkan data yang akan diubah
    let param = {id_pelanggan: req.body.id_pelanggan}

    // execute update data
    pelanggan.update(data,{where : param})
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

app.delete("/:id_pelanggan",verifyToken, async(req, res) => {
    let id_pelanggan = req.params.id_pelanggan
    let parameter = {
        id_pelanggan: id_pelanggan,
        password: md5(req.body.password)
    }

    // execute delete data
    pelanggan.destroy({where : parameter})
    .then(result => {
        res.json({
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
