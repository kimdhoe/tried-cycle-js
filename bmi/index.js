import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { p, input, h2, div, makeDOMDriver } from '@cycle/dom'

function bmi (weight, height) {
  const heightMeters = height * 0.01
  return Math.round(weight / (heightMeters * heightMeters))
}

function intent (DOMSource) {
  const changeWeight$ = DOMSource.select('.weight').events('input')
  const changeHeight$ = DOMSource.select('.height').events('input')

  const weight$ = changeWeight$.map(ev => ev.target.value).startWith(70)
  const height$ = changeHeight$.map(ev => ev.target.value).startWith(170)

  return {weight$, height$}
}

function model (weight$, height$) {
  return xs.combine(weight$, height$)
    .map(([weight, height]) => ({bmi: bmi(weight, height), weight, height}))
}

function renderWeightSlider(weight) {
  return div([
    p(`Weight: ${weight}kg`),
    input('.weight', {attrs: {type: 'range', min: 40, max: 150, value: weight}})
  ])
}

function renderHeightSlider(height) {
  return div([
    p(`Height: ${height}cm`),
    input('.height', {attrs: {type: 'range', min: 140, max: 220, value: height}})
  ])
}

function view (world$) {
  return world$.map(({bmi, weight, height}) =>
    div([
      renderWeightSlider(weight),
      renderHeightSlider(height),
      h2(`BMI is ${bmi}.`)
    ])
  )
}

function main (sources) {
  const {weight$, height$} = intent(sources.DOM)
  const world$             = model(weight$, height$)
  const vdom$              = view(world$)

  const sinks = {
    DOM: vdom$
  }

  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
