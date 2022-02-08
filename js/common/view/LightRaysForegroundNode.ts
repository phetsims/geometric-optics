// Copyright 2022, University of Colorado Boulder

/**
 * LightRaysForegroundNode is a subclass of LightRaysNode that (using clipArea) renders the parts of LightRaysNode
 * that are in front of a real framed image, which has 3D perspective. It is intended to be used in
 * FramedObjectSceneNode, where it is layered in front of the real image Node in the scene graph.
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
import { Path } from '../../../../scenery/js/imports.js';

class LightRaysForegroundNode extends LightRaysNode {

  /**
   * @param lightRays
   * @param representationProperty
   * @param virtualImageVisibleProperty
   * @param modelViewTransform
   * @param modelVisibleBoundsProperty - bounds where rays may appear, in model coordinates
   * @param opticPositionProperty
   * @param frameImagePositionProperty
   * @param isVirtualProperty
   * @param providedOptions
   */
  constructor( lightRays: LightRays,
               representationProperty: IReadOnlyProperty<Representation>,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               frameImagePositionProperty: IReadOnlyProperty<Vector2>,
               isVirtualProperty: IReadOnlyProperty<boolean>,
               providedOptions: LightRaysNodeOptions ) {

    const options = merge( {}, providedOptions );
    if ( GOQueryParameters.debugRays ) {
      options.realRaysStroke = 'red';
    }

    super( lightRays, representationProperty, virtualImageVisibleProperty, modelViewTransform, options );

    // Stroke the clipArea in red.
    let clipAreaNode: Path;
    if ( GOQueryParameters.debugRays ) {
      clipAreaNode = new Path( null, {
        stroke: 'red'
      } );
      this.addChild( clipAreaNode );
    }

    // Update the clipArea, to make rays look like they pass through a real Image.
    // This shows only the parts of this Node that are in the foreground, i.e. not occluded by other things.
    // Run with ?debugRays to see the clipArea rendered as a rectangle.
    const updateClipArea = () => {
      let clipArea: Shape | null; // in view coordinates

      if ( isVirtualProperty.value ) {

        // virtual image
        clipArea = null;
      }
      else {

        // real image
        const opticPosition = opticPositionProperty.value;
        const imagePosition = frameImagePositionProperty.value;
        const viewVisibleBounds = modelViewTransform.modelToViewBounds( modelVisibleBoundsProperty.value );

        let minX: number;
        let maxX: number;
        if ( imagePosition.x > opticPosition.x ) {

          // For a real Image to the right of the optic, the clipArea is everything to the left of the Image,
          // because the Image is facing left in perspective.
          minX = viewVisibleBounds.minX;
          maxX = modelViewTransform.modelToViewX( imagePosition.x );
        }
        else {

          // For a real Image to the left of the optic, the clipArea is everything to the right of the Image,
          // because the Image is facing right in perspective.
          minX = modelViewTransform.modelToViewX( imagePosition.x );
          maxX = viewVisibleBounds.maxX;
        }
        clipArea = Shape.rectangle( minX, viewVisibleBounds.minY, maxX - minX, viewVisibleBounds.height );
      }
      this.clipArea = clipArea;

      if ( clipAreaNode ) {
        clipAreaNode.shape = clipArea;
      }
    };

    lightRays.raysProcessedEmitter.addListener( () => {
      if ( this.visible ) {
        updateClipArea();
      }
    } );

    this.visibleProperty.link( visible => {
      if ( visible ) {
        updateClipArea();
      }
    } );
  }
}

geometricOptics.register( 'LightRaysForegroundNode', LightRaysForegroundNode );
export default LightRaysForegroundNode;