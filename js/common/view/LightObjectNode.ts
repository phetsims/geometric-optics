// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightObjectNode is the view of a light object. It looks like a lamp with a bulb, pointing towards the right.
 *
 * This class adds no additional functionality to its superclass, but is included for completeness and readability
 * of the type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import LightObject from '../model/LightObject.js';
import HTMLImageElementObjectNode, { HTMLImageElementObjectNodeOptions } from './HTMLImageElementObjectNode.js';
import { ObjectDragMode } from './ObjectDragMode.js';
import IProperty from '../../../../axon/js/IProperty.js';

type LightObjectNodeOptions = HTMLImageElementObjectNodeOptions;

export default class LightObjectNode extends HTMLImageElementObjectNode {

  /**
   * @param lightObject - model element
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param opticPositionProperty - position of the optic
   * @param modelViewTransform
   * @param objectDragModeProperty - constrains how the light can be dragged
   * @param wasDraggedProperty - was ANY LightObjectNode dragged?
   * @param providedOptions
   */
  constructor( lightObject: LightObject,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransform: ModelViewTransform2,
               objectDragModeProperty: IReadOnlyProperty<ObjectDragMode>,
               wasDraggedProperty: IProperty<boolean>,
               providedOptions: LightObjectNodeOptions ) {

    super( lightObject, sceneBoundsProperty, opticPositionProperty, modelViewTransform, objectDragModeProperty,
      wasDraggedProperty, providedOptions );
  }
}

geometricOptics.register( 'LightObjectNode', LightObjectNode );