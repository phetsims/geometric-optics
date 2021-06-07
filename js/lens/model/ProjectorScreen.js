// Copyright 2021, University of Colorado Boulder

/**
 * Model element of projector screen. A target screen has a position, a screen shape and two spotlights.
 *
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import geometricOptics from '../../geometricOptics.js';
import Spotlight from './Spotlight.js';

const MASK_CORNERS = GeometricOpticsConstants.MASK_CORNERS;

class ProjectorScreen {

  /**
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<number} opticDiameterProperty
   * @param {Property.<Vector2>} targetImagePositionProperty
   * @param {Property.<Vector2>} movableImagePositionProperty
   * @param {Tandem} tandem
   */
  constructor( opticPositionProperty,
               opticDiameterProperty,
               targetImagePositionProperty,
               movableImagePositionProperty,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<Vector2>} position of the center of the screen
    this.positionProperty = new Vector2Property( new Vector2( 2, 0 ) );

    // @public (read-only) {Property.<Vector2>} position of the optic
    this.opticPositionProperty = opticPositionProperty;

    // @public (read-only) {Spotlight}
    this.spotlightOne = new Spotlight(
      this.positionProperty,
      opticPositionProperty,
      opticDiameterProperty,
      targetImagePositionProperty,
      this.getScreenShape.bind( this ),
      tandem
    );

    // @public (read-only) {Spotlight}
    this.spotlightTwo = new Spotlight(
      this.positionProperty,
      opticPositionProperty,
      opticDiameterProperty,
      movableImagePositionProperty,
      this.getScreenShape.bind( this ),
      tandem
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
   * gets the shape of the screen
   * @private
   * @returns {Shape}
   */
  getScreenShape() {
    const position = this.positionProperty.value;
    const leftTop = position.plus( MASK_CORNERS.LEFT_TOP );
    const leftBottom = position.plus( MASK_CORNERS.LEFT_BOTTOM );
    const rightBottom = position.plus( MASK_CORNERS.RIGHT_BOTTOM );
    const rightTop = position.plus( MASK_CORNERS.RIGHT_TOP );
    return new Shape()
      .moveToPoint( leftTop )
      .lineToPoint( leftBottom )
      .lineToPoint( rightBottom )
      .lineToPoint( rightTop )
      .close();
  }
}

geometricOptics.register( 'ProjectorScreen', ProjectorScreen );
export default ProjectorScreen;
