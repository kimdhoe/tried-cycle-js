import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { div, input, p, makeDOMDriver } from '@cycle/dom'

function intent(DOMSource) {
  return DOMSource.select('.slider').events('input')
    .map(ev => ev.target.value)
}

function model(newValue$, props$) {
  return props$
    .map(props =>
      newValue$
        .map(value => ({...props, value}))
        .startWith({...props, value: props.init}))
    .flatten()
    .remember()
}

function view(world$) {
  return world$.map(world =>
    div('.labeled-slider', [
      p('.label', `${world.label}: ${world.value}${world.unit}`),
      input('.slider', {
        attrs: {
          type:  'range',
          min:   world.min,
          max:   world.max,
          value: world.value
        }
      })
    ])
  )
}

function LabeledSlider(sources) {
  const newValue$ = intent(sources.DOM)
  const world$    = model(newValue$, sources.props)
  const vdom$     = view(world$)

  const sinks = {
    DOM: vdom$,
    value: world$.map(world => world.value)
  }

  return sinks
}

export default LabeledSlider
