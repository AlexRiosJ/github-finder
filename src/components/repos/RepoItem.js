import React from 'react';
import PropTypes from 'prop-types';

const RepoItem = ({ repo }) => {
	return (
		<div className='card'>
			<h3>
				<a href={repo.html_url} target='_blank' rel='noopener noreferrer'>
					{repo.name}
				</a>
			</h3>
			<h5>{repo.description}</h5>
		</div>
	);
};

RepoItem.propTypes = {
	repo: PropTypes.object.isRequired
};

export default RepoItem;
