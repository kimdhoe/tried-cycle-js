import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { div, p, makeDOMDriver } from '@cycle/dom'

const intent = DOMSource =>
  DOMSource.events('click')

const model = reset$ =>
  reset$
    .startWith(null)
    .map(() => xs.periodic(1000))
    .flatten()

const main = sources => {
  const reset$  = intent(sources.DOM.select('.seconds'))
  const second$ = model(reset$)
  const vdom$   = second$
                    .map( n => div( '.seconds'
                                  , [ p(`Seconds elapsed: ${n}`) ]
                                  )
                        )


  const sinks = { DOM: vdom$ }

  return sinks
}

const drivers = { DOM: makeDOMDriver('#app') }

run(main, drivers)
