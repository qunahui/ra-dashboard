import React, { Component, Suspense } from 'react'
import Spinners from './components/Spinners'
import { Switch, Route } from 'react-router-dom'
const Page404 = React.lazy(() => import('./pages/Page404'))
const DefaultLayout = React.lazy(() => import('./pages/DefaultLayout'))

class App extends Component {
  render() {
    return (
      <div>
        <Suspense fallback={<Spinners pulse />}>
          <Switch>
            <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
            <Route path="/" name="Slide" render={(props) => <DefaultLayout {...props} />} />
          </Switch>
        </Suspense>
      </div>
    )
  }
}

export default App
