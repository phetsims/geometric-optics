// Copyright 2021, University of Colorado Boulder

//TYPESCRIPT what is the pattern for string enums?
/**
 * FocalPointControlEnum identifies the method used to control focal length.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';

const FocalLengthControlValues = [ 'direct', 'indirect' ] as const;
type FocalLengthControlEnum = ( typeof FocalLengthControlValues )[number];

geometricOptics.register( 'FocalLengthControlValues', FocalLengthControlValues );

export default FocalLengthControlEnum;
export { FocalLengthControlValues };
