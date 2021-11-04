// Copyright 2021, University of Colorado Boulder

/**
 * RaysMode is the enumeration for the different representations of rays, as set by the 'Rays' radio button group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';

const RaysModeValues = [ 'marginal', 'principal', 'many', 'none' ] as const;
type RaysModeEnum = ( typeof RaysModeValues )[number];

//TYPESCRIPT is this OK? We're registering values, not type, and it doesn't match the filename.
geometricOptics.register( 'RaysModeValues', RaysModeValues );

export { RaysModeValues };
export default RaysModeEnum;