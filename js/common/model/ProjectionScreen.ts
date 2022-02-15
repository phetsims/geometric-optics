// Copyright 2021-2022, University of Colorado Boulder

/**
 * ProjectionScreen is the model of the projection screen.
 * It has a position and a Shape, and methods for computing Shapes needed by the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';

// Dimensions of the screen, in cm. "Near" and "far" refer to pseudo-3D perspective.
const SCREEN_WIDTH = 42;
const SCREEN_NEAR_HEIGHT = 134;
const SCREEN_FAR_HEIGHT = 112;
assert && assert( SCREEN_NEAR_HEIGHT > SCREEN_FAR_HEIGHT );

type ProjectionScreenOptions = {
  tandem: Tandem
};

class ProjectionScreen {

  // position of the center of the screen, in cm
  readonly positionProperty: Property<Vector2>;

  // Shape of the screen, relative to positionProperty
  readonly screenShape: Shape;

  // line that vertically bisects the screen, relative to positionProperty
  private readonly bisectorLine: Shape;

  private readonly resetProjectionScreen: () => void;

  /**
   * @param opticPositionProperty
   * @param providedOptions
   */
  constructor( opticPositionProperty: IReadOnlyProperty<Vector2>, providedOptions: ProjectionScreenOptions ) {

    this.positionProperty = new Vector2Property( new Vector2( 200, 0 ), {
      isValidValue: ( position: Vector2 ) =>
        ( position.x >= opticPositionProperty.value.x + GOConstants.MIN_DISTANCE_FROM_OPTIC_TO_PROJECTION_SCREEN ),
      tandem: providedOptions.tandem.createTandem( 'positionProperty' )
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

    this.resetProjectionScreen = () => {
      this.positionProperty.reset();
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.resetProjectionScreen();
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