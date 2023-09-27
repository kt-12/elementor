import { Box } from '@elementor/ui';
import { AIIcon } from '@elementor/icons';

const VariationsPlaceholder = () => {
	return (
		<Box sx={ { overflowY: 'scroll' } } flexGrow={ 1 }>
			<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={ 3 }>
				{
					Array( 4 ).fill( true ).map( ( _, index ) => (
						<Box
							key={ `placeholder-${ index }` }
							display="flex"
							justifyContent="center"
							alignItems="center"
							sx={ { bgcolor: 'action.selected', height: 336 } }
						>
							<AIIcon color="secondary" sx={ { fontSize: 36 } } />
						</Box>
					) )
				}
			</Box>
		</Box>
	);
};

VariationsPlaceholder.propTypes = {};

export default VariationsPlaceholder;
