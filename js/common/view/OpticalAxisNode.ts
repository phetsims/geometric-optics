// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticalAxisNode is the horizontal line that passes through the geometric center of a lens or mirror.
 * It is referred to as 'optical axis', or sometimes as 'principal axis'.
 * It extends from left to right edges of the browser window.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line, LineOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;

export type OpticalAxisNodeOptions = SelfOptions &
  PickRequired<LineOptions, 'visibleProperty'> &
  PickOptional<LineOptions, 'stroke' | 'tandem'>;

export default class OpticalAxisNode extends Line {

  /**
   * @param opticPositionProperty - position of the optic
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param modelViewTransform
   * @param providedOptions
   */
  public constructor( opticPositionProperty: TReadOnlyProperty<Vector2>,
                      modelVisibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: OpticalAxisNodeOptions ) {

    // create optical axis line, with arbitrary length values.
    super( 0, 0, 1, 0, optionize<OpticalAxisNodeOptions, SelfOptions, LineOptions>()( {

      // LineOptions
      stroke: GOColors.opticalAxisStrokeProperty,
      lineWidth: 2,
      lineDash: [ 8, 5 ]
    }, providedOptions ) );

    // Set the horizontal extents of the optical axis line.
    modelVisibleBoundsProperty.link( modelVisibleBounds => {
      this.setX1( modelViewTransform.modelToViewX( modelVisibleBounds.minX ) );
      this.setX2( modelViewTransform.modelToViewX( modelVisibleBounds.maxX ) );
    } );

    // Set the y position of the optical axis line.
    opticPositionProperty.link( position => {
      const yView = modelViewTransform.modelToViewY( position.y );
      this.setY1( yView );
      this.setY2( yView );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalAxisNode', OpticalAxisNode );