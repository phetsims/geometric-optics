// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightObjectSceneLabelsNode labels things in the 'light object' scene.
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
import LightObjectScene from '../model/LightObjectScene.js';
import GOSceneLabelsNode from './GOSceneLabelsNode.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import LightObject from '../model/LightObject.js';

type LightObjectSceneLabelsNodeOptions = {
  visibleProperty: Property<boolean>
};

class LightObjectSceneLabelsNode extends GOSceneLabelsNode {

  /**
   * @param scene
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param providedOptions
   */
  constructor( scene: LightObjectScene,
               visibleProperties: VisibleProperties,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: LightObjectSceneLabelsNodeOptions ) {

    const options = merge( {}, providedOptions );

    super( scene.optic, visibleProperties, zoomTransformProperty, modelVisibleBoundsProperty, options );

    // Object labels ------------------------------------------------------------------------------------

    const object1Label = new LightObjectLabelNode( scene.lightObject1, zoomTransformProperty );
    this.addChild( object1Label );

    const object2Label = new LightObjectLabelNode( scene.lightObject2, zoomTransformProperty, {
      visibleProperty: visibleProperties.secondPointVisibleProperty
    } );
    this.addChild( object2Label );

    // Screen label ------------------------------------------------------------------------------------

    const screenLabelPositionProperty = new DerivedProperty(
      [ scene.projectionScreen.positionProperty ],
      ( position: Vector2 ) => new Vector2( position.x - 25, position.y - 65 ) // empirically, model coordinates
    );

    const screenLabel = new LabelNode( geometricOpticsStrings.projectionScreen, screenLabelPositionProperty, zoomTransformProperty );
    this.addChild( screenLabel );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

// Label for a light object.
class LightObjectLabelNode extends LabelNode {

  /**
   * @param lightObject
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( lightObject: LightObject,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions?: LabelNodeOptions ) {

    const options = merge( {}, providedOptions );

    // Object N
    const labelString = StringUtils.fillIn( geometricOpticsStrings.objectN, {
      objectNumber: lightObject.opticalObjectNumber
    } );

    // Position the label below the light, slightly to the left of center (determined empirically)
    const labelPositionProperty = new DerivedProperty( [ lightObject.boundsProperty ],
      ( bounds: Bounds2 ) => new Vector2( bounds.centerX - 15, bounds.top )
    );

    super( labelString, labelPositionProperty, zoomTransformProperty, options );
  }
}

geometricOptics.register( 'LightObjectSceneLabelsNode', LightObjectSceneLabelsNode );
export default LightObjectSceneLabelsNode;