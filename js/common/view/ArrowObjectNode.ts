// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObjectNode is the visual representation of an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import ArrowObject from '../model/ArrowObject.js';
import Optic from '../model/Optic.js';
import GOConstants from '../GOConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';

type ArrowObjectNodeOptions = {
  visibleProperty?: IProperty<boolean>,
  tandem: Tandem
};

class ArrowObjectNode extends Node {

  /**
   * @param arrowObject
   * @param optic
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               optic: Optic,
               modelBoundsProperty: IReadOnlyProperty<Bounds2>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: ArrowObjectNodeOptions ) {

    const options = merge( {}, providedOptions );

    super( options );

    const arrowNode = new ArrowNode( 0, 0, 0, 1, merge( {}, GOConstants.ARROW_NODE_OPTIONS, {
      fill: arrowObject.fill,
      stroke: arrowObject.stroke
    } ) );
    this.addChild( arrowNode );

    Property.multilink( [ arrowObject.positionProperty, optic.positionProperty ],
      ( arrowObjectPosition, opticPosition ) => {
        const tipPosition = modelViewTransform.modelToViewPosition( arrowObjectPosition );
        const tailY = modelViewTransform.modelToViewY( opticPosition.y );
        arrowNode.setTailAndTip( tipPosition.x, tailY, tipPosition.x, tipPosition.y );
      } );
  }

  reset() {
    //TODO
  }
}

geometricOptics.register( 'ArrowObjectNode', ArrowObjectNode );
export default ArrowObjectNode;