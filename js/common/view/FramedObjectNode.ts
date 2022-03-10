// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedObjectNode is the view of a FramedObject, an object in a picture frame with 3D perspective.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import FramedObject from '../model/FramedObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import HTMLImageElementObjectNode, { HTMLImageElementObjectNodeOptions } from './HTMLImageElementObjectNode.js';
import Property from '../../../../axon/js/Property.js';
import { ObjectDragMode } from './ObjectDragMode.js';

type FramedObjectNodeOptions = HTMLImageElementObjectNodeOptions;

class FramedObjectNode extends HTMLImageElementObjectNode {

  /**
   * @param framedObject
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param opticPositionProperty
   * @param modelViewTransform
   * @param objectDragModeProperty
   * @param wasDraggedProperty
   * @param providedOptions
   */
  constructor( framedObject: FramedObject,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransform: ModelViewTransform2,
               objectDragModeProperty: IReadOnlyProperty<ObjectDragMode>,
               wasDraggedProperty: Property<boolean>,
               providedOptions: FramedObjectNodeOptions ) {

    super( framedObject, sceneBoundsProperty, opticPositionProperty, modelViewTransform, objectDragModeProperty, wasDraggedProperty, providedOptions );

    this.addLinkedElement( framedObject, {
      tandem: providedOptions.tandem.createTandem( framedObject.tandem.name )
    } );
  }
}

geometricOptics.register( 'FramedObjectNode', FramedObjectNode );
export default FramedObjectNode;