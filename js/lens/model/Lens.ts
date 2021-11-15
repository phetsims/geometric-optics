// Copyright 2021, University of Colorado Boulder

/**
 * Lens is the model of a lens.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import OpticShapeEnum from '../../common/model/OpticShapeEnum.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class Lens extends Optic {

  /**
   * @param {Object} [options]
   */
  constructor( options?: any ) { //TYPESCRIPT any
    super( merge( {
      opticType: 'lens',
      opticShape: 'convex',
      opticShapes: [ 'convex', 'concave' ],
      radiusOfCurvatureRange: new RangeWithValue( 30, 130, 80 ), // in cm
      indexOfRefractionRange: new RangeWithValue( 1.2, 1.9, 1.5 ), // unitless
      diameterRange: new RangeWithValue( 30, 130, 80 ), // in cm
      sign: 1,
      isConverging: ( opticShape: OpticShapeEnum ) => ( opticShape === 'convex' ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options ) );
  }

  /**
   * Returns the most extreme position within the lens that would ensure that a ray would be transmitted (or reflected).
   * See https://github.com/phetsims/geometric-optics/issues/111
   */
  protected getExtremumPoint( sourcePoint: Vector2, targetPoint: Vector2, isTop: boolean ): Vector2 {

    // Erode the bounds a tiny bit so that the point is always within the bounds.
    const opticBounds = this.getOpticBounds().erodedY( 1e-6 );

    // convenience variables
    const leftPoint = isTop ? opticBounds.leftTop : opticBounds.leftBottom;
    const rightPoint = isTop ? opticBounds.rightTop : opticBounds.rightBottom;
    const opticShape = this.opticShapeProperty.value;

    // extremum point along the direction of the ray, may not be on the optic itself
    let extremumPoint;
    if ( opticShape === 'concave' ) {

      const opticPosition = this.positionProperty.value;

      // displacement vector from targetPoint to the right corner of the lens
      const rightTarget = rightPoint.minus( targetPoint );

      // displacement vector from sourcePoint to the left corner of the lens
      const leftSource = leftPoint.minus( sourcePoint );

      // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
      const yOffset1 = ( rightPoint.y - opticPosition.y ) + ( opticPosition.x - rightPoint.x ) *
                       rightTarget.y / rightTarget.x;

      // yOffset (from center of lens) of a ray directed from targetPoint to the right corner of lens
      const yOffset2 = ( leftPoint.y - opticPosition.y ) + ( opticPosition.x - leftPoint.x ) * leftSource.y / leftSource.x;

      // find the smallest offset to ensure that a ray will always hit both front and back surfaces
      const offsetY = Math.abs( yOffset1 ) < Math.abs( yOffset2 ) ? yOffset1 : yOffset2;

      // get the direction of the ray as measured from the source
      extremumPoint = opticPosition.plusXY( 0, offsetY );
    }
    else if ( opticShape === 'convex' ) {

      // extremum point is based on the edge point (which is centered horizontally on the optic)
      extremumPoint = isTop ? opticBounds.centerTop : opticBounds.centerBottom;
    }
    else {
      throw new Error( `unsupported lens shape: ${opticShape}` );
    }

    return extremumPoint;
  }
}

geometricOptics.register( 'Lens', Lens );
export default Lens;