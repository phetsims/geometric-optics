// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightObjectSceneLabelsNode labels things in the 'light object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sarah Chang (Swarthmore College)
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
import LightObjectScene from '../model/LightObjectScene.js';
import GOSceneLabelsNode from './GOSceneLabelsNode.js';

type LightObjectSceneLabelsNodeOptions = {
  visibleProperty: Property<boolean>
};

class LightObjectSceneLabelsNode extends GOSceneLabelsNode {

  /**
   * @param scene
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty
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

    // empirically, model coordinates
    const getLightLabelPosition = ( lightObjectBounds: Bounds2 ) =>
      new Vector2( lightObjectBounds.centerX - 15, lightObjectBounds.top );

    const object1LabelPositionProperty = new DerivedProperty(
      [ scene.lightObject1.boundsProperty ],
      ( bounds: Bounds2 ) => getLightLabelPosition( bounds )
    );

    const object1Label = new LabelNode( geometricOpticsStrings.object1, object1LabelPositionProperty, zoomTransformProperty );
    this.addChild( object1Label );

    const object2LabelPositionProperty = new DerivedProperty(
      [ scene.lightObject2.boundsProperty ],
      ( bounds: Bounds2 ) => getLightLabelPosition( bounds )
    );

    const object2Label = new LabelNode( geometricOpticsStrings.object2, object2LabelPositionProperty, zoomTransformProperty, {
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

geometricOptics.register( 'LightObjectSceneLabelsNode', LightObjectSceneLabelsNode );
export default LightObjectSceneLabelsNode;