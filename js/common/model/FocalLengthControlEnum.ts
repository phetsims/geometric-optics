// Copyright 2021, University of Colorado Boulder

/**
 * FocalPointControlEnum identifies the method used to control focal length.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';

const FocalLengthControlValues = [ 'direct', 'indirect' ] as const;
type FocalLengthControlEnum = ( typeof FocalLengthControlValues )[number];

//TODO is this OK? We're registering values, not type, and it doesn't match the filename.
geometricOptics.register( 'FocalLengthControlValues', FocalLengthControlValues );

export default FocalLengthControlEnum;
export { FocalLengthControlValues };
