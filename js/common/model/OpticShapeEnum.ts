// Copyright 2021, University of Colorado Boulder

//TYPESCRIPT what is the pattern for string enums?
/**
 * OpticShapeEnum identifies the shape of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';

const OpticShapeValues = [ 'convex', 'concave', 'flat' ] as const;
type OpticShapeEnum = ( typeof OpticShapeValues )[number];

geometricOptics.register( 'OpticShapeValues', OpticShapeValues );

export default OpticShapeEnum;
export { OpticShapeValues };
