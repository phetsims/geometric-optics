// Copyright 2022, University of Colorado Boulder

/**
 * ArrowImageNode renders the optical image (real or virtual) associated with an arrow object.
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
import { OpticalImageType } from '../model/OpticalImageType.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';

type ArrowImageNodeOptions = {
  visibleProperty?: IProperty<boolean>,
  tandem: Tandem
};

class ArrowImageNode extends Node {

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

    const arrowNode = new ArrowNode( 0, 0, 0, 1, merge( {}, GOConstants.ARROW_NODE_OPTIONS, {
      fill: arrowImage.fill,
      stroke: null
    } ) );

    const options = merge( {
      children: [ arrowNode ],

      visibleProperty: new DerivedProperty(
        [ virtualImageVisibleProperty, arrowImage.opticalImageTypeProperty, lightPropagationEnabledProperty, arrowImage.visibleProperty, objectVisibleProperty ],
        ( virtualImageVisible: boolean, opticalImageType: OpticalImageType, lightPropagationEnabled: boolean, framedImageVisible: boolean, objectVisible: boolean ) =>
          ( virtualImageVisible || opticalImageType === 'real' ) && lightPropagationEnabled && framedImageVisible && objectVisible, {
          tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
          phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
        } )
    }, providedOptions );

    super( options );

    // Don't scale the head and tail, just the magnitude.
    Property.multilink( [ arrowImage.positionProperty, arrowImage.magnificationProperty ],
      ( arrowImagePosition: Vector2, magnification: number ) => {
        const opticPosition = modelViewTransform.modelToViewPosition( arrowImage.optic.positionProperty.value );
        const objectPosition = modelViewTransform.modelToViewPosition( arrowImage.opticalObject.positionProperty.value );
        const imagePosition = modelViewTransform.modelToViewPosition( arrowImagePosition );
        const magnitude = magnification * ( objectPosition.y - opticPosition.y );
        arrowNode.setTailAndTip( imagePosition.x, opticPosition.y, imagePosition.x, opticPosition.y + magnitude );
      } );

    arrowImage.opacityProperty.link( ( opacity: number ) => {
      this.opacity = opacity;
    } );
  }
}

geometricOptics.register( 'ArrowImageNode', ArrowImageNode );
export default ArrowImageNode;