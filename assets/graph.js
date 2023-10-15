const MEET = 'Viande'
const FISH = 'Poisson'
const VEGETARIAN = 'Végétarien'
const HEADERS_FOOD_PREFERENCE = [MEET, FISH, VEGETARIAN]
const MEAL_FOR_DAY = ['1 repas', '2 repas', '3 repas', '4 repas', '5 repas']

const width = 500
const height = 300
const radius = Math.min(width, height) / 2

/**
 * @param {Array} dataFood 
 * @param {string} typeOfData 
 * @returns 
 */
function filteredDataFood(dataFood, typeOfData) {
    return dataFood.filter(data => data === typeOfData)
}

function createGraph(classGraph, dataGraph, headers) {
    const svg = d3.select(classGraph)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)

    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius)

    const pie = d3.pie()
        .value(d => d)
        .sort(null)

    const arcs = pie(dataGraph)
    const colors = ['#ff3333', '#36a2eb', '#ff33a5', '#2ecc71', '#ffec33']

    const color = d3.scaleOrdinal()
        .domain(headers)
        .range(colors)

    svg.selectAll('path')
        .data(arcs)
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(headers[i]))

    createLegendForGraph(svg, headers, color)
    setPercentage(svg, arcs, arc)
    setTextGraph(svg, dataGraph)
}

function createLegendForGraph(svg, headers, color) {
    const legend = svg.selectAll('.legend')
        .data(headers)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 30})`);

    legend.append('rect')
        .attr('x', width / 2 - 18)
        .attr('y', -height / 2 + 9)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', (d, i) => color(headers[i]));

    legend.append('text')
        .attr('x', width / 2 - 24)
        .attr('y', -height / 2 + 18)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d => d);
}

function setPercentage(svg, arcs, arc) {
    svg.selectAll('.percentText')
        .data(arcs)
        .enter().append('text')
        .attr('class', 'percentText')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .text(d => {
            const percent = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
            return `${percent.toFixed(1)}%`
        })
}

function setTextGraph(svg, dataGraph) {
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text('Total');

    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.5em')
        .style('font-size', '2em')
        .text(d3.sum(dataGraph))
}

async function createGraphFoodPreference() {
    const dataCsv = await getData()
    const preferenceFood = dataCsv.map(data => data['Préférence alimentaire'])

    const meet = filteredDataFood(preferenceFood, MEET).length
    const fish = filteredDataFood(preferenceFood, FISH).length
    const vegetarian = filteredDataFood(preferenceFood, VEGETARIAN).length

    const dataGraph = [meet, fish, vegetarian]
    createGraph('.food-preference', dataGraph, HEADERS_FOOD_PREFERENCE)
}

async function createGraphAllergies() {
    const dataCsv = await getData()
    const allergies = dataCsv.map((data) => data['Allergies alimentaires'])
    
    let countAllergic = filteredDataFood(allergies, 'Oui').length
    let countNotAllergic = filteredDataFood(allergies, 'Non').length

    let dataGraph = [countAllergic, countNotAllergic]

    createGraph('.allergies', dataGraph, ['Oui', 'Non'])

}

async function createGraphNbMealForDay() {
    const dataCsv = await getData()
    const nbMealForDay = dataCsv.map((data) => data['Nombre de repas par jours'])

    let oneMealForDay = filteredDataFood(nbMealForDay, 1).length
    let twoMealForDay = filteredDataFood(nbMealForDay, 2).length
    let threeMealForDay = filteredDataFood(nbMealForDay, 3).length
    let fourMealForDay = filteredDataFood(nbMealForDay, 4).length
    let fiveMealForDay = filteredDataFood(nbMealForDay, 5).length

    let dataGraph = [oneMealForDay, twoMealForDay, threeMealForDay, fourMealForDay, fiveMealForDay]

    createGraph('.number-meal-day', dataGraph, MEAL_FOR_DAY)
}
