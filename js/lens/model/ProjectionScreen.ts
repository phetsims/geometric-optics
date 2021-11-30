// Copyright 2021, University of Colorado Boulder

/**
 * ProjectionScreen is the model of the projection screen.
 * It has a position and a Shape, and methods for computing Shapes needed by the view.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Barrier from '../../common/model/Barrier.js';
import geometricOptics from '../../geometricOptics.js';

// Dimensions of the screen, in cm. "Near" and "far" refer to pseudo-3D perspective.
const SCREEN_WIDTH = 42;
const SCREEN_NEAR_HEIGHT = 134;
const SCREEN_FAR_HEIGHT = 112;
assert && assert( SCREEN_NEAR_HEIGHT > SCREEN_FAR_HEIGHT );

class ProjectionScreen implements Barrier {

  // position of the center of the screen, in cm
  readonly positionProperty: Vector2Property;

  // Shape of the screen, relative to positionProperty
  readonly screenShape: Shape;

  // line that vertically bisects the screen, relative to positionProperty
  private readonly bisectorLine: Shape;

  constructor( options?: any ) {

    options = merge( {

      // {Vector2} initial position of the center of the screen
      initialPosition: new Vector2( 200, 0 ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    this.positionProperty = new Vector2Property( options.initialPosition, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    // Described clockwise, starting at left top, in model coordinates.
    this.screenShape = new Shape()
      .moveTo( -SCREEN_WIDTH / 2, SCREEN_FAR_HEIGHT / 2 )
      .lineTo( SCREEN_WIDTH / 2, SCREEN_NEAR_HEIGHT / 2 )
      .lineTo( SCREEN_WIDTH / 2, -SCREEN_NEAR_HEIGHT / 2 )
      .lineTo( -SCREEN_WIDTH / 2, -SCREEN_FAR_HEIGHT / 2 )
      .close();

    // Described from top to bottom, in model coordinates.
    const averageScreenHeight = ( SCREEN_NEAR_HEIGHT + SCREEN_FAR_HEIGHT ) / 2;
    this.bisectorLine = new Shape()
      .moveTo( 0, averageScreenHeight / 2 )
      .lineTo( 0, -averageScreenHeight / 2 );
  }

  public reset(): void {
    this.positionProperty.reset();
  }

  /**
   * Gets the vertical line that bisects the screen, in the model's global coordinate frame.
   */
  public getBisectorLineTranslated(): Shape {
    return this.translatedShape( this.bisectorLine );
  }

  /**
   * Gets the shape of the screen, in the model's global coordinate frame.
   */
  public getScreenShapeTranslated(): Shape {
    return this.translatedShape( this.screenShape );
  }

  /**
   * Returns a shape that is translated by the model position of the projection screen.
   * The provided Shape should be in the projection screen's local coordinate frame.
   * The resulting Shape will be in the model's global coordinate frame.
   * @param shape - in the projection screen's local coordinate frame
   */
  private translatedShape( shape: Shape ): Shape {
    return shape.transformed( Matrix3.translationFromVector( this.positionProperty.value ) );
  }
}

geometricOptics.register( 'ProjectionScreen', ProjectionScreen );
export default ProjectionScreen;