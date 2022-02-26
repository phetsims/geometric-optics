// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightObjectNode is the view of a LightObject.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import LightObject from '../model/LightObject.js';
import HTMLImageElementObjectNode, { HTMLImageElementObjectNodeOptions } from './HTMLImageElementObjectNode.js';

type LightObjectNodeOptions = HTMLImageElementObjectNodeOptions;

class LightObjectNode extends HTMLImageElementObjectNode {

  /**
   * @param lightObject
   * @param sceneBoundsProperty - bounds for the scene, in model coordinates
   * @param opticPositionProperty
   * @param modelViewTransform
   * @param dragLockedProperty - is dragging locked to horizontal?
   * @param wasDraggedProperty - was any LightObjectNode dragged?
   * @param providedOptions
   */
  constructor( lightObject: LightObject,
               sceneBoundsProperty: IReadOnlyProperty<Bounds2>,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               modelViewTransform: ModelViewTransform2,
               dragLockedProperty: IReadOnlyProperty<boolean>,
               wasDraggedProperty: Property<boolean>,
               providedOptions: LightObjectNodeOptions ) {

    super( lightObject, sceneBoundsProperty, opticPositionProperty, modelViewTransform, dragLockedProperty, wasDraggedProperty, providedOptions );

    this.addLinkedElement( lightObject, {
      tandem: providedOptions.tandem.createTandem( 'lightObject' )
    } );
  }
}

geometricOptics.register( 'LightObjectNode', LightObjectNode );
export default LightObjectNode;