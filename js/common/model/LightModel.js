// Copyright 2015-2020, University of Colorado Boulder

/**
 * Model for the light screen, in which the user can move the laser and many prisms.
 *
 * @author Martin Veillette
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import Ray2 from '../../../../dot/js/Ray2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import LightRay from './LightRay.js';
import Polygon from './Polygon.js';
import Prism from './Prism.js';

class LightModel {
  constructor() {

    // @public (read-only)- list of rays in the model
    this.rays = createObservableArray();

    this.prisms = createObservableArray(); // @public (read-only)

    // @public (read-only) - List of intersections, which can be shown graphically
    this.intersections = createObservableArray();

    Property.multilink( [], () => {
      this.clear();
      this.updateModel();
      this.dirty = true;
    } );

    // coalesce repeat updates so work is not duplicated in white light node.
    this.dirty = true; // @public

    // @public
    this.rotationArrowAngleOffset = 0;
  }

  /**
   * @public
   * @override
   */
  reset() {
    this.prisms.clear();
  }


  /**
   * Adds a ray to the model
   * @public
   * @param {LightRay} ray - model of light ray
   */
  addRay( ray ) {
    this.rays.add( ray );
  }

  /**
   * clear the model in preparation for another ray propagation update phase
   * @public
   */
  clearModel() {
    for ( let i = 0; i < this.rays.length; i++ ) {
      this.rays.get( i ).particles.clear();
    }
    this.rays.clear();
  }

  /**
   * update the model by clearing the rays, then recreating them
   * @public
   */
  updateModel() {
    this.clearModel();
    this.propagateRays();
  }

  /**
   * List of prism prototypes that can be created in the sim
   * @public
   * @returns {Array}
   */
  getPrismPrototypes() {
    const prismsTypes = [];

    // characteristic length scale
    const a = 0.001 * 10;

    // attach at bottom right
    prismsTypes.push( new Prism( new Polygon( 2, [
      new Vector2( -a / 2, a / 2 ),
      new Vector2( a / 2, a / 2 ),
      new Vector2( a / 2, -a / 2 ),
      new Vector2( -a / 2, -a / 2 )
    ], 0 ), 'square' ) );

    const radius = a / 2;

    // DivergingLens
    prismsTypes.push( new Prism( new Polygon( 2, [
      new Vector2( -0.6 * radius, radius ),
      new Vector2( 0.6 * radius, radius ),
      new Vector2( 0.6 * radius, -radius ),
      new Vector2( -0.6 * radius, -radius )
    ], radius ), 'diverging-lens' ) );
    return prismsTypes;
  }


  /**
   * Determines whether white light or single color light
   * @private
   * @param {Ray2} ray - tail and direction for light
   */
  propagate( ray ) {
    this.propagateTheRay( new LightRay( ray ), true );
  }

  /**
   * Algorithm that computes the trajectories of the rays throughout the system
   * @public
   */
  propagateRays() {

    const tail = this.sourceObject.positionProperty.value;

    const N = 25; // Number of rays
    // eslint-disable-next-line no-case-declarations
    const deltaTheta = 180 / N; // Degrees between adjacent arrays
    // eslint-disable-next-line no-case-declarations

    for ( let i = 5; i < ( N - 5 ); i++ ) {
      const angle = Utils.toRadians( 90 - i * deltaTheta );
      const directionUnitVector = new Vector2().setPolar( 1, angle );
      this.propagate( new Ray2( tail, directionUnitVector ) );
    }

  }

  /**
   * Recursive algorithm to compute the pattern of rays in the system. This is the main computation of this model,
   * rays are cleared beforehand and this algorithm adds them as it goes
   * @private
   * @param {LightRay} incidentRay - model of the ray
   * @param {boolean} showIntersection - true if the intersection should be shown.  True for single rays and for
   *                                     extrema of white light wavelengths
   */
  propagateTheRay( incidentRay, showIntersection ) {
    // Check for an intersection
    const intersection = this.getIntersection( incidentRay, this.prisms );
    const L = incidentRay.directionUnitVector;
    const n1 = incidentRay.mediumIndexOfRefraction;
    if ( intersection !== null ) {

      const pointOnOtherSide = ( incidentRay.directionUnitVector.times( 1E-12 ) ).add( intersection.point );
      let outputInsidePrism = false;
      const lightRayAfterIntersectionInRay2Form = new Ray2( pointOnOtherSide, incidentRay.directionUnitVector );
      this.prisms.forEach( prism => {
        const intersection = prism.getTranslatedShape().shape.intersection( lightRayAfterIntersectionInRay2Form );
        if ( intersection.length % 2 === 1 ) {
          outputInsidePrism = true;
        }
      } );

      // Index of refraction of the other medium
      const n2 = outputInsidePrism ?
                 this.prismMediumProperty.value.getIndexOfRefraction( incidentRay.getBaseWavelength() ) :
                 this.environmentMediumProperty.value.getIndexOfRefraction( incidentRay.getBaseWavelength() );

      // Precompute for readability
      const point = intersection.point;
      const n = intersection.unitNormal;

      // Compute the output rays, see http://en.wikipedia.org/wiki/Snell's_law#Vector_form
      const cosTheta1 = n.dotXY( L.x * -1, L.y * -1 );
      const cosTheta2Radicand = 1 - Math.pow( n1 / n2, 2 ) * ( 1 - Math.pow( cosTheta1, 2 ) );
      const totalInternalReflection = cosTheta2Radicand < 0;
      const cosTheta2 = Math.sqrt( Math.abs( cosTheta2Radicand ) );
      const vReflect = ( n.times( 2 * cosTheta1 ) ).add( L );
      let vRefract = cosTheta1 > 0 ?
                     ( L.times( n1 / n2 ) ).addXY(
                       n.x * ( n1 / n2 * cosTheta1 - cosTheta2 ),
                       n.y * ( n1 / n2 * cosTheta1 - cosTheta2 )
                     ) :
                     ( L.times( n1 / n2 ) ).addXY(
                       n.x * ( n1 / n2 * cosTheta1 + cosTheta2 ),
                       n.y * ( n1 / n2 * cosTheta1 + cosTheta2 )
                     );

      // Normalize the direction vector, see https://github.com/phetsims/bending-light/issues/226
      vRefract = vRefract.normalized();

      // Create the new rays and propagate them recursively
      const reflectedRay = new Ray2( incidentRay.directionUnitVector.times( -1E-12 ).add( point ), vReflect );
      const reflected = new LightRay( reflectedRay );
      const refractedRay = new Ray2( incidentRay.directionUnitVector.times( +1E-12 ).add( point ), vRefract );
      const refracted = new LightRay( refractedRay );
      if ( this.showReflectionsProperty.value || totalInternalReflection ) {
        this.propagateTheRay( reflected, showIntersection );
      }
      this.propagateTheRay( refracted, showIntersection );

      // Add the incident ray itself
      this.addRay( new LightRay( incidentRay.tail, intersection.point ) );
    }
    else {
      // No intersection, so the light ray should just keep going
      this.addRay( new LightRay(
        incidentRay.tail,
        // If the light ray gets too long, it will cause rendering artifacts like #219
        incidentRay.tail.plus( incidentRay.directionUnitVector.times( 2E-4 ) )
      ) );
    }
  }

  /**
   * Find the nearest intersection between a light ray and the set of prisms in the play area
   * @private
   * @param {LightRay} incidentRay - model of the ray
   * @param {ObservableArrayDef.<Prism>} prisms
   * @returns {Intersection|null} - returns the intersection if one was found or null if no intersections
   */
  getIntersection( incidentRay, prisms ) {
    let allIntersections = [];
    prisms.forEach( prism => {
      prism.getIntersections( incidentRay ).forEach( intersection => allIntersections.push( intersection ) );
    } );

    // Get the closest one (which would be hit first)
    allIntersections = _.sortBy( allIntersections, allIntersection => allIntersection.point.distance( incidentRay.tail ) );
    return allIntersections.length === 0 ? null : allIntersections[ 0 ];
  }

  /**
   * @public
   */
  clear() {
    this.intersections.clear();
  }
}

geometricOptics.register( 'LightModel', LightModel );

export default LightModel;
