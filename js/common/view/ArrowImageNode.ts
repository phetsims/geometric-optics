// Copyright 2022, University of Colorado Boulder

/**
 * ArrowImageNode renders the optical image (real or virtual) associated with an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import ArrowImage from '../model/ArrowImage.js';
import GOConstants from '../GOConstants.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import Property from '../../../../axon/js/Property.js';
import { OpticalImageType } from '../model/OpticalImageType.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type ArrowImageNodeOptions = PickRequired<NodeOptions, 'tandem'>;

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

    const options = optionize<ArrowImageNodeOptions, {}, NodeOptions>( {

      // NodeOptions
      opacity: 0.5, // fixed opacity, see https://github.com/phetsims/geometric-optics/issues/350#issuecomment-1062438996
      visibleProperty: new DerivedProperty(
        [ virtualImageVisibleProperty, arrowImage.opticalImageTypeProperty, lightPropagationEnabledProperty, arrowImage.visibleProperty, objectVisibleProperty ],
        ( virtualImageVisible: boolean, opticalImageType: OpticalImageType, lightPropagationEnabled: boolean, framedImageVisible: boolean, objectVisible: boolean ) =>
          ( virtualImageVisible || opticalImageType === 'real' ) && lightPropagationEnabled && framedImageVisible && objectVisible, {
          tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
          phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
        } )
    }, providedOptions );

    super( options );

    const arrowNode = new ArrowNode( 0, 0, 0, 1,
      optionize<ArrowNodeOptions, {}, ArrowNodeOptions>( {}, GOConstants.ARROW_NODE_OPTIONS, {
        fill: arrowImage.fill,
        stroke: null
      } ) );
    this.addChild( arrowNode );

    // Don't scale the head and tail, just the magnitude.
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

    this.addLinkedElement( arrowImage, {
      tandem: options.tandem.createTandem( 'arrowImage' )
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'ArrowImageNode', ArrowImageNode );
export default ArrowImageNode;