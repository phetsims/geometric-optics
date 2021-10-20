// Copyright 2021, University of Colorado Boulder

/**
 * VisibleProperties contains visibleProperty instances for things in the view. These Properties are controlled
 * by checkboxes and toggle buttons.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';

class VisibleProperties {

  /**
   * @param {Optic.Type} opticType
   * @param {Object} [options]
   */
  constructor( opticType, options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public visibility of the two focal points
    this.focalPointsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'focalPointsVisibleProperty' )
    } );

    // @public visibility of the virtual image, when present
    this.virtualImageVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'virtualImageVisibleProperty' )
    } );

    // @public visibility of the labels
    this.labelsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'labelsVisibleProperty' )
    } );

    // @public visibility of the second 'point' (point of interest on object, or light source)
    this.secondPointVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'secondPointVisibleProperty' )
    } );

    // @public visibility of the guides, which are irrelevant for mirror
    this.guidesVisibleProperty = new BooleanProperty( false, {
      validValues: opticType === ( Optic.Type.LENS ) ? [ true, false ] : [ false ],
      tandem: options.tandem.createTandem( 'guidesVisibleProperty' )
    } );

    // @public visibility of the ray tracing
    //TODO this is poorly named, it controls visibility of rays + real image + virtual image
    this.rayTracingVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'rayTracingVisibleProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
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