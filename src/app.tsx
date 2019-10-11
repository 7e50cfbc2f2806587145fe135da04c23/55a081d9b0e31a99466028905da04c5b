import React, {Component, Fragment} from 'react';
import {Redirect, Route, Switch} from 'react-router';
import {Routes} from 'lib/routes';
import {Home} from './home/home';

export type AppProps = {
}

export class App extends Component<AppProps> {
  render() {
    return <Fragment>
		<Switch>
			<Route exact path={Routes.home()} component={Home}/>
			<Redirect from="*" to={Routes.home()}/>
		</Switch>
	</Fragment>
  }
}
