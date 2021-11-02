// Copyright 2021, University of Colorado Boulder

//TODO add 'flat' for mirror

import geometricOptics from '../../geometricOptics.js';

/**
 * OpticShapeEnum identifies the shape of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const OpticShapeValues = [ 'convex', 'concave' ] as const;
type OpticShapeEnum = ( typeof OpticShapeValues )[number];

//TODO is this OK? We're registering values, not type, and it doesn't match the filename.
geometricOptics.register( 'OpticShapeValues', OpticShapeValues );

export { OpticShapeValues };
export default OpticShapeEnum;