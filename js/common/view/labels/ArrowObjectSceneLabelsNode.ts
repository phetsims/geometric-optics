// Copyright 2021-2022, University of Colorado Boulder

/**
 * ArrowObjectSceneLabelsNode labels things in the 'arrow object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import geometricOptics from '../../../geometricOptics.js';
import VisibleProperties from '../VisibleProperties.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import ArrowObjectScene from '../../model/ArrowObjectScene.js';
import IProperty from '../../../../../axon/js/IProperty.js';
import GOSceneLabelsNode, { GOSceneLabelsNodeOptions } from './GOSceneLabelsNode.js';
import ArrowImage from '../../model/ArrowImage.js';
import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import ArrowObject from '../../model/ArrowObject.js';
import Optic from '../../model/Optic.js';
import OpticalObjectLabelNode, { OpticalObjectLabelNodeOptions } from './OpticalObjectLabelNode.js';
import OpticalImageLabelNode, { OpticalImageLabelNodeOptions } from './OpticalImageLabelNode.js';

type SelfOptions = {
  isBasicsVersion: boolean;
};

type ArrowObjectSceneLabelsNodeOptions = SelfOptions & GOSceneLabelsNodeOptions;

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

    super( scene.optic, visibleProperties, zoomTransformProperty, modelVisibleBoundsProperty, providedOptions );

    // Object labels ------------------------------------------------------------------------------------

    const object2Label = new ArrowObjectLabelNode( scene.arrowObject2, scene.optic, zoomTransformProperty, {
      visibleProperty: visibleProperties.secondPointVisibleProperty
    } );
    this.addChild( object2Label );

    const object1Label = new ArrowObjectLabelNode( scene.arrowObject1, scene.optic, zoomTransformProperty, {

      // Use numbering in the full version of the sim, or in the basics version if Object 2 is visible.
      isNumberedProperty: new DerivedProperty( [ object2Label.visibleProperty ],
        ( object2LabelVisible: boolean ) => ( !providedOptions.isBasicsVersion || object2LabelVisible )
      )
    } );
    this.addChild( object1Label );

    // Image labels ------------------------------------------------------------------------------------

    const image2Label = new ArrowImageLabelNode( scene.arrowImage2, scene.optic, zoomTransformProperty,
      visibleProperties.secondPointVisibleProperty, lightPropagationEnabledProperty,
      visibleProperties.virtualImageVisibleProperty );
    this.addChild( image2Label );

    const image1Label = new ArrowImageLabelNode( scene.arrowImage1, scene.optic, zoomTransformProperty,
      new BooleanProperty( true ), lightPropagationEnabledProperty, visibleProperties.virtualImageVisibleProperty, {

        // Use numbering in the full version of the sim, or in the basics version if Image 2 is made visible.
        isNumberedProperty: new DerivedProperty( [ image2Label.visibleProperty ],
          ( image2LabelVisible: boolean ) => ( !providedOptions.isBasicsVersion || image2LabelVisible )
        )
      } );
    this.addChild( image1Label );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

// Label for an arrow object.
class ArrowObjectLabelNode extends OpticalObjectLabelNode {

  /**
   * @param arrowObject
   * @param optic
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               optic: Optic,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions?: OpticalObjectLabelNodeOptions ) {

    // If the arrow points up, position the label below the optical axis.
    // Otherwise, position the label below the arrow's tip.
    const labelPositionProperty = new DerivedProperty(
      [ arrowObject.positionProperty, optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) =>
        ( arrowPosition.y > opticPosition.y ) ? new Vector2( arrowPosition.x, opticPosition.y ) : arrowPosition
    );

    super( arrowObject.opticalObjectNumber, labelPositionProperty, zoomTransformProperty, providedOptions );
  }
}

// Label for an arrow image.
class ArrowImageLabelNode extends OpticalImageLabelNode {

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
               providedOptions?: OpticalImageLabelNodeOptions ) {

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

    super( arrowImage, labelPositionProperty, zoomTransformProperty, arrowObjectVisibleProperty,
      lightPropagationEnabledProperty, virtualImageVisibleProperty, providedOptions );
  }
}

geometricOptics.register( 'ArrowObjectSceneLabelsNode', ArrowObjectSceneLabelsNode );
export default ArrowObjectSceneLabelsNode;