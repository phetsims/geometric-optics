// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticalAxisInFrontOfProjectionScreenNode is the part of the optical axis that is in front of the projection screen
 * in LightObjectSceneNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line, LineOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../../common/GOColors.js';
import GOQueryParameters from '../GOQueryParameters.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import { PickOptional } from '../../../../phet-core/js/types/PickOptional.js';

type OpticalAxisInFrontOfProjectionScreenNodeOptions = PickRequired<LineOptions, 'visibleProperty'>
  & PickOptional<LineOptions, 'stroke'>;

class OpticalAxisInFrontOfProjectionScreenNode extends Line {

  /**
   * @param opticPositionProperty
   * @param projectionScreenPositionProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( opticPositionProperty: IReadOnlyProperty<Vector2>,
               projectionScreenPositionProperty: IReadOnlyProperty<Vector2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: OpticalAxisInFrontOfProjectionScreenNodeOptions ) {

    const options = optionize<OpticalAxisInFrontOfProjectionScreenNodeOptions, {}, LineOptions>( {
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

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalAxisInFrontOfProjectionScreenNode', OpticalAxisInFrontOfProjectionScreenNode );

export default OpticalAxisInFrontOfProjectionScreenNode;
export type { OpticalAxisInFrontOfProjectionScreenNode };
