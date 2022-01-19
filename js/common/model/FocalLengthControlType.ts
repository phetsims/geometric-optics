// Copyright 2021-2022, University of Colorado Boulder

/**
 * FocalPointControlEnum is a union type for the methods used control focal length.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const FocalLengthControlValues = [ 'direct', 'indirect' ] as const;
type FocalLengthControlType = ( typeof FocalLengthControlValues )[number];

export { FocalLengthControlValues };
export type { FocalLengthControlType as default };
