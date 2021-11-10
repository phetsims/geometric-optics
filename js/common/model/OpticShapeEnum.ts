// Copyright 2021, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/227 add 'flat' for Mirror
/**
 * OpticShapeEnum identifies the shape of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';

const OpticShapeValues = [ 'convex', 'concave' ] as const;
type OpticShapeEnum = ( typeof OpticShapeValues )[number];

//TODO is this OK? We're registering values, not type, and it doesn't match the filename.
geometricOptics.register( 'OpticShapeValues', OpticShapeValues );

export default OpticShapeEnum;
export { OpticShapeValues };
