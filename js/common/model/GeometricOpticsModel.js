// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsModel is the common top-level model for this simulation.
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import geometricOptics from '../../geometricOptics.js';
import LightSpot from '../../lens/model/LightSpot.js';
import ProjectorScreen from '../../lens/model/ProjectorScreen.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import FocalPoint from './FocalPoint.js';
import LightRays from './LightRays.js';
import Optic from './Optic.js';
import RaysMode from './RaysMode.js';
import Representation from './Representation.js';
import Ruler from './Ruler.js';
import SecondSource from './SecondSource.js';
import SourceObject from './SourceObject.js';
import Target from './Target.js';

// constants
const RAYS_ANIMATION_TIME = 10; // length of the rays animation, in seconds

class GeometricOpticsModel {

  /**
   * @param {Optic} optic
   * @param {Representation[]} [representations] - representations that are supported
   */
  constructor( optic, representations = Representation.VALUES ) {

    assert && assert( optic instanceof Optic );
    assert && assert( Array.isArray( representations ) );

    // @public model of the optic
    this.optic = optic;

    // @public representation of the source/object
    this.representationProperty = new EnumerationProperty( Representation, Representation.PENCIL, {
      validValues: representations
    } );

    // @public focal point to the left of the optic
    this.leftFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty, {
      sign: -1
    } );

    // @public focal point to the right of the optic
    this.rightFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty );

    // @public the object/ source
    this.sourceObject = new SourceObject( this.representationProperty );

    // @public the object/ source
    this.secondSource = new SecondSource( this.representationProperty, this.sourceObject.positionProperty );

    // @public model of the target/image associated with the first source
    this.firstTarget = new Target( this.sourceObject.positionProperty, this.optic, this.representationProperty );

    // @public target/ image associated with the second source
    this.secondTarget = new Target( this.secondSource.positionProperty, this.optic, this.representationProperty );

    // @public model of the projector screen
    this.projectorScreen = new ProjectorScreen(
      this.sourceObject.positionProperty,
      this.secondSource.positionProperty,
      this.firstTarget.positionProperty,
      this.secondTarget.positionProperty,
      this.optic
    );

    // @public (read-only) light spot associated with the first source/object
    this.firstLightSpot = new LightSpot(
      this.sourceObject.positionProperty,
      this.firstTarget.positionProperty,
      this.projectorScreen,
      this.optic
    );

    // @public (read-only) light spot associated with the second source/object
    this.secondLightSpot = new LightSpot(
      this.secondSource.positionProperty,
      this.secondTarget.positionProperty,
      this.projectorScreen,
      this.optic
    );

    // @public (read-only) elapsed time of light rays animation
    this.lightRaysTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, RAYS_ANIMATION_TIME )
    } );

    // @public determines the representation used for rays
    this.raysModeProperty = new EnumerationProperty( RaysMode, RaysMode.MARGINAL );

    // Changing raysModeProperty resets the animation time for rays.
    this.raysModeProperty.link( () => this.lightRaysTimeProperty.reset() );

    // @public light rays associated with the first source
    this.firstLightRays = new LightRays(
      this.lightRaysTimeProperty,
      this.raysModeProperty,
      this.representationProperty,
      this.sourceObject.positionProperty,
      this.projectorScreen,
      this.optic,
      this.firstTarget
    );

    // @public light rays associated with the second source
    this.secondLightRays = new LightRays(
      this.lightRaysTimeProperty,
      this.raysModeProperty,
      this.representationProperty,
      this.secondSource.positionProperty,
      this.projectorScreen,
      this.optic,
      this.secondTarget
    );

    // @public horizontal and vertical rulers
    this.horizontalRuler = new Ruler(
      Ruler.Orientation.HORIZONTAL,
      GeometricOpticsConstants.HORIZONTAL_RULER_INITIAL_POSITION,
      GeometricOpticsConstants.HORIZONTAL_RULER_LENGTH
    );
    this.verticalRuler = new Ruler(
      Ruler.Orientation.VERTICAL,
      GeometricOpticsConstants.VERTICAL_RULER_INITIAL_POSITION,
      GeometricOpticsConstants.VERTICAL_RULER_LENGTH
    );
  }

  /**
   * Resets the model
   * @public
   */
  reset() {
    this.representationProperty.reset();
    this.optic.reset();
    this.sourceObject.reset();
    this.secondSource.reset();
    this.lightRaysTimeProperty.reset();
    this.raysModeProperty.reset();
    this.projectorScreen.reset();
    this.horizontalRuler.reset();
    this.verticalRuler.reset();
  }

  /**
   * Steps the animation of light rays.
   * @public
   * @param {number} dt - time step, in seconds
   */
  stepLightRays( dt ) {
    const t = this.lightRaysTimeProperty.value + dt;
    if ( this.lightRaysTimeProperty.range.contains( t ) ) {
      this.lightRaysTimeProperty.value = t;
    }
  }
}

geometricOptics.register( 'GeometricOpticsModel', GeometricOpticsModel );
export default GeometricOpticsModel;