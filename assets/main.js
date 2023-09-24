const MEET = 'Viande'
const FISH = 'Poisson'
const VEGETARIAN = 'Végetarien'
const HEADERS_FOOD_PREFERENCE = [MEET, FISH, VEGETARIAN]
const MEAL_FOR_DAY = ['1 repas', '2 repas', '3 repas', '4 repas', '5 repas']

async function getData () {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLb1B3Ya8dXHv4pELd03qKncWtLQnOxq1MGSzXgmCKPqZ80m6Os_VVDUnKcYege8YKE5RqlSsOiw7B/pub?output=csv'
    let dataFood = []

    await fetch(url, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problème servuer !')
        }
        return response.text()
    })
    .then(csvData => {
        const parsedData = parseCSV(csvData)

        for (const data of parsedData) {
            dataFood.push(data)
        }

        return dataFood
    })
    .catch(error => console.error('Error:', error))

    return dataFood.slice(1)
}

function parseCSV (csvData) {
    const lines = csvData.split('\n')
    const result = []
    const headers = lines[0].split(',')

    for (const line of lines) {
        const dataCsv = {}
        const currentLine = line.split(',')

        for (const key in headers) {
            dataCsv[headers[key].trim()] = currentLine[key]
        }

        result.push(dataCsv)
    }

    return result;
}

$(document).ready(async function () {
    const dataCsv = await getData()

    setData(dataCsv)
})

function setDivHeaders(idDiv) {
    let div = `<div id=${idDiv} class="bg-gray-200 p-4 rounded shadow mb-4 row ${idDiv}">`
        + '<div class="grid grid-cols-3">'
            + '<div class="data-food">'
                + '<ul>'
                    + '<li><strong>Nom :</strong></li>'
                    +  '<li><strong>Prénom:</strong></li>'
                    +  '<li><strong>Email</strong></li>'
                    +  '<li><strong>Préférence alimentaire: </strong></li>'
                    +  '<li><strong>Allergies alimentaires: </strong></li>'
                    +  '<li><strong>Plat préféré: </strong></li>'
                    +  '<li><strong>Dessert préféré :</strong></li>'
                    +  '<li><strong>Boisson préféré :</strong></li>'
                    +  '<li><strong>Nombre de repas par jours: </strong></li>'
                    +  '<li><strong>Consumation fruits et legumes </strong></li>'
                + '</ul>'
            + '</div>'
        + '</div>'
    + '</div>'

    $('#data-csv').append(div)
}

/**
 * @param {Array} dataCsv 
 */
function setData(dataCsv) {

    for (const key in dataCsv) {
        setDivHeaders(key)
        let div = $('.' + key).children()

        div.append('<div class="text-left"><ul></ul></div>')
        let ul = div.children('.text-left').children()

        let liData =  `<li> ${dataCsv[key].lastname}</li>`
            + `<li>${dataCsv[key].firstname}</li>`
            + `<li>${dataCsv[key].email}</li>`
            + `<li>${dataCsv[key].foodPreference}</li>`
            + `<li>${dataCsv[key].allergies}</li>`
            + `<li>${dataCsv[key].favoriteMeal}</li>`
            + `<li>${dataCsv[key].favoriteDessert}</li>`
            + `<li>${dataCsv[key].favoriteDrink}</li>`
            + `<li>${dataCsv[key].numberOfMealForDay}</li>`
            + `<li>${dataCsv[key].consumptionOfFruitsAndVegetables}</li>`

        let divImg = '<div class="bg-cyan-500 mx-5 end-0">'
            + `<img class="object-contain h-48 w-40" src="${dataCsv[key].img}">`
            + `</div>`

        ul.append(liData)
        div.append(divImg)
    }
}

async function createChart(ctx, labels, data) {

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data
            }],
            hoverOffset: 4
        }
    })
}

async function createGrahpFoodPreference() {
    const dataCsv = await getData()
    const preferenceFood = dataCsv.map((data) => data.foodPreference)
    
    const ctx = $('.food-preference')

    let meet = filteredDataFood(preferenceFood, MEET).length
    let fish = filteredDataFood(preferenceFood, FISH).length
    let vegetarian = filteredDataFood(preferenceFood, VEGETARIAN).length

    let dataGraph = [meet, fish, vegetarian]

    createChart(ctx, HEADERS_FOOD_PREFERENCE, dataGraph)
}

async function createGrahpAllergies() {
    const dataCsv = await getData()
    const allergies = dataCsv.map((data) => data.allergies)
    
    const ctx = $('.allergies')

    let countAllergic = filteredDataFood(allergies, 'Oui').length
    let countNotAllergic = filteredDataFood(allergies, 'Non').length

    let dataGraph = [countAllergic, countNotAllergic]

    createChart(ctx, ['Oui', 'Non'], dataGraph)
}

async function createGrahpNbMealForDay() {
    const dataCsv = await getData()
    const nbMealForDay = dataCsv.map((data) => data.numberOfMealForDay)

    const ctx = $('.number-meal-day')

    let oneMealForDay = filteredDataFood(nbMealForDay, '1').length
    let twoMealForDay = filteredDataFood(nbMealForDay, '2').length
    let threeMealForDay = filteredDataFood(nbMealForDay, '3').length
    let fourMealForDay = filteredDataFood(nbMealForDay, '4').length
    let fiveMealForDay = filteredDataFood(nbMealForDay, '5').length

    let dataGraph = [oneMealForDay, twoMealForDay, threeMealForDay, fourMealForDay, fiveMealForDay]

    createChart(ctx, MEAL_FOR_DAY, dataGraph)
}


/**
 * 
 * @param {Array} dataFood 
 * @param {string} typeOfData 
 * @returns 
 */
function filteredDataFood(dataFood, typeOfData) {
    return dataFood.filter((data) => data === typeOfData)
}