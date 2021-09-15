// Copyright 2021, University of Colorado Boulder

/**
 * Model element of projector screen. A target screen has a position, a screen shape and two spotlights.
 *
 * @author Martin Veillette
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Line from '../../../../kite/js/segments/Line.js';
import Shape from '../../../../kite/js/Shape.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import geometricOptics from '../../geometricOptics.js';
import Spotlight from './Spotlight.js';

// constants
const MASK_CORNERS = GeometricOpticsConstants.MASK_CORNERS;

class ProjectorScreen {

  /**
   * @param {Property.<Vector2>} firstSourcePositionProperty
   * @param {Property.<Vector2>} secondSourcePositionProperty
   * @param {Property.<Vector2>} firstTargetPositionProperty
   * @param {Property.<Vector2>} secondTargetPositionProperty
   * @param {Optic} optic
   */
  constructor( firstSourcePositionProperty, secondSourcePositionProperty,
               firstTargetPositionProperty, secondTargetPositionProperty,
               optic ) {

    // @public {Property.<Vector2>} position of the center of the screen
    this.positionProperty = new Vector2Property( GeometricOpticsConstants.PROJECTOR_INITIAL_POSITION );

    // @public (read-only) {Property.<Vector2>} position of the optic
    this.opticPositionProperty = optic.positionProperty;

    // @public (read-only) {Spotlight}
    this.firstSpotlight = new Spotlight(
      firstSourcePositionProperty,
      this.positionProperty,
      firstTargetPositionProperty,
      optic,
      this.getScreenShape.bind( this )
    );

    // @public (read-only) {Spotlight}
    this.secondSpotlight = new Spotlight(
      secondSourcePositionProperty,
      this.positionProperty,
      secondTargetPositionProperty,
      optic,
      this.getScreenShape.bind( this )
    );
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
   * @private
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
   * @public
   * @param {Shape} shape
   * @returns {Shape}
   */
  translatedShape( shape ) {
    return shape.transformed( Matrix3.translationFromVector( this.positionProperty.value ) );
  }
}

geometricOptics.register( 'ProjectorScreen', ProjectorScreen );
export default ProjectorScreen;