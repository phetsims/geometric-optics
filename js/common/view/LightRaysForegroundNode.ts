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
   * @param targetPositionProperty
   * @param isVirtualProperty
   * @param providedOptions
   */
  constructor( lightRays: LightRays,
               representationProperty: IReadOnlyProperty<Representation>,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               visibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               targetPositionProperty: IReadOnlyProperty<Vector2>,
               isVirtualProperty: IReadOnlyProperty<boolean>,
               providedOptions: LightRaysNodeOptions ) {

    const options = merge( {}, providedOptions ) as LightRaysNodeOptions;
    if ( GOQueryParameters.debugRays ) {
      options.realRaysStroke = 'red';
    }

    super( lightRays, representationProperty, virtualImageVisibleProperty, modelViewTransform, options );

    // Clip area
    Property.multilink(
      [ representationProperty, targetPositionProperty, isVirtualProperty, visibleBoundsProperty ],
      ( representation: Representation, targetPosition: Vector2, isVirtual: boolean, visibleBounds: Bounds2 ) => {
        if ( representation.isObject && !isVirtual ) {

          // For a source object and real image, clipArea is 1 rectangle, including everything to the left of the image.
          const maxX = modelViewTransform.modelToViewX( targetPosition.x );
          this.clipArea = Shape.rectangle( visibleBounds.minX, visibleBounds.minY, maxX - visibleBounds.minX, visibleBounds.height );
        }
        else {
          this.clipArea = null;
        }
      } );
  }
}

geometricOptics.register( 'LightRaysForegroundNode', LightRaysForegroundNode );
export default LightRaysForegroundNode;