import React, { useEffect, useContext } from 'react';
import GithubContext from '../../context/github/githubContext';

const NotFound = () => {
	const githubContext = useContext(GithubContext);
	const { getNotFoundGif, notFoundGif } = githubContext;

	useEffect(() => {
		getNotFoundGif();
		// eslint-disable-next-line
	}, []);

	return (
		<div>
			<h1>404 Not Found</h1>
			<p className='lead'>The page you are looking for does not exist...</p>
			<div className='text-center'>
				<img src={notFoundGif} alt='' />
			</div>
		</div>
	);
};

export default NotFound;
