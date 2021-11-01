// Copyright 2021, University of Colorado Boulder

//TODO add 'flat' for mirror

/**
 * OpticShapeEnum identifies the shape of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const OpticShapeValues = [ 'convex', 'concave' ] as const;
type OpticShapeEnum = ( typeof OpticShapeValues )[number];

export { OpticShapeValues };
export default OpticShapeEnum;