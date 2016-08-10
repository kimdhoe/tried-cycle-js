import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { p, input, h2, div, makeDOMDriver } from '@cycle/dom'

const bmi = (weight, height) => {
  const heightMeters = height * 0.01
  return Math.round(weight / (heightMeters * heightMeters))
}

const main = (sources) => {
  const changeWeight$ = sources.DOM.select('.weight').events('input')
  const changeHeight$ = sources.DOM.select('.height').events('input')

  const weight$ = changeWeight$.map(ev => ev.target.value).startWith(70)
  const height$ = changeHeight$.map(ev => ev.target.value).startWith(170)

  const world$ = xs.combine(weight$, height$)
    .map(([weight, height]) => ({bmi: bmi(weight, height), weight, height}))

  const sinks = {
    DOM: world$.map(({bmi, weight, height}) =>
      div([
        div([
          p(`Weight: ${weight}kg`),
          input('.weight', {
            attrs: {type: 'range', min: 40, max: 150, value: weight}
          })
        ]),
        div([
          p(`Height: ${height}cm`),
          input('.height', {
            attrs: {type: 'range', min: 140, max: 220, value: height}
          })
        ]),
        h2(`BMI is ${bmi}.`)
      ])
    )
  }

  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
