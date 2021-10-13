// Copyright 2021, University of Colorado Boulder

/**
 * VisibleProperties contains visibleProperty instances for things in the view. These Properties are controlled
 * by checkboxes and toggle buttons.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../model/Optic.js';

class VisibleProperties {

  constructor( opticType ) {

    // @public visibility of the two focal points
    this.focalPointVisibleProperty = new BooleanProperty( true );

    // @public visibility of the virtual image, when present
    this.virtualImageVisibleProperty = new BooleanProperty( true );

    // @public visibility of the labels
    this.labelsVisibleProperty = new BooleanProperty( false );

    // @public visibility of the second 'point' (point of interest on object, or light source)
    this.secondPointVisibleProperty = new BooleanProperty( false );

    // @public visibility of the guides, which are irrelevant for mirror
    this.guidesVisibleProperty = new BooleanProperty( false, {
      validValues: opticType === ( Optic.Type.LENS ) ? [ true, false ] : [ false ]
    } );

    // @public visibility of the ray tracing
    //TODO this is poorly named, it controls visibility of more than rays
    this.rayTracingVisibleProperty = new BooleanProperty( true );
  }

  /**
   * @public
   */
  reset() {
    this.focalPointVisibleProperty.reset();
    this.virtualImageVisibleProperty.reset();
    this.labelsVisibleProperty.reset();
    this.secondPointVisibleProperty.reset();
    this.guidesVisibleProperty.reset();
    this.rayTracingVisibleProperty.reset();
  }
}

geometricOptics.register( 'VisibleProperties', VisibleProperties );
export default VisibleProperties;