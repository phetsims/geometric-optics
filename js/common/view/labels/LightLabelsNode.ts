// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightLabelsNode labels things in the 'Light' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import geometricOptics from '../../../geometricOptics.js';
import geometricOpticsStrings from '../../../geometricOpticsStrings.js';
import LabelNode from './LabelNode.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import GOLabelsNode, { GOSceneLabelsNodeOptions } from './GOLabelsNode.js';
import LightObject from '../../model/LightObject.js';
import OpticalObjectLabelNode, { OpticalObjectLabelNodeOptions } from './OpticalObjectLabelNode.js';
import LightSceneNode from '../LightSceneNode.js';
import { GOSimOptions } from '../../../GOSim.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = PickRequired<GOSimOptions, 'isBasicsVersion'>;

type LightObjectSceneLabelsNodeOptions = SelfOptions & GOSceneLabelsNodeOptions;

class LightLabelsNode extends GOLabelsNode {

  /**
   * @param sceneNode
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param providedOptions
   */
  constructor( sceneNode: LightSceneNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: LightObjectSceneLabelsNodeOptions ) {

    super( sceneNode, zoomTransformProperty, modelVisibleBoundsProperty, providedOptions );

    const scene = sceneNode.scene;

    // Object labels ------------------------------------------------------------------------------------

    const object1Label = new LightObjectLabelNode( scene.lightObject1, zoomTransformProperty, {

      // Use numbering in the full version of the sim, or in the basics version if Object 2 is visible.
      isNumberedProperty: new DerivedProperty( [ sceneNode.lightObject2NodeVisibleProperty ],
        ( lightObject2NodeVisible: boolean ) => ( !providedOptions.isBasicsVersion || lightObject2NodeVisible )
      ),
      visibleProperty: sceneNode.lightObject1NodeVisibleProperty,
      tandem: providedOptions.tandem.createTandem( 'object1Label' )
    } );
    this.addChild( object1Label );

    const object2Label = new LightObjectLabelNode( scene.lightObject2, zoomTransformProperty, {
      visibleProperty: sceneNode.lightObject2NodeVisibleProperty,
      tandem: providedOptions.tandem.createTandem( 'object2Label' )
    } );
    this.addChild( object2Label );

    // Screen label ------------------------------------------------------------------------------------

    const screenLabelPositionProperty = new DerivedProperty(
      [ scene.projectionScreen.positionProperty ],
      ( position: Vector2 ) => new Vector2( position.x - 25, position.y - 65 ) // empirically, model coordinates
    );

    const screenLabel = new LabelNode( geometricOpticsStrings.label.projectionScreen, screenLabelPositionProperty,
      zoomTransformProperty, {
        visibleProperty: sceneNode.projectionScreenNodeVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'screenLabel' )
      } );
    this.addChild( screenLabel );
  }
}

type LightObjectLabelNodeOptions = OpticalObjectLabelNodeOptions;

// Label for a light object.
class LightObjectLabelNode extends OpticalObjectLabelNode {

  /**
   * @param lightObject
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( lightObject: LightObject,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: LightObjectLabelNodeOptions ) {

    // Position the label below the light, slightly to the left of center (determined empirically)
    const labelPositionProperty = new DerivedProperty( [ lightObject.boundsProperty ],
      ( bounds: Bounds2 ) => new Vector2( bounds.centerX - 15, bounds.top )
    );

    super( lightObject.opticalObjectNumber, labelPositionProperty, zoomTransformProperty, providedOptions );
  }
}

geometricOptics.register( 'LightLabelsNode', LightLabelsNode );
export default LightLabelsNode;