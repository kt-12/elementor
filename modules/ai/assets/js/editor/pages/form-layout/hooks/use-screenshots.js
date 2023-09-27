import { useState, useRef } from 'react';
import useScreenshot from './use-screenshot';

const PENDING_VALUE = { isPending: true };

const useScreenshots = ( { onData } ) => {
	const [ screenshots, setScreenshots ] = useState( [] );

	const screenshotsData = [
		useScreenshot( 0, onData ),
		useScreenshot( 1, onData ),
		useScreenshot( 2, onData ),
	];

	const screenshotsGroupCount = screenshotsData.length;

	const error = screenshotsData.every( ( s ) => s?.error ) ? screenshotsData[ 0 ].error : '';
	const isLoading = screenshotsData.some( ( s ) => s?.isLoading );

	const abortController = useRef( null );

	const abort = () => abortController.current?.abort();

	const createScreenshots = async ( prompt ) => {
		abortController.current = new AbortController();

		const onGenerate = ( screenshot ) => {
			setScreenshots( ( prev ) => {
				const updatedData = [ ...prev ];
				const pendingIndex = updatedData.indexOf( PENDING_VALUE );

				updatedData[ pendingIndex ] = screenshot;

				return updatedData;
			} );

			return true;
		};

		const onError = () => {
			setScreenshots( ( prev ) => {
				const updatedData = [ ...prev ];
				const pendingIndex = updatedData.lastIndexOf( PENDING_VALUE );

				updatedData[ pendingIndex ] = { isError: true };

				return updatedData;
			} );

			return false;
		};

		const promises = screenshotsData.map( ( { generate } ) => {
			return generate( prompt, abortController.current.signal )
				.then( onGenerate )
				.catch( onError );
		} );

		const results = await Promise.all( promises );
		const isAllFailed = results.every( ( value ) => false === value );

		if ( isAllFailed ) {
			setScreenshots( ( prev ) => {
				const updatedData = [ ...prev ];

				updatedData.splice( screenshotsGroupCount * -1 );

				return updatedData;
			} );
		}
	};

	const generate = ( prompt ) => {
		const placeholders = Array( screenshotsGroupCount ).fill( PENDING_VALUE );

		setScreenshots( placeholders );

		createScreenshots( prompt );
	};

	const regenerate = ( prompt ) => {
		const placeholders = Array( screenshotsGroupCount ).fill( PENDING_VALUE );

		setScreenshots( ( prev ) => [ ...prev, ...placeholders ] );

		createScreenshots( prompt );
	};

	return {
		generate,
		regenerate,
		screenshots,
		isLoading,
		error,
		abort,
	};
};

export default useScreenshots;
