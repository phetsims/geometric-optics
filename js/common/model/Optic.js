// Copyright 2021, University of Colorado Boulder

/**
 * A class of an optical element in the simulation.
 * An optical element is the base class for a lens or a mirror.
 * Responsibility include the radius of curvature, the diameter and the curve
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class Optic {

  /**
   * @param {Vector2} position - center of the optical element
   * @param {RangeWithValue} radiusOfCurvatureRange - range of radius of curvature (in centimeters)
   * @param {RangeWithValue} diameterRange - range of height for optical element (in centimeters)
   * @param {RangeWithValue} indexOfRefractionRange
   * @param {Optic.Curve} curve - initial curve of optical element - acceptable values (CONVEX and CONCAVE)
   * @param {Optic.Type} type - type of optical element - acceptable values (MIRROR and LENS)
   * @param {Tandem} tandem
   */
  constructor( position,
               radiusOfCurvatureRange,
               diameterRange,
               indexOfRefractionRange,
               curve,
               type,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    assert && assert( position instanceof Vector2, 'invalid position' );
    assert && assert( radiusOfCurvatureRange instanceof RangeWithValue, 'invalid radiusOfCurvature' );
    assert && assert( diameterRange instanceof RangeWithValue, 'invalid diameterRange' );

    // @public {Property.<Vector2>} Position of the optical element
    this.positionProperty = new Vector2Property( position );

    // @public {Property.<number>} Radius of curvature of the optical element - The convention is positive as converging.
    this.radiusOfCurvatureProperty = new NumberProperty( radiusOfCurvatureRange.defaultValue,
      { range: radiusOfCurvatureRange } );

    // @public {Property.<number>} Height of the optical element - controls the optical aperture of the optical element
    this.diameterProperty = new NumberProperty( diameterRange.defaultValue,
      { range: diameterRange } );

    // @public {Property.<number>}  index of refraction of the lens
    this.indexOfRefractionProperty = new NumberProperty( indexOfRefractionRange.defaultValue,
      { range: indexOfRefractionRange } );

    // @public {Property.<Optic.Curve>} Type of Curvature of the optical element.
    this.curveProperty = new EnumerationProperty( Optic.Curve, curve );

    // @private {Optic.Type} Type of the optical element ( valid choices: LENS and MIRROR)
    this.type = type;

    // @public {Property.<number>} focal length of the optic
    // positive indicate the optic is converging whereas negative indicates the optic is diverging.
    this.focalLengthProperty = new DerivedProperty(
      [ this.radiusOfCurvatureProperty, this.indexOfRefractionProperty, this.curveProperty ],
      ( radiusOfCurvature, indexOfRefraction, curve ) => {

        // a positive sign indicate the optic is converging
        // sign is determined based on the curve and the type of optic.
        const sign = this.getConvergingSign( curve );

        return sign * radiusOfCurvature / ( 2 * ( indexOfRefraction - 1 ) );
      }
    );

    // @public {Property.<boolean>} is the optical element converging.
    this.isConvergingProperty = new DerivedProperty( [ this.curveProperty ], curve => {
      return this.isConverging( curve );
    } );

    // @public {Property.<number>} is the optical element converging.
    // +1 is the optical element is converging and -1 if it is diverging
    this.convergingSignProperty = new DerivedProperty( [ this.curveProperty ], curve => {
      return this.getConvergingSign( curve );
    } );

    // @public {Property.<Object>} shapes (fill and outline) of the optical element
    this.shapesProperty = new DerivedProperty( [
        this.radiusOfCurvatureProperty,
        this.diameterProperty,
        this.curveProperty ],
      ( radius, diameter, curve ) => {
        return this.getShapes( radius, diameter, curve );
      } );

    // @private {number} diameter of the optic
    this.diameterRange = diameterRange;
  }

  /**
   * Returns the shape of a parabolic mirror.
   * The shape is designed as a "first surface mirror".
   * The returned object contains an outline shape, representing the reflecting coating,
   * and a fill shape representing the base backing of the mirror.
   * The shapes are drawn using quadratic Bezier curves.
   *
   * @param {number} radius - radius of curvature at the center of the mirror
   * @param {number} diameter - vertical height of the mirror
   * @param {Optic.Curve} curve
   * @param {Object} [options]
   * @returns {
      fillShape: Shape,
      outlineShape: Shape,
      frontShape: Shape,
      backShape: null,
      middleShape: null
    }
   * @public
   */
  static getMirrorShapes( radius, diameter, curve, options ) {

    assert && assert( radius > diameter / 2, 'the radius of curvature is too small when compared to the diameter' );

    options = merge( {
      thickness: 5 // horizontal separation between the two edges of the surfaces at the middle part
    }, options );

    // convenience variable
    const halfHeight = diameter / 2;

    // half of the width of the outline shape of the mirror along the x -axis
    const halfWidth = radius - Math.sqrt( radius ** 2 - halfHeight ** 2 );

    // top and bottom surfaces of fill shape must be tilted to generate right angle corners
    const angle = Math.atan( halfHeight / radius );

    // curveSign is +1 for convex and -1 for concave
    const curveSign = ( curve === Optic.Curve.CONVEX ) ? 1 : -1;

    // vector offset between the two top corners and bottom corners of the shape
    // with a magnitude of option.thickness
    const offsetTopVector = Vector2.createPolar( options.thickness, -curveSign * angle );
    const offsetBottomVector = Vector2.createPolar( options.thickness, curveSign * angle );

    // four corners of the mirror shape
    const topLeft = new Vector2( curveSign * halfWidth, halfHeight );
    const topRight = topLeft.plus( offsetTopVector );
    const bottomLeft = new Vector2( curveSign * halfWidth, -halfHeight );
    const bottomRight = bottomLeft.plus( offsetBottomVector );

    // control points: Note that the curve will not go through the control points.
    // rather, it will go through the two following points: (0,0) and ( options.thickness, 0 )
    const midLeft = new Vector2( -curveSign * halfWidth, 0 );
    const midRight = midLeft.plusXY( options.thickness, 0 );

    // shapes drawn from top to bottom in counterclockwise fashion.

    // front shape of mirror front - with zero area.
    const frontShape = new Shape()
      .moveToPoint( topLeft )
      .quadraticCurveToPoint( midLeft, bottomLeft )
      .quadraticCurveToPoint( midLeft, topLeft )
      .close();

    // shape of entire mirror, including mirror backing
    const fillShape = new Shape()
      .moveToPoint( topLeft )
      .quadraticCurveToPoint( midLeft, bottomLeft )
      .lineToPoint( bottomRight )
      .quadraticCurveToPoint( midRight, topRight )
      .close();

    return {
      fillShape: fillShape,
      outlineShape: frontShape,
      frontShape: frontShape,
      backShape: null,
      middleShape: null
    };
  }

  /**
   * Returns the shapes of a lens. In the case of a lens, the outline and fills shape are identical.
   *
   * The lens shape is approximated as a parabolic lens.
   * The radius of curvature of the lens does necessarily match the value of radius and can be instead "hollywooded".
   * This gives the flexibility to draw lenses with radius of curvature that is larger than diameter/2, a physical impossibility.
   * The center point of the lens is '0,0'
   *
   * @param {number} radius - radius of curvature
   * @param {number} diameter - height of the lens
   * @param {Optic.Curve} curve
   * @param {Object} [options]
   * @returns {
      fillShape: Shape,
      outlineShape: Shape,
      frontShape: Shape,
      backShape: Shape,
      middleShape: Shape
    }
   * @public
   */
  static getLensShapes( radius, diameter, curve, options ) {

    options = merge( {
        isHollywood: true, // is the radius of curvature parameter matching the shape of the lens
        offsetRadius: 100
      },
      options );

    const halfHeight = diameter / 2;

    // the width of the lens changes with the radius
    const halfWidth = options.isHollywood ?
                      1 / 2 * halfHeight * halfHeight / ( radius + options.offsetRadius ) :
                      radius - Math.sqrt( radius ** 2 - halfHeight ** 2 );

    // {Shape} shape of lens
    let outlineShape; // the outline of the lens (including top and bottom)
    let frontShape; // the left facing portion of the lens
    let backShape; // the right facing  portion of the lens

    if ( curve === Optic.Curve.CONVEX ) {

      // two extrema points of the lens
      const top = new Vector2( 0, halfHeight );
      const bottom = new Vector2( 0, -halfHeight );

      // two control points on the optical axis, note that the shape does not go through these points
      // The shape will go through the two points: (  -halfWidth, 0 )  and (  halfWidth, 0 )
      const left = new Vector2( -2 * halfWidth, 0 );
      const right = new Vector2( 2 * halfWidth, 0 );

      // shape of convex lens
      outlineShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom )
        .quadraticCurveToPoint( right, top )
        .close();

      frontShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( left, bottom )
        .quadraticCurveToPoint( left, top )
        .close();

      backShape = new Shape()
        .moveToPoint( top )
        .quadraticCurveToPoint( right, bottom )
        .quadraticCurveToPoint( right, top )
        .close();

    }
    else {
      // implies that curve === Optic.Curve.CONCAVE

      const midWidth = halfWidth;

      // four corners of the concave shape
      const topLeft = new Vector2( -halfWidth, halfHeight );
      const topRight = new Vector2( halfWidth, halfHeight );
      const bottomLeft = new Vector2( -halfWidth, -halfHeight );
      const bottomRight = new Vector2( halfWidth, -halfHeight );

      // control points
      const midLeft = new Vector2( midWidth / 2, 0 );
      const midRight = new Vector2( -midWidth / 2, 0 );

      // shape of concave lens
      outlineShape = new Shape()
        .moveToPoint( topLeft )
        .lineToPoint( topRight )
        .quadraticCurveToPoint( midRight, bottomRight )
        .lineToPoint( bottomLeft )
        .quadraticCurveToPoint( midLeft, topLeft )
        .close();

      frontShape = new Shape()
        .moveToPoint( topLeft )
        .quadraticCurveToPoint( midLeft, bottomLeft )
        .quadraticCurveToPoint( midLeft, topLeft )
        .close();

      backShape = new Shape()
        .moveToPoint( topRight )
        .quadraticCurveToPoint( midRight, bottomRight )
        .quadraticCurveToPoint( midRight, topRight )
        .close();
    }

    // two extrema points of the lens
    const top = new Vector2( 0, halfHeight );
    const bottom = new Vector2( 0, -halfHeight );
    const middleShape = new Shape().moveToPoint( top ).lineToPoint( bottom );

    // the outline shape is the same as the fill shape for a lens
    return {
      fillShape: outlineShape,
      outlineShape: outlineShape,
      frontShape: frontShape,
      backShape: backShape,
      middleShape: middleShape
    };
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
    this.indexOfRefractionProperty.reset();
  }

  /**
   * Sets the y position of the optical element while keeping the x-coordinate constant
   * @public
   * @param {number} yCoordinate
   */
  setVerticalCoordinate( yCoordinate ) {
    this.positionProperty.value = new Vector2( this.positionProperty.value.x, yCoordinate );
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
   * Returns a boolean indicating if the optical element has the potential to converge rays.
   * This is solely a property of the optical element.
   * A convex lens and a concave mirror are converging optical elements.
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isConverging( curve ) {
    return ( this.isConvex( curve ) && this.isLens() ) || ( this.isConcave( curve ) && this.isMirror() );
  }

  /**
   * Returns a boolean indicating if the optical element is convex
   * @public
   * @param {Optic.Curve} curve
   * @returns {boolean}
   */
  isDiverging( curve ) {
    return !this.isConverging( curve );
  }

  /**
   * Convenience function for mathematical operations.
   * Returns a value of +1 is the optical element is converging and -1 is the element is diverging.
   * @public
   * @param {Optic.Curve} curve
   * @returns {number}
   */
  getConvergingSign( curve ) {
    return this.isConverging( curve ) ? 1 : -1;
  }

  /**
   * Convenience function for mathematical operations.
   * Returns a value of +1 is the optical element is convex and -1 is the element is concave.
   * @public
   * @param {Optic.Curve} curve
   * @returns {number}
   */
  getCurveSign( curve ) {
    return this.isConvex( curve ) ? 1 : -1;
  }

  /**
   * Convenience function for mathematical operations.
   * Returns a value of +1 is the optical element is a lens and -1 is the element is a mirror.
   * @public
   * @returns {number}
   */
  getTypeSign() {
    return this.isLens() ? 1 : -1;
  }

  /**
   * Returns the type of optical element (Possible values are CONCAVE and CONVEX).
   * @public
   * @returns {Optic.Curve}
   */
  getCurve() {
    return this.curveProperty.value;
  }

  /**
   * Returns the position of the optical element
   * @public
   * @returns {Vector2}
   */
  getPosition() {
    return this.positionProperty.value;
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
   * Returns a shape translated by the model position of the optic
   * @public
   * @param {Shape} shape
   * @returns {Shape}
   */
  translatedShape( shape ) {
    return shape.transformed( Matrix3.translationFromVector( this.getPosition() ) );
  }

  /**
   * Gets the bounds of the optically "active" component
   * In practice, it means that we exclude the backing (fill) of the mirror
   * @public
   * @returns {Bounds2}
   */
  getOpticBounds() {
    const outlineShape = this.shapesProperty.value.outlineShape;
    const translatedShape = this.translatedShape( outlineShape );
    return translatedShape.getBounds();
  }

  /**
   * Returns a normalized value (between 0 and 1) for the index of refraction
   * @param {number} index - index of refraction
   * @public
   * @returns {number}
   */
  getNormalizedIndex( index ) {
    if ( this.isLens() ) {
      return this.indexOfRefractionProperty.range.getNormalizedValue( index );
    }
    else {

      // return the maximum value for mirror
      return 1;
    }
  }

  /**
   * Returns the shape of the vertical line
   * @public
   * @returns {Shape}
   */
  getPrincipalLine() {

    // a very large extent
    const yMax = 800; // in centimeters

    // a straight vertical line going through the middle of the optic
    const verticalLine = Shape.lineSegment( 0, yMax, 0, -yMax );

    return this.translatedShape( verticalLine );
  }

  /**
   * Returns the most extreme position within the optic that would ensure that a ray would
   * be transmitted  (or reflected).
   * (see #111)
   *
   * @public
   * @param {Vector2} sourcePoint
   * @param {Vector2} targetPoint
   * @param {Object} [options]
   * @returns {Vector2}
   */
  getExtremumPoint( sourcePoint, targetPoint, options ) {
    options = merge( {
      location: Optic.Location.TOP
    }, options );

    // erode the bounds a tiny bit such that such that the point is always within the bounds
    const opticBounds = this.getOpticBounds().erodedY( 1e-6 );

    // convenience variables
    const isTop = ( options.location === Optic.Location.TOP );
    const isConcave = this.isConcave( this.getCurve() );
    const leftPoint = isTop ? opticBounds.leftTop : opticBounds.leftBottom;
    const rightPoint = isTop ? opticBounds.rightTop : opticBounds.rightBottom;
    const centerPoint = isTop ? opticBounds.centerTop : opticBounds.centerBottom;
    const opticPoint = this.getPosition();

    // extrema point along the direction of the ray - may not be on the optic itself
    let spotPoint;

    if ( this.isMirror() ) {

      // since mirror reflect light, the spot point on the mirror itself
      spotPoint = isConcave ? leftPoint : rightPoint;
    }
    else {
      // must be lens

      if ( isConcave ) {

        // displacement vector from targetPoint to the right corner of the lens
        const rightTarget = rightPoint.minus( targetPoint );

        // displacement vector from sourcePoint to the left corner of the lens
        const leftSource = leftPoint.minus( sourcePoint );

        // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
        const yOffset1 = ( rightPoint.y - opticPoint.y ) + ( opticPoint.x - rightPoint.x ) *
                         rightTarget.y / rightTarget.x;

        // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
        const yOffset2 = ( leftPoint.y - opticPoint.y ) + ( opticPoint.x - leftPoint.x ) * leftSource.y / leftSource.x;

        // find the smallest offset to ensure that a ray will always hit both front and back surfaces
        const offsetY = Math.abs( yOffset1 ) < Math.abs( yOffset2 ) ? yOffset1 : yOffset2;

        // get the direction of the ray as measured from the source
        spotPoint = opticPoint.plusXY( 0, offsetY );
      }

      else {
        // must be a convex lens

        // spot is based on the edge point (which is centered horizontally on the optic)
        spotPoint = centerPoint;
      }
    }

    return spotPoint;
  }

  /**
   * Returns the shapes of the optic
   * The outline shape, represents the reflecting coating of a mirror, or the external surface of the lens
   * The fill shape represents the entire shape of the lens, or in the case of mirror, the backing of the mirror
   * The front shape is the left facing contour of the optic. This can be used for ray hit testing
   * The back shape is the right facing contour of the optic. back shape is null for mirror
   * The middle shape is the imaginary vertical line that splits a lens into two halves. Null for mirror.
   *
   * @param {number} radius - radius of curvature at the center of the mirror
   * @param {number} diameter - vertical height of the mirror
   * @param {Optic.Curve} curve
   * @param {Object} [options]
   * @returns {
      fillShape: Shape,
      outlineShape: Shape,
      frontShape: Shape,
      backShape: Shape|null,
      middleShape: Shape|null
    }
   * @public
   */
  getShapes( radius, diameter, curve, options ) {
    if ( this.isLens() ) {
      return Optic.getLensShapes( radius, diameter, curve, options );
    }
    else {
      return Optic.getMirrorShapes( radius, diameter, curve, options );
    }
  }
}

Optic.Type = Enumeration.byKeys( [
  'LENS', // lens
  'MIRROR' // mirror
] );

Optic.Curve = Enumeration.byKeys( [
  'CONVEX',
  'CONCAVE'
] );

Optic.Location = Enumeration.byKeys( [
  'TOP',
  'BOTTOM' ] );

geometricOptics.register( 'Optic', Optic );
export default Optic;
