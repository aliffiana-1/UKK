const {urlencoded} = require('express')
const express = require("express")
const app = express()

//call model tagihan
const tagihan = require('../models/index').tagihan
const penggunaan = require("../models/index").penggunaan
//middleware req body
app.use(express.urlencoded({ extended: true }))

//authorization
const verifyToken = require('./verifyToken')

app.get('/', verifyToken, async (req,res) => {
    tagihan.findAll({
        include:["penggunaan"]
    }) //get data
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post('/', async (req,res) => {
    let data = {
        id_penggunaan: req.body.id_penggunaan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        jumlah_meter: req.body.jumlah_meter,
        status: false
    }

    tagihan.create(data)
    .then(result => {
        // ambil id_penggunaan
        const idPengguna = {
            id_penggunaan: req.body.id_penggunaan,
          };
    
          // findOne id_penggunaan (untuk memanggil id_penggunaan yang dipinjam)
          penggunaan.findOne({ where: idPengguna })
          .then((resultPengguna) => {
            const pengguna = {
              meter_awal: resultPengguna.meter_awal,
              meter_akhir: resultPengguna.meter_akhir,
            };
            const jumlah = {
              jumlah_meter: pengguna.meter_akhir - pengguna.meter_awal,
            };
    
            tagihan.update(jumlah, { where: idPengguna })
            .then((result3) => {
              res.json({
                message: 'Data has been inserted',
                data: result,
              });
            });
          });
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.put('/', async (req,res) => {
    let data = {
        id_penggunaan: req.body.id_penggunaan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        jumlah_meter: req.body.jumlah_meter,
        status: false
    }

    let param = { 
        id_tagihan : req.body.id_tagihan
    }

    tagihan.update(data, {where:param})
    .then(result => {
        // ambil id_penggunaan
        const idPengguna = {
            id_penggunaan: req.body.id_penggunaan,
          };
    
          // findOne id_penggunaan (untuk memanggil id_penggunaan yang dipinjam)
          penggunaan.findOne({ where: idPengguna })
          .then((resultPengguna) => {
            const pengguna = {
              meter_awal: resultPengguna.meter_awal,
              meter_akhir: resultPengguna.meter_akhir,
            };
            const jumlah = {
              jumlah_meter: pengguna.meter_akhir - pengguna.meter_awal,
            };
    
            tagihan.update(jumlah, { where: idPengguna })
            .then((result3) => {
              res.json({
                message: 'Data has been updated',
                data: result,
              });
            });
        });
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete('/:id_tagihan', verifyToken, async (req,res) => {
     //variabel
    let id_tagihan = req.params.id_tagihan
    //object
    let param = {
        id_tagihan : id_tagihan
    }

    tagihan.destroy({ where : param })
    .then(result => {
        res.json({
            message : 'data destroyed',
            data : result
        })
    })
    .catch(error => {
        res.json({
            message : error.message
        })
    })
})

module.exports = app