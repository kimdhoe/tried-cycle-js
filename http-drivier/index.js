import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { a, button, div, h1, h4, makeDOMDriver } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'

const request = () => {
  const randomN = Math.round(Math.random() * 9) + 1

  return {
    url: 'http://jsonplaceholder.typicode.com/users/' + String(randomN),
    category: 'users',
    method: 'GET'
  }
}

const render = (user) =>
  div([
    button('.get-random', 'Get random user'),
    user === null ? null : div('.user-details', [
      h1('.user-name',  user.name),
      h4('.user-email', user.email),
      a('.user-website', { href: user.website }, user.website)
    ])
  ])

const main = (sources) => {
  const clickEv$ = sources.DOM.select('.get-random').events('click')

  const request$ = clickEv$
    .map(request)

  const response$$ = sources.HTTP.select('users')
  const response$  = response$$.flatten()
  const user$ = response$
                  .map(response => response.body)
                  .startWith(null)


  const sinks = {
    DOM: user$.map(render),
    HTTP: request$
  }

  return sinks
}


const drivers = { DOM:  makeDOMDriver('#app')
                , HTTP: makeHTTPDriver()
                }

run(main, drivers)
