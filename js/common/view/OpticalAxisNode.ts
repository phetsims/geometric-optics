// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticalAxisNode is the horizontal line that passes through the geometric center of a lens or mirror.
 * It is referred to as 'optical axis', or sometimes as 'principal axis'.
 * It extends from left to right edges of the browser window.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';

type OpticalAxisNodeOptions = {
  stroke?: ColorDef,
  visibleProperty: IProperty<boolean>
};

class OpticalAxisNode extends Line {

  /**
   * @param opticPositionProperty
   * @param visibleBoundsProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( opticPositionProperty: IReadOnlyProperty<Vector2>, visibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2, providedOptions: OpticalAxisNodeOptions ) {

    // create optical axis line, with arbitrary length values.
    super( 0, 0, 1, 0, merge( {
      stroke: GOColors.opticalAxisStrokeProperty,
      lineWidth: 2,
      lineDash: [ 8, 5 ]
    }, providedOptions ) );

    // set the horizontal extent of the optical axis line
    visibleBoundsProperty.link( visibleBounds => {
      console.log( `visibleBounds=${visibleBounds}` );//XXX
      this.setX1( visibleBounds.minX );
      this.setX2( visibleBounds.maxX );
    } );

    // update y-position of line based on position of optic
    opticPositionProperty.link( position => {
      const yView = modelViewTransform.modelToViewY( position.y );
      this.setY1( yView );
      this.setY2( yView );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalAxisNode', OpticalAxisNode );

export default OpticalAxisNode;
export type { OpticalAxisNodeOptions };
