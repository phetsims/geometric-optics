// Copyright 2022, University of Colorado Boulder

/**
 * ObjectDragMode enumerates the constraints on dragging of optical objects. While a boolean would have sufficed
 * (and was in fact originally used) an enumeration made the code clearer, and improved the presentation in Studio.
 * See https://github.com/phetsims/geometric-optics/issues/364
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const ObjectDragModeValues = [
  'freeDragging', // optical objects can be dragged freely
  'horizontalDragging' // dragging is constrained to horizontal, parallel to the optical axis
] as const;

export type ObjectDragMode = ( typeof ObjectDragModeValues )[number];