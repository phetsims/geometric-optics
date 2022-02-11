// Copyright 2022, University of Colorado Boulder

/**
 * ArrowImageNode is the visual representation of an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import ArrowImage from '../model/ArrowImage.js';
import GOConstants from '../GOConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Property from '../../../../axon/js/Property.js';

type ArrowImageNodeOptions = {
  visibleProperty?: IProperty<boolean>,
  tandem: Tandem
};

class ArrowImageNode extends Node {

  /**
   * @param arrowImage
   * @param virtualImageVisibleProperty
   * @param raysAndImagesVisibleProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( arrowImage: ArrowImage,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               raysAndImagesVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: ArrowImageNodeOptions ) {

    const arrowNode = new ArrowNode( 0, 0, 0, 1, merge( {}, GOConstants.ARROW_NODE_OPTIONS, {
      fill: arrowImage.arrowObject.fill,
      stroke: arrowImage.arrowObject.stroke,
      lineDash: [ 3, 3 ] //TODO I don't like the dashed line, image should not look different than object
    } ) );

    const options = merge( {
      children: [ arrowNode ]
    }, providedOptions );

    super( options );

    Property.multilink( [ arrowImage.positionProperty, arrowImage.magnificationProperty ],
      ( arrowImagePosition: Vector2, magnification: number ) => {

        const opticPosition = modelViewTransform.modelToViewPosition( arrowImage.optic.positionProperty.value );
        const objectPosition = modelViewTransform.modelToViewPosition( arrowImage.arrowObject.positionProperty.value );
        const imagePosition = modelViewTransform.modelToViewPosition( arrowImagePosition );

        // Create an arrow that's identical to the arrow object.
        const x = imagePosition.x;
        arrowNode.setTailAndTip( x, opticPosition.y, x, objectPosition.y );

        // Scale the arrow
        // const scale = ( arrowImagePosition.y - opticPosition.y ) / ( objectPosition.y - opticPosition.y );
        // this.setScaleMagnitude( Math.abs( magnification ), magnification );
      } );

    arrowImage.opacityProperty.link( ( opacity: number ) => {
      this.opacity = opacity;
    } );
  }
}

geometricOptics.register( 'ArrowImageNode', ArrowImageNode );
export default ArrowImageNode;