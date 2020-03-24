import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
	SEARCH_USERS,
	GET_USER,
	GET_REPOS,
	CLEAR_USERS,
	SET_LOADING,
	NOT_FOUND
} from '../types';

const GithubState = props => {
	const initialState = {
		users: [],
		user: {},
		repos: [],
		loading: false,
		notFound: false
	};

	const [state, dispatch] = useReducer(GithubReducer, initialState);

	const searchUsers = async text => {
		setLoading();
		const res = await axios.get(
			`https://api.github.com/search/users?q=${text}`,
			{
				auth: {
					username: process.env.REACT_APP_GITHUB_CLIENT_ID,
					password: process.env.REACT_APP_GITHUB_CLIENT_SECRET
				}
			}
		);
		dispatch({
			type: SEARCH_USERS,
			payload: res.data.items
		});
	};

	const getUser = async username => {
		try {
			setLoading();
			const res = await axios.get(`https://api.github.com/users/${username}`, {
				auth: {
					username: process.env.REACT_APP_GITHUB_CLIENT_ID,
					password: process.env.REACT_APP_GITHUB_CLIENT_SECRET
				}
			});
			dispatch({
				type: GET_USER,
				payload: res.data
			});
		} catch (err) {
			dispatch({
				type: NOT_FOUND,
				payload: true
			});
		}
	};

	const getUserRepos = async username => {
		try {
			setLoading();
			const res = await axios.get(
				`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`,
				{
					auth: {
						username: process.env.REACT_APP_GITHUB_CLIENT_ID,
						password: process.env.REACT_APP_GITHUB_CLIENT_SECRET
					}
				}
			);
			dispatch({
				type: GET_REPOS,
				payload: res.data
			});
		} catch (err) {
			dispatch({
				type: NOT_FOUND,
				payload: true
			});
		}
	};

	const clearUsers = () => dispatch({ type: CLEAR_USERS });
	const setLoading = () => dispatch({ type: SET_LOADING });

	return (
		<GithubContext.Provider
			value={{
				users: state.users,
				user: state.user,
				repos: state.repos,
				loading: state.loading,
				notFound: state.notFound,
				searchUsers,
				clearUsers,
				getUser,
				getUserRepos
			}}
		>
			{props.children}
		</GithubContext.Provider>
	);
};

export default GithubState;
