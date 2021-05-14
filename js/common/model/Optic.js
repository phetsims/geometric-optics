// Copyright 2021, University of Colorado Boulder

/**
 * Abstract class of an optical element in the simulation.
 * An optical element is the base class for a lens or a mirror.
 * Responsibility include the radius of curvature, the diameter and the curvatureType
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';

class Optic {

  /**
   *
   * @param {Vector2} position
   * @param {RangeWithValue} radiusOfCurvatureRange
   * @param {RangeWithValue} diameterRange
   * @param {Optic.Curve} curve
   * @param {Optic.Type} type
   * @param {Tandem} tandem
   */
  constructor( position, radiusOfCurvatureRange, diameterRange, curve, type, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    assert && assert( position instanceof Vector2, 'invalid position' );
    assert && assert( radiusOfCurvatureRange instanceof RangeWithValue, 'invalid radiusOfCurvature' );
    assert && assert( diameterRange instanceof RangeWithValue, 'invalid diameterRange' );

    // @public {Property.<Vector2>} Position of the optical element
    this.positionProperty = new Vector2Property( position );

    // @public {Property.<number>} Radius of curvature of the optical element - The convention is positive as converging.
    this.radiusOfCurvatureProperty = new NumberProperty( radiusOfCurvatureRange.defaultValue, { range: radiusOfCurvatureRange } );

    // @public {Property.<number>} Height of the optical element - controls the optical aperture of the optical element
    this.diameterProperty = new NumberProperty( diameterRange.defaultValue, { range: diameterRange } );

    // @public {EnumerationProperty.<Optic.Curve>} Type of Curvature of the optical element.
    this.curveProperty = new EnumerationProperty( Optic.Curve, curve );

    // @private {Optic.Type} Type of transmission of the optical element.
    this.type = type;

    // @public {DerivedProperty.<Object>} shapes (fill and outline) of the optical element
    this.outlineAndFillProperty = new DerivedProperty( [
        this.positionProperty,
        this.radiusOfCurvatureProperty,
        this.diameterProperty,
        this.curveProperty ],
      ( position, radius, diameter, curve ) => {
        return this.getFillAndOutlineShapes( position, radius, diameter, curve );
      } );

    // @public - must be implemented by subtype
    this.focalLengthProperty = new Error( 'must be implemented by subtype' );

    // @private
    this.diameterRange = diameterRange;
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.diameterProperty.reset();
    this.radiusOfCurvatureProperty.reset();
    this.curveProperty.reset();
  }

  /**
   * @public
   * @returns {Vector2}
   */
  getFirstFocalPointPosition() {
    const firstFocalPosition = this.positionProperty.value.plusXY( this.focalLengthProperty.value, 0 );
    return firstFocalPosition;
  }

  /**
   * @public
   * @returns {Vector2}
   */
  getSecondFocalPointPosition() {
    const firstFocalPosition = this.positionProperty.value.plusXY( -this.focalLengthProperty.value, 0 );
    return firstFocalPosition;
  }

  /**
   * Returns a boolean indicating if the optical element is a lens
   * @public
   * @returns {boolean}
   */
  isLens() {
    return this.type === Optic.Type.LENS;
  }

  /**
   * Returns a boolean indicating if the optical element is a mirror
   * @public
   * @returns {boolean}
   */
  isMirror() {
    return this.type === Optic.Type.MIRROR;
  }

  /**
   * Returns a boolean indicating if the optical element is concave
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConcave( curve ) {
    return curve === Optic.Curve.CONCAVE;
  }

  /**
   * Returns a boolean indicating if the optical element is convex
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConvex( curve ) {
    return curve === Optic.Curve.CONVEX;
  }

  /**
   * Returns a normalized value (with a max of 1) for the diameter
   * @param {number} diameter - diameter
   * @public
   * @returns {number}
   */
  getNormalizedDiameter( diameter ) {
    return diameter / this.diameterRange.max;
  }

  /**
   * @public @abstract
   */
  getFillAndOutlineShapes() { throw new Error( 'must be implemented by subtype' ); }

}

Optic.Type = Enumeration.byKeys( [
  'LENS', // lens
  'MIRROR' //mirror
] );

Optic.Curve = Enumeration.byKeys( [
  'CONVEX',
  'CONCAVE'
] );

geometricOptics.register( 'Optic', Optic );
export default Optic;
