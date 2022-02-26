// Copyright 2022, University of Colorado Boulder

/**
 * FocalPointControlEnum is a union type for the models of focal length.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const FocalLengthModelTypeValues = [ 'direct', 'indirect' ] as const;
type FocalLengthModelType = ( typeof FocalLengthModelTypeValues )[number];

export type { FocalLengthModelType };
export { FocalLengthModelTypeValues };
