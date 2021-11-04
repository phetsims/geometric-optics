// Copyright 2021, University of Colorado Boulder

/**
 * VisibleProperties contains visibleProperty instances for things in the view. These Properties are controlled
 * by checkboxes and toggle buttons.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import OpticTypeEnum from '../model/OpticTypeEnum.js';

class VisibleProperties {

  // visibility of the two focal points
  readonly focalPointsVisibleProperty: BooleanProperty;

  // visibility of the virtual image, when present
  readonly virtualImageVisibleProperty: BooleanProperty;

  // visibility of the labels
  readonly labelsVisibleProperty: BooleanProperty;

  // visibility of the second 'point' (point of interest on object, or light source)
  readonly secondPointVisibleProperty: BooleanProperty;

  // visibility of the guides, which are irrelevant for mirror
  readonly guidesVisibleProperty: BooleanProperty;

  // visibility of the ray tracing
  //TODO this is poorly named, it controls visibility of rays + real image + virtual image
  readonly rayTracingVisibleProperty: BooleanProperty;

  /**
   * @param {OpticTypeEnum} opticType
   * @param {Object} [options]
   */
  constructor( opticType: OpticTypeEnum, options?: any ) { //TYPESCRIPT any

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    this.focalPointsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'focalPointsVisibleProperty' )
    } );

    this.virtualImageVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'virtualImageVisibleProperty' )
    } );

    this.labelsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'labelsVisibleProperty' )
    } );

    this.secondPointVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'secondPointVisibleProperty' )
    } );

    this.guidesVisibleProperty = new BooleanProperty( false, {
      validValues: ( opticType === 'lens' ) ? [ true, false ] : [ false ],
      tandem: options.tandem.createTandem( 'guidesVisibleProperty' )
    } );

    this.rayTracingVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'rayTracingVisibleProperty' )
    } );
  }

  public reset() {
    this.focalPointsVisibleProperty.reset();
    this.virtualImageVisibleProperty.reset();
    this.labelsVisibleProperty.reset();
    this.secondPointVisibleProperty.reset();
    this.guidesVisibleProperty.reset();
    this.rayTracingVisibleProperty.reset();
  }
}

geometricOptics.register( 'VisibleProperties', VisibleProperties );
export default VisibleProperties;