const customersList = document.querySelector('#customers-list')
const flowersList = document.querySelector('#flowers-list')
const salesList = document.querySelector('#sales-list')
const axios = require('axios')
let customers

flowersList.addEventListener('click', async(ev) => {
    if(ev.target.tagName === 'LI'){
        const flowerId = ev.target.getAttribute('flower.id');
        const customerId = window.location.hash.slice(1)
        const response = await axios.post(`/api/customers/${customerId}/sales`, { flowerId });
        sale.push(response.data);
        loadSales();
    }
})


salesList.addEventListener('click', async(ev) => {
    if(ev.target.tagName === 'LI'){
        const saleId = ev.target.getAttribute('sale-id');
        console.log(sale)
        await axios.delete(`/api/sales/${saleId}`);
        sales = sales.filter( sale => sale.id !== saleId*1);
        loadSales();
    }
})

customersList.addEventListener('click', async(ev)=> {
    if(ev.target.tagName === 'LI'){
      const customerId = ev.target.getAttribute('data-id-customers');
      const salesdata  = (await axios.get(`/api/customers/${customerId}/sales`)).data
      loadSales(salesdata);
    }
});

const loadSales = async(sales) => {
    const html = sales.map(sale => {
        return `
            <li sale-id='${sale.id}'>
                ${ sale.flower.name }
            </li>
        `
    }).join('')
    salesList.innerHTML = html;
}

const loadCustomers = async() => {
   // const response = await fetch('/api/customers')
    //customers = await response.json()
    customers = (await axios.get('/api/customers')).data
    const html = customers.map(customer => {
        return `
            <li data-id-customers='${customer.id}'>
                ${customer.name}
            </li>
        `
    }).join('')
    customersList.innerHTML = html
}

const loadFlowers = async() => {
    //const response  = await fetch(`/api/flowers`)
    //const data = await response.json()
    const flowers = (await axios.get(`/api/flowers`)).data
    const html = flowers.map(flower => {
        return `
            <li data-id='${flower.id}'>
                ${flower.name}
            </li>
        `
    }).join('')
    flowersList.innerHTML = html
}

loadCustomers()
loadFlowers()

window.addEventListener('hashchange', () => {
    console.log("test: " + window.location.hash)
    loadSales();
})
