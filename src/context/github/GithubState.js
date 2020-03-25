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
	NOT_FOUND,
	GET_NOT_FOUND_GIF
} from '../types';

const GithubState = props => {
	const initialState = {
		users: [],
		user: {},
		repos: [],
		loading: false,
		notFound: false,
		notFoundGif: null
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

	const getNotFoundGif = async () => {
		const res = await axios.get(
			`https://api.giphy.com/v1/gifs/random?api_key=${process.env.REACT_APP_GIPHY_API_KEY}&tag=404%20not%20found`
		);
		dispatch({
			type: GET_NOT_FOUND_GIF,
			payload: res.data.data.image_url.replace('media3', 'media')
		});
	};

	return (
		<GithubContext.Provider
			value={{
				users: state.users,
				user: state.user,
				repos: state.repos,
				loading: state.loading,
				notFound: state.notFound,
				notFoundGif: state.notFoundGif,
				searchUsers,
				clearUsers,
				getUser,
				getUserRepos,
				getNotFoundGif
			}}
		>
			{props.children}
		</GithubContext.Provider>
	);
};

export default GithubState;
