// Copyright 2022, University of Colorado Boulder

/**
 * FocalPointControlEnum is a union type for the models of focal length.
 * See GOOptions.focalLengthModelTypeProperty for the semantics of 'direct' and 'indirect'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const FocalLengthModelTypeValues = [ 'direct', 'indirect' ] as const;
export type FocalLengthModelType = ( typeof FocalLengthModelTypeValues )[number];