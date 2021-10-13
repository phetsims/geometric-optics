// Copyright 2021, University of Colorado Boulder

/**
 * ProjectorScreen is the model of the projector screen. It has a position, and methods for computing Shapes needed
 * by the view.
 *
 * @author Martin Veillette
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Line from '../../../../kite/js/segments/Line.js';
import Shape from '../../../../kite/js/Shape.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import geometricOptics from '../../geometricOptics.js';

// constants
const MASK_CORNERS = GeometricOpticsConstants.PROJECTOR_SCREEN_MASK_CORNERS;

class ProjectorScreen {

  constructor() {

    // @public position of the center of the screen
    this.positionProperty = new Vector2Property( GeometricOpticsConstants.PROJECTOR_SCREEN_INITIAL_POSITION );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }

  /**
   * Gets the vertical line that bisects the middle portion of the screen
   * @public
   * @returns {Shape}
   */
  getBisectorLine() {

    // convenience variable to create a line that splits the middle of the screen vertically
    const top = MASK_CORNERS.LEFT_TOP.average( MASK_CORNERS.RIGHT_TOP );
    const bottom = MASK_CORNERS.LEFT_BOTTOM.average( MASK_CORNERS.RIGHT_BOTTOM );

    const verticalLine = new Line( top, bottom );

    // get the vertical line translated by the model position of the screen projector
    return this.translatedShape( verticalLine );
  }

  /**
   * Gets the shape of the screen translated by the model position of the screenProjector
   * @public
   * @returns {Shape}
   */
  getScreenShape() {
    const screenShape = new Shape()
      .moveToPoint( MASK_CORNERS.LEFT_TOP )
      .lineToPoint( MASK_CORNERS.LEFT_BOTTOM )
      .lineToPoint( MASK_CORNERS.RIGHT_BOTTOM )
      .lineToPoint( MASK_CORNERS.RIGHT_TOP )
      .close();
    return this.translatedShape( screenShape );
  }

  /**
   * Returns a shape translated by the model position of the screenProjector
   * @private
   * @param {Shape} shape
   * @returns {Shape}
   */
  translatedShape( shape ) {
    return shape.transformed( Matrix3.translationFromVector( this.positionProperty.value ) );
  }
}

geometricOptics.register( 'ProjectorScreen', ProjectorScreen );
export default ProjectorScreen;