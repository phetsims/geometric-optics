// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedObjectNode is the view of a framed object, an object in a picture frame, with 3D perspective.
 *
 * This class adds no additional functionality to its superclass, but is included for completeness and readability
 * of the type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import FramedObject from '../model/FramedObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import HTMLImageElementObjectNode, { HTMLImageElementObjectNodeOptions } from './HTMLImageElementObjectNode.js';
import { ObjectDragMode } from './ObjectDragMode.js';
import TProperty from '../../../../axon/js/TProperty.js';

type FramedObjectNodeOptions = HTMLImageElementObjectNodeOptions;

export default class FramedObjectNode extends HTMLImageElementObjectNode {

  /**
   * @param framedObject - model element
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param opticPositionProperty - position of the optic
   * @param modelViewTransform
   * @param objectDragModeProperty - constrains how the object can be dragged
   * @param wasDraggedProperty - was this framed object dragged?
   * @param providedOptions
   */
  public constructor( framedObject: FramedObject,
                      sceneBoundsProperty: TReadOnlyProperty<Bounds2>,
                      opticPositionProperty: TReadOnlyProperty<Vector2>,
                      modelViewTransform: ModelViewTransform2,
                      objectDragModeProperty: TReadOnlyProperty<ObjectDragMode>,
                      wasDraggedProperty: TProperty<boolean>,
                      providedOptions: FramedObjectNodeOptions ) {

    super( framedObject, sceneBoundsProperty, opticPositionProperty, modelViewTransform, objectDragModeProperty,
      wasDraggedProperty, providedOptions );
  }
}

geometricOptics.register( 'FramedObjectNode', FramedObjectNode );