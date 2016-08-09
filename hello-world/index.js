import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { div, p, hr, h1, input, label, makeDOMDriver } from '@cycle/dom'

const render = (name) =>
  div([ label('name: ')
      , input('.field', { type: 'text' })
      , hr()
      , h1(`Hello ${name}!`)
      ]
     )

const main = sources => {
  const inputEv$ = sources.DOM.select('.field').events('input')
  const name$    = inputEv$.map(ev => ev.target.value).startWith('World')
  const vdom$    = name$.map(render)

  const sinks = { DOM: vdom$ }

  return sinks
}

const drivers = { DOM: makeDOMDriver('#app') }

run(main, drivers)
