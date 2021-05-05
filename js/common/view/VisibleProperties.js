// Copyright 2021, University of Colorado Boulder

/**
 * View-specific Properties for checkboxes.
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

    this.visibleFocalPointProperty = new BooleanProperty( true );
    this.visibleRulersProperty = new BooleanProperty( false );
    this.visibleVirtualImageProperty = new BooleanProperty( false );
    this.visibleMovablePointProperty = new BooleanProperty( false );
    this.visibleGuidesProperty = new BooleanProperty( false );
  }

  /**
   * Resets the properties
   * @public
   */
  reset() {
    this.visibleFocalPointProperty.reset();
    this.visibleRulersProperty.reset();
    this.visibleVirtualImageProperty.reset();
    this.visibleMovablePointProperty.reset();
    this.visibleGuidesProperty.reset();

  }
}

geometricOptics.register( 'VisibleProperties', VisibleProperties );
export default VisibleProperties;
