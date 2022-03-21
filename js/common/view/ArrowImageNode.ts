// Copyright 2022, University of Colorado Boulder

/**
 * ArrowImageNode renders the optical image (real or virtual) associated with an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../geometricOptics.js';
import ArrowImage from '../model/ArrowImage.js';
import GOConstants from '../GOConstants.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import OpticalImageNode, { OpticalImageNodeOptions } from './OpticalImageNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type ArrowImageNodeOptions = PickRequired<OpticalImageNodeOptions, 'tandem'>;

class ArrowImageNode extends OpticalImageNode {

  /**
   * @param arrowImage
   * @param virtualImageVisibleProperty
   * @param lightPropagationEnabledProperty
   * @param objectVisibleProperty
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( arrowImage: ArrowImage,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               lightPropagationEnabledProperty: IReadOnlyProperty<boolean>,
               objectVisibleProperty: IReadOnlyProperty<boolean>,
               modelViewTransform: ModelViewTransform2,
               providedOptions: ArrowImageNodeOptions ) {

    super( arrowImage, virtualImageVisibleProperty, lightPropagationEnabledProperty, objectVisibleProperty, providedOptions );

    const arrowNode = new ArrowNode( 0, 0, 0, 1,
      optionize<ArrowNodeOptions, {}, ArrowNodeOptions>( {}, GOConstants.ARROW_NODE_OPTIONS, {
        fill: arrowImage.fill,
        stroke: null,
        opacity: 0.5 // fixed opacity, see https://github.com/phetsims/geometric-optics/issues/350#issuecomment-1062438996
      } ) );
    this.addChild( arrowNode );

    // Don't scale the head and tail, just the magnitude.
    // See https://github.com/phetsims/geometric-optics/issues/228#issuecomment-1039672404
    Property.multilink( [ arrowImage.positionProperty, arrowImage.magnificationProperty ],
      ( arrowImagePosition: Vector2, magnification: number ) => {

        const opticViewPosition = modelViewTransform.modelToViewPosition( arrowImage.optic.positionProperty.value );
        const objectViewPosition = modelViewTransform.modelToViewPosition( arrowImage.opticalObject.positionProperty.value );
        const imageViewPosition = modelViewTransform.modelToViewPosition( arrowImagePosition );

        let magnitude = magnification * ( objectViewPosition.y - opticViewPosition.y );
        if ( magnitude === 0 ) {
          magnitude = GOConstants.MIN_MAGNITUDE; // see https://github.com/phetsims/geometric-optics/issues/306
        }

        arrowNode.setTailAndTip( imageViewPosition.x, opticViewPosition.y, imageViewPosition.x, opticViewPosition.y + magnitude );
      } );
  }
}

geometricOptics.register( 'ArrowImageNode', ArrowImageNode );
export default ArrowImageNode;