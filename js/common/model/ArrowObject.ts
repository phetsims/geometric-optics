// Copyright 2021-2022, University of Colorado Boulder

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
  stroke: ColorDef
} & OpticalObjectOptions;

class ArrowObject extends OpticalObject {

  public readonly fill: ColorDef;
  public readonly stroke: ColorDef;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: ArrowObjectOptions ) {

    const options = merge( {}, providedOptions );

    super( options );

    this.fill = options.fill;
    this.stroke = options.stroke;

    //TODO more?
  }
}

geometricOptics.register( 'ArrowObject', ArrowObject );
export default ArrowObject;