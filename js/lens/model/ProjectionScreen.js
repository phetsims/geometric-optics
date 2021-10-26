// Copyright 2021, University of Colorado Boulder

/**
 * ProjectionScreen is the model of the projection screen. It has a position, and methods for computing Shapes needed
 * by the view.
 *
 * @author Martin Veillette
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Line from '../../../../kite/js/segments/Line.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

// defines the shape of the screen, in cm. Coordinates are relative to the center (0,0) of the screen.
const SCREEN_CORNERS = {
  LEFT_TOP: new Vector2( -20, 56 ),
  LEFT_BOTTOM: new Vector2( -20, -59 ),
  RIGHT_BOTTOM: new Vector2( 22, -73 ),
  RIGHT_TOP: new Vector2( 22, 67 )
};

class ProjectionScreen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {Vector2} initial position of the center of the screen
      initialPosition: new Vector2( 200, 0 ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public position of the center of the screen
    this.positionProperty = new Vector2Property( options.initialPosition, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }

  /**
   * Gets the vertical line that bisects the screen, in the model's global coordinate frame.
   * @public
   * @returns {Shape}
   */
  getBisectorLine() {
    const top = SCREEN_CORNERS.LEFT_TOP.average( SCREEN_CORNERS.RIGHT_TOP );
    const bottom = SCREEN_CORNERS.LEFT_BOTTOM.average( SCREEN_CORNERS.RIGHT_BOTTOM );
    const verticalLine = new Line( top, bottom );
    return this.translatedShape( verticalLine );
  }

  /**
   * Gets the shape of the screen, in the model's global coordinate frame.
   * @public
   * @returns {Shape}
   */
  getScreenShape() {
    const screenShape = new Shape()
      .moveToPoint( SCREEN_CORNERS.LEFT_TOP )
      .lineToPoint( SCREEN_CORNERS.LEFT_BOTTOM )
      .lineToPoint( SCREEN_CORNERS.RIGHT_BOTTOM )
      .lineToPoint( SCREEN_CORNERS.RIGHT_TOP )
      .close();
    return this.translatedShape( screenShape );
  }

  /**
   * Returns a shape translated by the model position of the projection screen.
   * The provided Shape should be in the projection screen's local coordinate frame.
   * The resulting Shape will be in the model's global coordinate frame.
   * @private
   * @param {Shape} shape - in the projection screen's local coordinate frame
   * @returns {Shape}
   */
  translatedShape( shape ) {
    return shape.transformed( Matrix3.translationFromVector( this.positionProperty.value ) );
  }
}

geometricOptics.register( 'ProjectionScreen', ProjectionScreen );
export default ProjectionScreen;