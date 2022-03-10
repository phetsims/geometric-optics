// Copyright 2022, University of Colorado Boulder

/**
 * OpticalImageType is used to identify whether an optical image is real or virtual. While a boolean would usually
 * have sufficed, a string union presents better in Studio.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const OpticalImageTypeValues = [ 'real', 'virtual' ] as const;
export type OpticalImageType = ( typeof OpticalImageTypeValues )[number];