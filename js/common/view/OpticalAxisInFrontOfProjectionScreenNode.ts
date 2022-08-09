// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticalAxisInFrontOfProjectionScreenNode is the part of the optical axis that is in front of the projection screen
 * in LightSceneNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line, LineOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../../common/GOColors.js';
import GOQueryParameters from '../GOQueryParameters.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;

export type OpticalAxisInFrontOfProjectionScreenNodeOptions = SelfOptions &
  PickRequired<LineOptions, 'visibleProperty'> &
  PickOptional<LineOptions, 'stroke'>;

export default class OpticalAxisInFrontOfProjectionScreenNode extends Line {

  /**
   * @param opticPositionProperty
   * @param projectionScreenPositionProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param modelViewTransform
   * @param providedOptions
   */
  public constructor( opticPositionProperty: TReadOnlyProperty<Vector2>,
                      projectionScreenPositionProperty: TReadOnlyProperty<Vector2>,
                      modelVisibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: OpticalAxisInFrontOfProjectionScreenNodeOptions ) {

    const options = optionize<OpticalAxisInFrontOfProjectionScreenNodeOptions, SelfOptions, LineOptions>()( {

      // LineOptions
      stroke: GOQueryParameters.debugOpticalAxis ? 'red' : GOColors.opticalAxisStrokeProperty,
      lineWidth: 2,
      lineDash: [ 8, 5 ]
    }, providedOptions );

    // create optical axis line, with arbitrary length values.
    super( 0, 0, 1, 0, options );

    // Set the left extent of the optical axis line.
    modelVisibleBoundsProperty.link( modelVisibleBounds => {
      this.setX1( modelViewTransform.modelToViewX( modelVisibleBounds.minX ) );
    } );

    // Set the right extent of the optical axis line.
    projectionScreenPositionProperty.link( projectionScreenPosition => {
      this.setX2( modelViewTransform.modelToViewX( projectionScreenPosition.x ) );
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

geometricOptics.register( 'OpticalAxisInFrontOfProjectionScreenNode', OpticalAxisInFrontOfProjectionScreenNode );
