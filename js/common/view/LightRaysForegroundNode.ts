// Copyright 2022, University of Colorado Boulder

/**
 * LightRaysForegroundNode is a subclass of LightRaysNode that (using clipArea) renders that parts of LightRaysNode
 * that are in front of a real image. It is intended to be layered in front of the real image Node in the scene graph.
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

    // When light rays have been computed, update the clipArea, to make rays look like they pass through a real Image.
    lightRays.raysProcessedEmitter.addListener( () => {
        let clipArea: Shape | null = null;
        if ( representationProperty.value.isObject && !isVirtualProperty.value ) {

          const opticX = opticPositionProperty.value.x;
          const targetX = targetPositionProperty.value.x;
          const visibleBounds = visibleBoundsProperty.value;

          // For a real image...
          let minX: number;
          let maxX: number;
          if ( targetX > opticX ) {

            // For a real image to the right of the optic, the clipArea is everything to the left of the image,
            // because the image is facing left in perspective.
            minX = visibleBounds.minX;
            maxX = modelViewTransform.modelToViewX( targetX );
          }
          else {

            // For a real image to the left of the optic, the clipArea is everything to the right of the image,
            // because the image is facing right in perspective.
            minX = modelViewTransform.modelToViewX( targetX );
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