const express = require('express');
const router = express.Router();
const database = require("../database");

router.get('/', async(req, res) => {
    const customers = database.getDb().collection("customers")
    try {
        const result = await customers.find({}).toArray()
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.get('/:id', async(req, res) => {
    const customer = database.getDb().collection("customers")
    try {
        const result = await customer.findOne({ _id: req.params.id })
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.post('/', async(req, res) => {
    const customer = database.getDb().collection("customers")
    const { fullName } = req.body
    const newCustomer = {
        _id: "4",
        fullName: fullName || ""
    }
    try {
        const result = await customer.insertOne(newCustomer)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.put('/:id', async(req, res) => {
    const customer = database.getDb().collection("customers")
    const { fullName } = req.body
    const newCustomer = {
        "validate": {

        },
        $set: {
            fullName: fullName
        },
    }
    try {
        const result = await customer.updateOne({ _id: req.params.id }, newCustomer)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: "error" })
    }
})

router.delete('/:id', async(req,res) => {
    const customer = database.getDb().collection("customers")
    try {
        const result = await customer.deleteOne({ _id: req.params.id })
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

module.exports = router;