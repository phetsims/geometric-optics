// Copyright 2022, University of Colorado Boulder

/**
 * OpticalImageType is used to identify whether an optical image is real or virtual. While a boolean would usually
 * have sufficed, an enumeration presents better in Studio.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const OpticalImageTypeValues = [ 'real', 'virtual' ] as const;
type OpticalImageType = ( typeof OpticalImageTypeValues )[number];

export type { OpticalImageType };
export { OpticalImageTypeValues };

