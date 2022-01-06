// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import LightRaysNode, { LightRaysNodeOptions } from './LightRaysNode.js';
import geometricOptics from '../../geometricOptics.js';
import LightRays from '../model/LightRays.js';
import Representation from '../model/Representation.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import GOQueryParameters from '../GOQueryParameters.js';
import merge from '../../../../phet-core/js/merge.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';

class LightRaysForegroundNode extends LightRaysNode {

  /**
   * @param lightRays
   * @param representationProperty
   * @param virtualImageVisibleProperty
   * @param modelViewTransform
   * @param visibleBoundsProperty
   * @param opticPositionProperty
   * @param targetPositionProperty
   * @param isVirtualProperty
   * @param providedOptions
   */
  constructor( lightRays: LightRays,
               representationProperty: IReadOnlyProperty<Representation>,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               visibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               targetPositionProperty: IReadOnlyProperty<Vector2>,
               isVirtualProperty: IReadOnlyProperty<boolean>,
               providedOptions: LightRaysNodeOptions ) {

    const options = merge( {}, providedOptions ) as LightRaysNodeOptions;
    if ( GOQueryParameters.debugRays ) {
      options.realRaysStroke = 'red';
    }

    super( lightRays, representationProperty, virtualImageVisibleProperty, modelViewTransform, options );

    // Clip area, used to make rays look like they pass through a real image.
    Property.multilink(
      [ representationProperty, opticPositionProperty, targetPositionProperty, isVirtualProperty, visibleBoundsProperty ],
      ( representation: Representation, opticPosition: Vector2, targetPosition: Vector2, isVirtual: boolean, visibleBounds: Bounds2 ) => {
        let clipArea: Shape | null = null;
        if ( representation.isObject && !isVirtual ) {

          // For a real image...
          let minX: number;
          let maxX: number;
          if ( targetPosition.x > opticPosition.x ) {

            // For a real image to the right of the optic, the clipArea is everything to the left of the image.
            minX = visibleBounds.minX;
            maxX = modelViewTransform.modelToViewX( targetPosition.x );
          }
          else {

            // For a real image to the left of the optic, the clipArea is everything to the right of the image.
            minX = modelViewTransform.modelToViewX( targetPosition.x );
            maxX = visibleBounds.maxX;
          }
          clipArea = Shape.rectangle( minX, visibleBounds.minY, maxX - minX, visibleBounds.height );
        }
        this.clipArea = clipArea;
      } );
  }
}

geometricOptics.register( 'LightRaysForegroundNode', LightRaysForegroundNode );
export default LightRaysForegroundNode;