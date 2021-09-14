// Copyright 2021, University of Colorado Boulder

/**
 * VisibleProperties contains visibleProperty instances for things in the view. These Properties are controlled
 * by checkboxes and toggle buttons.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import geometricOptics from '../../geometricOptics.js';

class VisibleProperties {

  constructor() {

    // @public visibility of the two focal points
    this.focalPointVisibleProperty = new BooleanProperty( true );

    // @public visibility of the virtual image, when present
    this.virtualImageVisibleProperty = new BooleanProperty( true );

    // @public visibility of the labels
    this.labelsVisibleProperty = new BooleanProperty( false );

    // @public visibility of the second source
    this.secondSourceVisibleProperty = new BooleanProperty( false );

    // @public visibility of the guides
    this.guidesVisibleProperty = new BooleanProperty( false );

    // @public visibility of the ray tracing
    this.rayTracingVisibleProperty = new BooleanProperty( true );
  }

  /**
   * @public
   */
  reset() {
    this.focalPointVisibleProperty.reset();
    this.virtualImageVisibleProperty.reset();
    this.labelsVisibleProperty.reset();
    this.secondSourceVisibleProperty.reset();
    this.guidesVisibleProperty.reset();
    this.rayTracingVisibleProperty.reset();
  }
}

geometricOptics.register( 'VisibleProperties', VisibleProperties );
export default VisibleProperties;
