// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObject is the model for arrow objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import merge from '../../../../phet-core/js/merge.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type ArrowObjectOptions = {
  fill: ColorDef
} & OpticalObjectOptions;

class ArrowObject extends OpticalObject {

  public readonly fill: ColorDef;

  /**
   * @param opticalObjectNumber
   * @param opticPositionProperty
   * @param providedOptions
   */
  constructor( opticalObjectNumber: number, opticPositionProperty: IReadOnlyProperty<Vector2>, providedOptions: ArrowObjectOptions ) {

    const options = merge( {}, providedOptions );

    super( opticalObjectNumber, opticPositionProperty, options );

    this.fill = options.fill;
  }
}

geometricOptics.register( 'ArrowObject', ArrowObject );
export default ArrowObject;