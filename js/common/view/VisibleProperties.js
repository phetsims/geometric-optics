// Copyright 2021, University of Colorado Boulder

/**
 * View-specific Properties for checkboxes.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class VisibleProperties {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<boolean>} control the visibility of the two focal points
    this.visibleFocalPointProperty = new BooleanProperty( true );

    // @public {Property.<boolean>} control the visibility of the virtual image, when present
    this.visibleVirtualImageProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} control the visibility of the movable point
    this.visibleMovablePointProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} controls the visibility of the guides
    this.visibleGuidesProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} controls the visibility of the ray tracing
    this.visibleRayTracingProperty = new BooleanProperty( true );

    // @public {Property.<boolean>} controls the visibility of the labels
    this.visibleLabelsProperty = new BooleanProperty( false );

  }

  /**
   * Resets the properties
   * @public
   */
  reset() {
    this.visibleFocalPointProperty.reset();
    this.visibleVirtualImageProperty.reset();
    this.visibleMovablePointProperty.reset();
    this.visibleGuidesProperty.reset();
    this.visibleRayTracingProperty.reset();
    this.visibleLabelsProperty.reset();
  }
}

geometricOptics.register( 'VisibleProperties', VisibleProperties );
export default VisibleProperties;
