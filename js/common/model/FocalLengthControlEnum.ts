// Copyright 2021, University of Colorado Boulder

/**
 * FocalPointControlEnum identifies the method used to control focal length.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const FocalLengthControlValues = [ 'direct', 'indirect' ] as const;
type FocalLengthControlEnum = ( typeof FocalLengthControlValues )[number];

export { FocalLengthControlValues, FocalLengthControlEnum as default };