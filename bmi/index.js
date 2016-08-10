import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { p, h2, div, makeDOMDriver } from '@cycle/dom'

import isolate from '@cycle/isolate'

import LabeledSlider from './LabeledSlider'

function bmi (weight, height) {
  const heightMeters = height * 0.01
  return Math.round(weight / (heightMeters * heightMeters))
}

function IsolatedLabeledSlider(sources) {
  return isolate(LabeledSlider)(sources)
}

function view(bmi$, weightVDom$, heightVDom$) {
  return xs.combine(bmi$, weightVDom$, heightVDom$)
    .map(([x, weightVDom, heightVDom]) =>
      div([
        weightVDom,
        heightVDom,
        h2(`BMI is ${x}.`)
      ])
    )
}

function main (sources) {
  const weightProps$ = xs.of({
    label: 'Weight', unit: 'kg', min: 40, max: 150, init: 70
  })
  const heightProps$ = xs.of({
    label: 'Height', unit: 'cm', min: 140, max: 220, init: 170
  })

  const weightSources = {DOM: sources.DOM, props: weightProps$}
  const heightSources = {DOM: sources.DOM, props: heightProps$}

  const weightSinks = IsolatedLabeledSlider(weightSources)
  const heightSinks = IsolatedLabeledSlider(heightSources)

  const weightValue$ = weightSinks.value
  const heightValue$ = heightSinks.value
  const weightVDom$  = weightSinks.DOM
  const heightVDom$  = heightSinks.DOM

  const bmi$ = xs.combine(weightValue$, heightValue$)
    .map(([w, h]) => bmi(w, h))

  const vdom$ = view(bmi$, weightVDom$, heightVDom$)

  const sinks = {
    DOM: vdom$
  }

  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
