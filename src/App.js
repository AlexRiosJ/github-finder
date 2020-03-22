import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import About from './components/pages/About';
import Alert from './components/layout/Alert';
import axios from 'axios';
import './App.css';

class App extends Component {
	state = {
		users: [],
		user: {},
		loading: false,
		alert: null
	};

	searchUsers = async text => {
		this.setState({ loading: true });
		const res = await axios.get(
			`https://api.github.com/search/users?q=${text}`,
			{},
			{
				auth: {
					username: process.env.REACT_APP_GITHUB_CLIENT_ID,
					password: process.env.REACT_APP_GITHUB_CLIENT_SECRET
				}
			}
		);
		this.setState({ users: res.data.items, loading: false });
	};

	getUser = async username => {
		this.setState({ loading: true });
		const res = await axios.get(
			`https://api.github.com/users/${username}`,
			{},
			{
				auth: {
					username: process.env.REACT_APP_GITHUB_CLIENT_ID,
					password: process.env.REACT_APP_GITHUB_CLIENT_SECRET
				}
			}
		);
		this.setState({ user: res.data, loading: false });
	};

	clearUsers = () => {
		this.setState({ users: [], loading: false });
	};

	setAlert = (message, type) => {
		this.setState({ alert: { message, type } });
		setTimeout(() => this.setState({ alert: null }), 5000);
	};

	render() {
		const { users, user, loading, alert } = this.state;

		return (
			<Router>
				<div className='App'>
					<Navbar />
					<div className='container'>
						<Switch>
							<Route
								exact
								path='/'
								render={props => (
									<Fragment>
										<Alert alert={alert} />
										<Search
											searchUsers={this.searchUsers}
											clearUsers={this.clearUsers}
											showClear={users.length > 0}
											setAlert={this.setAlert}
										/>
										<Users loading={loading} users={users} />
									</Fragment>
								)}
							/>
							<Route exact path='/about' component={About} />
							<Route
								exact
								path='/user/:login'
								render={props => (
									<User
										{...props}
										getUser={this.getUser}
										user={user}
										loafing={loading}
									/>
								)}
							/>
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
