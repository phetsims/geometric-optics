// Copyright 2021, University of Colorado Boulder

/**
 * Mirror is the model of a mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic, { OpticOptions } from '../../common/model/Optic.js';
import geometricOptics from '../../geometricOptics.js';
import OpticShapeEnum from '../../common/model/OpticShapeEnum.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MirrorShapes from './MirrorShapes.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type Options = {
  tandem: Tandem
};

class Mirror extends Optic {

  readonly shapesProperty: IReadOnlyProperty<MirrorShapes>;

  constructor( providedOptions: Options ) {

    const options = merge( {
      opticShape: 'concave',
      opticShapes: [ 'concave', 'convex' ], //TODO https://github.com/phetsims/geometric-optics/issues/227 add 'flat'
      radiusOfCurvatureRange: new RangeWithValue( 150, 300, 200 ), // in cm

      // Although a mirror does not have an index of refraction, its focal length is equivalent to a lens
      // with an index of refraction of 2.
      indexOfRefractionRange: new RangeWithValue( 2, 2, 2 ), // unitless
      diameterRange: new RangeWithValue( 30, 130, 80 ), // in cm
      sign: -1,
      isConverging: ( opticShape: OpticShapeEnum ) => ( opticShape === 'concave' )

    }, providedOptions ) as OpticOptions;

    super( options );

    this.shapesProperty = new DerivedProperty(
      [ this.opticShapeProperty, this.radiusOfCurvatureProperty, this.diameterProperty ],
      ( opticShape: OpticShapeEnum, radiusOfCurvature: number, diameter: number ) =>
        new MirrorShapes( opticShape, radiusOfCurvature, diameter )
    );
  }

  //TODO a few lines here are copied from Lens getExtremumPoint
  /**
   * Returns the most extreme position within the mirror that would ensure that a ray would be transmitted (or reflected).
   * See https://github.com/phetsims/geometric-optics/issues/111
   * @param sourcePoint
   * @param targetPoint
   * @param isTop
   */
  protected getExtremumPoint( sourcePoint: Vector2, targetPoint: Vector2, isTop: boolean ): Vector2 {

    // Erode the bounds a tiny bit so that the point is always within the bounds.
    const activeBounds = this.getActiveBoundsTranslated().erodedY( 1e-6 );

    // convenience variables
    const isConcave = ( this.opticShapeProperty.value === 'concave' );
    const leftPoint = isTop ? activeBounds.leftTop : activeBounds.leftBottom;
    const rightPoint = isTop ? activeBounds.rightTop : activeBounds.rightBottom;

    // since mirror reflects light, the extremum point is on the mirror itself
    return isConcave ? leftPoint : rightPoint;
  }
}

geometricOptics.register( 'Mirror', Mirror );
export default Mirror;