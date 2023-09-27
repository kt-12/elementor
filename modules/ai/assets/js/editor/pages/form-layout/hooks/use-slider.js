import { useState, useEffect } from 'react';

const useSlider = ( { slidesCount = 0, slidesPerPage = 3, gapPercentage = 2 } = {} ) => {
	const [ currentPage, setCurrentPage ] = useState( 1 );

	const gapsCount = slidesPerPage - 1;
	const slideWidthPercentage = ( 100 - ( gapPercentage * gapsCount ) ) / slidesPerPage;
	const offsetXPercentage = ( ( ( slideWidthPercentage + gapPercentage ) * slidesPerPage ) * ( currentPage - 1 ) ) * -1;
	const pagesCount = Math.ceil( slidesCount / slidesPerPage );

	useEffect( () => {
		// In cases when the slidesCount value was reduced, we need to navigate to the last page.
		if ( currentPage > 1 && currentPage > pagesCount ) {
			setCurrentPage( pagesCount );
		}
	}, [ pagesCount ] );

	return {
		currentPage,
		setCurrentPage,
		pagesCount,
		slidesPerPage,
		gapPercentage,
		offsetXPercentage,
		slideWidthPercentage,
	};
};

export default useSlider;
