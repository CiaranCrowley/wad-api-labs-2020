import React from 'react';
import { useContext} from 'react';
import { MoviesContext } from './moviesContext';

export const PublicPage = () => {
	return <h2>Public page</h2>
}
export const Movies = () => {
	const context = useContext(MoviesContext);
	return <>
		<h2>Movies Data </h2>
		<div>
			{ context.movies.map(movie => { return <>{movie.id},{movie.title}<br /></> }) }
		</div>
	</>
}
export const Profile = () => {
	return <h2>My Profile </h2>
}
export const HomePage = () => {
	return  <h2>Home page</h2>
}
 