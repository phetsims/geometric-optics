// Copyright 2022, University of Colorado Boulder

/**
 * Use PickRequired to pick properties of a type T and make them required.
 * This is useful when picking superclass options that you want to expose in a subclass API.
 *
 * Example:
 * type MyClassOptions = PickRequired<PhetioObject, 'tandem', 'phetioDocumentation'>;
 * Result:
 * { tandem: Tandem, phetioDocumentation: string }
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export type PickRequired<T, list extends keyof T> = Pick<Required<T>, list>;