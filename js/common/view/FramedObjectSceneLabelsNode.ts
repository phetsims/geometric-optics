// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedObjectSceneLabelsNode labels things in the 'framed object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import LabelNode from './LabelNode.js';
import VisibleProperties from './VisibleProperties.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import FramedObjectScene from '../model/FramedObjectScene.js';
import { OpticalImageType } from '../model/OpticalImageType.js';
import merge from '../../../../phet-core/js/merge.js';
import IProperty from '../../../../axon/js/IProperty.js';
import GOSceneLabelsNode, { GOSceneLabelsNodeOptions } from './GOSceneLabelsNode.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

class FramedObjectSceneLabelsNode extends GOSceneLabelsNode {

  /**
   * @param scene
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty
   * @param lightPropagationEnabledProperty
   * @param providedOptions
   */
  constructor( scene: FramedObjectScene,
               visibleProperties: VisibleProperties,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               lightPropagationEnabledProperty: IProperty<boolean>,
               providedOptions: GOSceneLabelsNodeOptions ) {

    const options = merge( {}, providedOptions );

    super( scene.optic, visibleProperties, zoomTransformProperty, modelVisibleBoundsProperty, options );

    // Object label ------------------------------------------------------------------------------------

    // Object 1
    const objectLabelString = StringUtils.fillIn( geometricOpticsStrings.objectN, {
      objectNumber: 1
    } );

    const objectLabelPositionProperty = new DerivedProperty(
      [ scene.framedObject.boundsProperty ],
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const objectLabel = new LabelNode( objectLabelString, objectLabelPositionProperty, zoomTransformProperty );
    this.addChild( objectLabel );

    // Image label ------------------------------------------------------------------------------------

    const imageLabelPositionProperty = new DerivedProperty(
      [ scene.framedImage1.boundsProperty ],
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const imageLabel = new LabelNode( '', imageLabelPositionProperty, zoomTransformProperty, {
      visibleProperty: new DerivedProperty( [ lightPropagationEnabledProperty, scene.framedImage1.visibleProperty,
          scene.framedImage1.opticalImageTypeProperty, visibleProperties.virtualImageVisibleProperty ],
        ( lightPropagationEnabled: boolean, imageVisible: boolean, opticalImageType: OpticalImageType, virtualImageVisible: boolean ) =>
          ( lightPropagationEnabled && imageVisible && ( opticalImageType === 'real' || virtualImageVisible ) )
      )
    } );
    this.addChild( imageLabel );

    // Switch between 'Real Image 1' and 'Virtual Image 1'
    const imageNumber = 1;
    scene.framedImage1.opticalImageTypeProperty.link( opticalImageType => {
      imageLabel.setText( opticalImageType === 'real' ?
                          StringUtils.fillIn( geometricOpticsStrings.realImageN, { imageNumber: imageNumber } ) :
                          StringUtils.fillIn( geometricOpticsStrings.virtualImageN, { imageNumber: imageNumber } ) );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'FramedObjectSceneLabelsNode', FramedObjectSceneLabelsNode );
export default FramedObjectSceneLabelsNode;