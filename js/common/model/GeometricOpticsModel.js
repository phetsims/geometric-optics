// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsModel is the common top-level model for this simulation.
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import LightSpot from '../../lens/model/LightSpot.js';
import ProjectionScreen from '../../lens/model/ProjectionScreen.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import FocalPoint from './FocalPoint.js';
import LightRays from './LightRays.js';
import Optic from './Optic.js';
import RaysMode from './RaysMode.js';
import Representation from './Representation.js';
import Ruler from './Ruler.js';
import SecondPoint from './SecondPoint.js';
import SourceObject from './SourceObject.js';
import Target from './Target.js';

// constants
const RAYS_ANIMATION_TIME = 10; // length of the rays animation, in seconds

class GeometricOpticsModel {

  /**
   * @param {Optic} optic
   * @param {Object} [options]
   */
  constructor( optic, options ) {

    assert && assert( optic instanceof Optic );

    options = merge( {
      representations: Representation.VALUES,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public model of the optic
    this.optic = optic;

    // @public representation of the source object
    this.representationProperty = new EnumerationProperty( Representation, Representation.PENCIL, {
      validValues: options.representations
    } );

    // @public focal point to the left of the optic
    this.leftFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty, {
      sign: -1,
      tandem: options.tandem.createTandem( 'leftFocalPoint' )
    } );

    // @public focal point to the right of the optic
    this.rightFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty, {
      tandem: options.tandem.createTandem( 'rightFocalPoint' )
    } );

    // @public source object and first light source
    this.sourceObject = new SourceObject( this.representationProperty );

    // @public the second point on the source object, and the second light source
    this.secondPoint = new SecondPoint( this.representationProperty, this.sourceObject.positionProperty );

    // @public model of the target/image associated with sourceObject
    this.firstTarget = new Target( this.sourceObject.positionProperty, this.optic, this.representationProperty );

    // @public target/ image associated with secondPoint
    this.secondTarget = new Target( this.secondPoint.positionProperty, this.optic, this.representationProperty );

    // @public model of the projection screen
    //TODO irrelevant for MirrorModel, but required by LightRays constructor
    this.projectionScreen = new ProjectionScreen( {
      tandem: options.tandem.createTandem( 'projectionScreen' )
    } );

    // @public (read-only) light spot associated with the first light source
    //TODO irrelevant for MirrorModel
    this.firstLightSpot = new LightSpot(
      this.sourceObject.positionProperty,
      this.firstTarget.positionProperty,
      this.projectionScreen,
      this.optic
    );

    // @public (read-only) light spot associated with the second light source
    //TODO irrelevant for MirrorModel
    this.secondLightSpot = new LightSpot(
      this.secondPoint.positionProperty,
      this.secondTarget.positionProperty,
      this.projectionScreen,
      this.optic
    );

    // @public (read-only) elapsed time of light rays animation
    this.lightRaysTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, RAYS_ANIMATION_TIME )
    } );

    // @public determines the representation used for rays
    this.raysModeProperty = new EnumerationProperty( RaysMode, RaysMode.MARGINAL, {
      tandem: options.tandem.createTandem( 'raysModeProperty' )
    } );

    // Changing raysModeProperty resets the animation time for rays.
    this.raysModeProperty.link( () => this.lightRaysTimeProperty.reset() );

    // @public light rays associated with the first source
    this.firstLightRays = new LightRays(
      this.lightRaysTimeProperty,
      this.raysModeProperty,
      this.representationProperty,
      this.sourceObject.positionProperty,
      this.projectionScreen,
      this.optic,
      this.firstTarget
    );

    // @public light rays associated with the second source
    this.secondLightRays = new LightRays(
      this.lightRaysTimeProperty,
      this.raysModeProperty,
      this.representationProperty,
      this.secondPoint.positionProperty,
      this.projectionScreen,
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
    this.secondPoint.reset();
    this.lightRaysTimeProperty.reset();
    this.raysModeProperty.reset();
    this.projectionScreen.reset();
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