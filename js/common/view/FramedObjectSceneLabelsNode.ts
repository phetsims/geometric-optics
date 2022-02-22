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

type FramedObjectSceneLabelsNodeOptions = {
  isBasicsVersion: boolean
} & GOSceneLabelsNodeOptions;

class FramedObjectSceneLabelsNode extends GOSceneLabelsNode {

  /**
   * @param scene
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param lightPropagationEnabledProperty
   * @param providedOptions
   */
  constructor( scene: FramedObjectScene,
               visibleProperties: VisibleProperties,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               lightPropagationEnabledProperty: IProperty<boolean>,
               providedOptions: FramedObjectSceneLabelsNodeOptions ) {

    const options = merge( {}, providedOptions );

    super( scene.optic, visibleProperties, zoomTransformProperty, modelVisibleBoundsProperty, options );

    // Object label ------------------------------------------------------------------------------------

    // Object 1
    const objectLabelString = options.isBasicsVersion ?
                              geometricOpticsStrings.object :
                              StringUtils.fillIn( geometricOpticsStrings.objectN, {
                                objectNumber: scene.framedObject.opticalObjectNumber
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

    const stringParams = { imageNumber: scene.framedImage1.opticalObject.opticalObjectNumber };
    scene.framedImage1.opticalImageTypeProperty.link( opticalImageType => {
      if ( options.isBasicsVersion ) {

        // Switch between 'Real Image' and 'Virtual Image'
        imageLabel.setText( opticalImageType === 'real' ?
                            geometricOpticsStrings.realImage :
                            geometricOpticsStrings.virtualImage );
      }
      else {

        // Switch between 'Real Image 1' and 'Virtual Image 1'
        imageLabel.setText( opticalImageType === 'real' ?
                            StringUtils.fillIn( geometricOpticsStrings.realImageN, stringParams ) :
                            StringUtils.fillIn( geometricOpticsStrings.virtualImageN, stringParams ) );
      }
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'FramedObjectSceneLabelsNode', FramedObjectSceneLabelsNode );
export default FramedObjectSceneLabelsNode;