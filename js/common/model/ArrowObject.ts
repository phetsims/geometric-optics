// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObject is the model for arrow objects.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import merge from '../../../../phet-core/js/merge.js';

type ArrowObjectOptions = {
  fill: ColorDef
} & OpticalObjectOptions;

class ArrowObject extends OpticalObject {

  public readonly fill: ColorDef;
  public static readonly MIN_MAGNITUDE = 20; // cm

  /**
   * @param providedOptions
   */
  constructor( providedOptions: ArrowObjectOptions ) {

    const options = merge( {}, providedOptions );

    super( options );

    this.fill = options.fill;
  }
}

geometricOptics.register( 'ArrowObject', ArrowObject );
export default ArrowObject;