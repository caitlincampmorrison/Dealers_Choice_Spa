const express = require('express');
const path = require('path')
const { syncAndSeed, models: { Customer, Flower, Sale }} = require('./db')

const app = express()

app.use(express.json())

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/customers', async(req,res,next) => {
    try{
        res.send(await Customer.findAll())
    }
    catch(ex){
        next(ex)
    }
})

app.get('/api/flowers', async(req,res,next) => {
    try{
        res.send(await Flower.findAll())
    }
    catch(ex){
        next(ex)
    }
})

app.post('/api/customers/:id/sales', async(req, res, next) => {
    try{
        res.send(await Sale.create({customerId: req.params.id, ...req.body}))
    }
    catch(ex){
        next(ex)
    }
})

app.delete('/api/sales/:id', async(req,res,next) => {
    try{
        const sale = await Sale.findbyPk(req.params.flowerId)
        await sale.destroy()
    }
    catch(ex){
        next(ex)
    }
})

app.get('/api/customers/:id/sales', async(req,res,next) => {
    try{
        res.send(await Sale.findAll({
            where: {
                customerId: req.params.id
            },
            include: [ Flower ]
        }))
    }
    catch(ex){
        next(ex)
    }
})

const init = async()=> {
    try {
        await syncAndSeed();
      const port = process.env.PORT || 1400;
      app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(ex){
      console.log(ex);
    }
};
  
init();