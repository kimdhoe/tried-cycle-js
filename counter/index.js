import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { button, p, span, div, makeDOMDriver } from '@cycle/dom'

const render = (num) =>
  div([ button('.dec', 'Decrement')
      , button('.inc', 'Increment')
      , p(`Counter: ${num}`)
      ]
     )

const main = sources => {
  const decClick   = sources.DOM.select('.dec').events('click')
  const incClick   = sources.DOM.select('.inc').events('click')

  const decAction$ = decClick.mapTo(-1)
  const incAction$ = incClick.mapTo(+1)

  const action$    = xs.merge( decAction$, incAction$ )

  const count$     = action$.fold((acc, x) => acc + x, 0)

  const vdom$      = count$.map(render)

  const sinks = { DOM: vdom$ }

  return sinks
}

const drivers = { DOM: makeDOMDriver('#app') }

run(main, drivers)
