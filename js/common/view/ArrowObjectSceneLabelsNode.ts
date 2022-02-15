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
import LabelNode from './LabelNode.js';
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

type ArrowObjectSceneLabelsNodeOptions = {
  visibleProperty: Property<boolean>
};

class ArrowObjectSceneLabelsNode extends GOSceneLabelsNode {

  /**
   * @param scene
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty
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

    const object1LabelPositionProperty = new DerivedProperty(
      [ scene.arrowObject1.positionProperty, scene.optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    const object1Label = new LabelNode( geometricOpticsStrings.object1, object1LabelPositionProperty, zoomTransformProperty );
    this.addChild( object1Label );

    const object2LabelPositionProperty = new DerivedProperty(
      [ scene.arrowObject2.positionProperty, scene.optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    const object2Label = new LabelNode( geometricOpticsStrings.object2, object2LabelPositionProperty,
      zoomTransformProperty, {
        visibleProperty: visibleProperties.secondPointVisibleProperty
      } );
    this.addChild( object2Label );

    // Image labels ------------------------------------------------------------------------------------

    const image1LabelPositionProperty = new DerivedProperty(
      [ scene.arrowImage1.positionProperty, scene.optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    const image1Label = new LabelNode( '', image1LabelPositionProperty, zoomTransformProperty, {
      visibleProperty: new DerivedProperty( [
          lightPropagationEnabledProperty,
          scene.arrowImage1.visibleProperty,
          scene.arrowImage1.opticalImageTypeProperty,
          visibleProperties.virtualImageVisibleProperty
        ],
        ( lightPropagationEnabled: boolean, imageVisible: boolean, opticalImageType: OpticalImageType, virtualImageVisible: boolean ) =>
          ( lightPropagationEnabled && imageVisible && ( opticalImageType === 'real' || virtualImageVisible ) )
      )
    } );
    this.addChild( image1Label );

    // Switch between 'Real Image' and 'Virtual Image'
    scene.arrowImage1.opticalImageTypeProperty.link( opticalImageType => {
      image1Label.setText( opticalImageType === 'real' ? geometricOpticsStrings.realImage1 : geometricOpticsStrings.virtualImage1 );
    } );

    const image2LabelPositionProperty = new DerivedProperty(
      [ scene.arrowImage2.positionProperty, scene.optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    const image2Label = new LabelNode( '', image2LabelPositionProperty, zoomTransformProperty, {
      visibleProperty: new DerivedProperty( [
          visibleProperties.secondPointVisibleProperty,
          lightPropagationEnabledProperty,
          scene.arrowImage2.visibleProperty,
          scene.arrowImage2.opticalImageTypeProperty,
          visibleProperties.virtualImageVisibleProperty
        ],
        ( secondPointVisible: boolean, lightPropagationEnabled: boolean, imageVisible: boolean, opticalImageType: OpticalImageType, virtualImageVisible: boolean ) =>
          ( secondPointVisible && lightPropagationEnabled && imageVisible && ( opticalImageType === 'real' || virtualImageVisible ) )
      )
    } );
    this.addChild( image2Label );

    // Switch between 'Real Image' and 'Virtual Image'
    scene.arrowImage2.opticalImageTypeProperty.link( opticalImageType => {
      image2Label.setText( opticalImageType === 'real' ? geometricOpticsStrings.realImage2 : geometricOpticsStrings.virtualImage2 );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'ArrowObjectSceneLabelsNode', ArrowObjectSceneLabelsNode );
export default ArrowObjectSceneLabelsNode;