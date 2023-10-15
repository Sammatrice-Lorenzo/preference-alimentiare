async function getData () {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLb1B3Ya8dXHv4pELd03qKncWtLQnOxq1MGSzXgmCKPqZ80m6Os_VVDUnKcYege8YKE5RqlSsOiw7B/pub?output=csv'
    try {
        const response = await d3.csv(url);

        const parsedData = response.map(data => {
            return {
                'Nom': data['lastname'],
                'Prénom': data['firstname'],
                'Email': data['email'],
                'Préférence alimentaire': data['foodPreference'],
                'Allergies alimentaires': data['allergies'],
                'Plat préféré': data['favoriteMeal'],
                'Dessert préféré': data['favoriteDessert'],
                'Boisson préféré': data['favoriteDrink'],
                'Nombre de repas par jours': parseInt(data['numberOfMealForDay']),
                'Consumation fruits et legumes': data['consumptionOfFruitsAndVegetables'],
                'Image': data['img'].replace('open?id=', 'uc?id=')
            };
        });

        return parsedData;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Problème serveur !');
    }
}

$(document).ready(async function () {
    const dataCsv = await getData()

    buildDataInHtml(dataCsv)
    d3.selectAll('.select').on('change', filters)
})

/**
 * @param {Array} dataCsv 
 */
function buildDataInHtml(dataCsv) {
    const divParent = d3.select('#data-csv');

    const allDiv = divParent.selectAll('.data-div')
        .data(dataCsv)
        .enter()
        .append('div')
        .attr('class', `bg-gray-200 p-4 rounded shadow mb-4 row`)
        .attr('id', (d, index) => `${index}`)
    
    const lastDiv = allDiv.append('div').attr('class', 'grid grid-cols-3')
    const divLeft = lastDiv.append('div').attr('class', 'data-food')
    const divRight = lastDiv.append('div').attr('class', 'text-left')

    lastDiv.append('div')
        .attr('class', 'bg-cyan-500 mx-5 end-0')
        .append('img')
        .attr('class', 'object-contain h-48 w-40')

    setData(divLeft, 'head')
    setData(divRight, 'value')
}

function setHeaders(ul, head) {
    const strong = ul.append('strong')
    const li = strong.append('li')
    if (head !== 'Image') {
        li.text(`${head} :`)
    }
}

function setValuesUsers(ul, head, value, that) {
    const li = ul.append('li')
    if (head === 'Image') {
        const divParent = d3.select(that).node().parentNode
        const img = d3.select(divParent).select('img')
        img.attr('src', value)
    } else {
        li.text(`${value}`)
    }
}

function setData(div, type) {
    div.each(function (data) {
        const ul = d3.select(this).append('ul')
        Object.entries(data).forEach(([head, value]) => {
            if (type === 'head') {
                setHeaders(ul, head)
            } else {
                setValuesUsers(ul, head, value, this)
            }
        })
    }) 
}

async function filters() {
    let dataCsv = await getData()

    let selects = d3.selectAll('.select-parent').selectAll('.select')
    const filters = {
        'select-allergies': 'Allergies alimentaires',
        'select-food-preference': 'Préférence alimentaire',
        'select-number-meal-day': 'Nombre de repas par jours'
    }


    let dataFiltered = dataCsv
    for (const select of selects) {
        let dataSelected = d3.select(select).property('value');
        let idSelect = d3.select(select).property('id');
        let key = filters[idSelect];
    
        if (dataSelected) {
            dataFiltered = dataFiltered.filter(data => data[key] == dataSelected);
        }
    }
  
    d3.select('#data-csv').html('')
    buildDataInHtml(dataFiltered ?? dataCsv)
}