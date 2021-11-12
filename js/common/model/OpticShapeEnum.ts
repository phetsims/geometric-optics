// Copyright 2021, University of Colorado Boulder

//TYPESCRIPT what is the pattern for string enums?
/**
 * OpticShapeEnum identifies the shape of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';

//TODO https://github.com/phetsims/geometric-optics/issues/227 add 'flat' for Mirror
const OpticShapeValues = [ 'convex', 'concave' ] as const;
type OpticShapeEnum = ( typeof OpticShapeValues )[number];

geometricOptics.register( 'OpticShapeValues', OpticShapeValues );

export default OpticShapeEnum;
export { OpticShapeValues };
