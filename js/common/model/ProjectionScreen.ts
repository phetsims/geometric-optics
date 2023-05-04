// Copyright 2021-2023, University of Colorado Boulder

/**
 * ProjectionScreen is the model of the projection screen.
 * It has a position and a Shape, and methods for computing Shapes needed by the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// Dimensions of the screen, in cm. "Near" and "far" refer to pseudo-3D perspective.
const SCREEN_WIDTH = 42;
const SCREEN_NEAR_HEIGHT = 134;
const SCREEN_FAR_HEIGHT = 112;
assert && assert( SCREEN_NEAR_HEIGHT > SCREEN_FAR_HEIGHT );

type SelfOptions = EmptySelfOptions;

type ProjectionScreenOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class ProjectionScreen extends PhetioObject {

  // position of the center of the screen, in cm
  public readonly positionProperty: Property<Vector2>;

  // Shape of the screen, relative to positionProperty
  public readonly screenShape: Shape;

  // Height of the screen at its centerX
  public readonly height: number;

  // line that vertically bisects the screen, at its centerX
  private readonly bisectorLine: Shape;

  // Resets things that are specific to this class.
  private readonly resetProjectionScreen: () => void;

  public constructor( opticPositionProperty: TReadOnlyProperty<Vector2>, providedOptions: ProjectionScreenOptions ) {

    const options = optionize<ProjectionScreenOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( new Vector2( 200, 0 ), {
      units: 'cm',
      isValidValue: ( position: Vector2 ) =>
        ( position.x >= opticPositionProperty.value.x + GOConstants.MIN_DISTANCE_FROM_OPTIC_TO_PROJECTION_SCREEN ),
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true
    } );

    // Described clockwise, starting at left top, in model coordinates.
    this.screenShape = new Shape()
      .moveTo( -SCREEN_WIDTH / 2, SCREEN_FAR_HEIGHT / 2 )
      .lineTo( SCREEN_WIDTH / 2, SCREEN_NEAR_HEIGHT / 2 )
      .lineTo( SCREEN_WIDTH / 2, -SCREEN_NEAR_HEIGHT / 2 )
      .lineTo( -SCREEN_WIDTH / 2, -SCREEN_FAR_HEIGHT / 2 )
      .close();

    // Height at the centerX of the screen, the average of its near and far perspective heights
    this.height = ( SCREEN_NEAR_HEIGHT + SCREEN_FAR_HEIGHT ) / 2;

    // Described from top to bottom, in model coordinates.
    this.bisectorLine = Shape.lineSegment( 0, this.height / 2, 0, -this.height / 2 );

    this.resetProjectionScreen = () => {
      this.positionProperty.reset();
    };
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
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
   * Gets the shape of the projection screen, in the model's global coordinate frame.
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