// Copyright 2021-2022, University of Colorado Boulder

/**
 * ArrowObjectSceneLabelsNode labels things in the 'arrow object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import LabelNode, { LabelNodeOptions } from './LabelNode.js';
import VisibleProperties from './VisibleProperties.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowObjectScene from '../model/ArrowObjectScene.js';
import IProperty from '../../../../axon/js/IProperty.js';
import { OpticalImageType } from '../model/OpticalImageType.js';
import GOSceneLabelsNode from './GOSceneLabelsNode.js';
import ArrowImage from '../model/ArrowImage.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ArrowObject from '../model/ArrowObject.js';
import Optic from '../model/Optic.js';

type ArrowObjectSceneLabelsNodeOptions = {
  visibleProperty: Property<boolean>
};

class ArrowObjectSceneLabelsNode extends GOSceneLabelsNode {

  /**
   * @param scene
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param lightPropagationEnabledProperty
   * @param providedOptions
   */
  constructor( scene: ArrowObjectScene,
               visibleProperties: VisibleProperties,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               lightPropagationEnabledProperty: IProperty<boolean>,
               providedOptions: ArrowObjectSceneLabelsNodeOptions ) {

    const options = merge( {}, providedOptions );

    super( scene.optic, visibleProperties, zoomTransformProperty, modelVisibleBoundsProperty, options );

    // Object labels ------------------------------------------------------------------------------------

    const object1Label = new ArrowObjectLabelNode( scene.arrowObject1, scene.optic, zoomTransformProperty );
    this.addChild( object1Label );

    const object2Label = new ArrowObjectLabelNode( scene.arrowObject2, scene.optic, zoomTransformProperty, {
      visibleProperty: visibleProperties.secondPointVisibleProperty
    } );
    this.addChild( object2Label );

    // Image labels ------------------------------------------------------------------------------------

    const image1Label = new ArrowImageLabelNode( scene.arrowImage1, scene.optic, zoomTransformProperty,
      lightPropagationEnabledProperty, new BooleanProperty( true ), visibleProperties.virtualImageVisibleProperty );
    this.addChild( image1Label );

    const image2Label = new ArrowImageLabelNode( scene.arrowImage2, scene.optic, zoomTransformProperty,
      lightPropagationEnabledProperty, visibleProperties.secondPointVisibleProperty, visibleProperties.virtualImageVisibleProperty );
    this.addChild( image2Label );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

// Label for an arrow object.
class ArrowObjectLabelNode extends LabelNode {

  /**
   * @param arrowObject
   * @param optic
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               optic: Optic,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions?: LabelNodeOptions ) {

    const options = merge( {}, providedOptions );

    // Object N
    const labelString = StringUtils.fillIn( geometricOpticsStrings.objectN, {
      objectNumber: arrowObject.opticalObjectNumber
    } );

    // If the arrow points up, position the label below the optical axis.
    // Otherwise, position the label below the arrow's tip.
    const labelPositionProperty = new DerivedProperty(
      [ arrowObject.positionProperty, optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) =>
        ( arrowPosition.y > opticPosition.y ) ? new Vector2( arrowPosition.x, opticPosition.y ) : arrowPosition
    );

    super( labelString, labelPositionProperty, zoomTransformProperty, options );
  }
}

// Label for an arrow image.
class ArrowImageLabelNode extends LabelNode {

  /**
   * @param arrowImage
   * @param optic
   * @param zoomTransformProperty
   * @param arrowObjectVisibleProperty
   * @param lightPropagationEnabledProperty
   * @param virtualImageVisibleProperty
   * @param providedOptions
   */
  constructor( arrowImage: ArrowImage,
               optic: Optic,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               arrowObjectVisibleProperty: IReadOnlyProperty<boolean>,
               lightPropagationEnabledProperty: IReadOnlyProperty<boolean>,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               providedOptions?: LabelNodeOptions ) {

    const options = merge( {
      visibleProperty: new DerivedProperty(
        [ lightPropagationEnabledProperty, arrowObjectVisibleProperty, arrowImage.visibleProperty,
          arrowImage.opticalImageTypeProperty, virtualImageVisibleProperty ],
        ( lightPropagationEnabled: boolean, arrowObjectVisible: boolean, arrowImageVisible: boolean,
          opticalImageType: OpticalImageType, virtualImageVisible: boolean ) =>
          ( lightPropagationEnabled && arrowObjectVisible && arrowImageVisible && ( opticalImageType === 'real' || virtualImageVisible ) )
      )
    }, providedOptions );

    const labelPositionProperty = new DerivedProperty(
      [ arrowImage.positionProperty, optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    super( '', labelPositionProperty, zoomTransformProperty, options );

    // Switch between 'Real Image N' and 'Virtual Image N'
    const stringParams = { imageNumber: arrowImage.opticalObject.opticalObjectNumber };
    arrowImage.opticalImageTypeProperty.link( opticalImageType => {
      this.setText( opticalImageType === 'real' ?
                    StringUtils.fillIn( geometricOpticsStrings.realImageN, stringParams ) :
                    StringUtils.fillIn( geometricOpticsStrings.virtualImageN, stringParams ) );
    } );
  }
}

geometricOptics.register( 'ArrowObjectSceneLabelsNode', ArrowObjectSceneLabelsNode );
export default ArrowObjectSceneLabelsNode;