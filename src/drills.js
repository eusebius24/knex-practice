require('dotenv').config()
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function searchByProductName(searchTerm) {
    knexInstance
        .select('name', 'price', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

searchByProductName('steak');

function paginateProducts(page) {
    const productsPerPage = 6;
    const offset = productsPerPage * (page - 1);
    knexInstance    
        .select('name', 'price', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result);
        })
}

paginateProducts(3);

function addedAfterDays(daysAgo) {
    knexInstance
    .select('name', 'price', 'category')
    .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
        console.log(result);
    })
}

addedAfterDays(2);

function totalCostByCategory() {
    knexInstance
        .select('name', 'price', 'category')
        .from('shopping_list')
        .groupBy('category', 'name', 'price')
        .orderBy([{
            column: 'category', order: 'ASC'
        }])
        .then(result => {
            console.log(result);
        })

    knexInstance
        .sum('price')
        .from('shopping_list')
        .where('category', 'Breakfast')
        .then(result => {
            console.log('Breakfast Total:', result);
        })
    
        knexInstance
        .sum('price')
        .from('shopping_list')
        .where('category', 'Main')
        .then(result => {
            console.log('Main:', result);
        })

        knexInstance
        .sum('price')
        .from('shopping_list')
        .where('category', 'Lunch')
        .then(result => {
            console.log('Lunch:', result);
        })

        knexInstance
        .sum('price')
        .from('shopping_list')
        .where('category', 'Snack')
        .then(result => {
            console.log('Snack:', result);
        })
}

totalCostByCategory();