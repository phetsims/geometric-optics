// Copyright 2021, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/199 eliminate this, make Nodes responsible for their labels
/**
 * LabelsNode is the parent Node for labels that appear below things of interest in the user interface.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import LabelNode from './LabelNode.js';
import GeometricOpticsModel from '../model/GeometricOpticsModel.js';
import VisibleProperties from './VisibleProperties.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import OpticShapeEnum from '../model/OpticShapeEnum.js';
import Representation from '../model/Representation.js';

class LabelsNode extends Node {

  /**
   * @param {GeometricOpticsModel} model
   * @param {VisibleProperties} visibleProperties
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Property.<number>} zoomLevelProperty
   * @param {Object} [options]
   */
  constructor( model: GeometricOpticsModel, visibleProperties: VisibleProperties,
               modelViewTransformProperty: Property<ModelViewTransform2>,
               zoomLevelProperty: Property<number>, options?: any ) { //TODO-TS any

    options = merge( {
      visibleProperty: visibleProperties.labelsVisibleProperty
    }, options );

    // Object label ------------------------------------------------------------------------------------

    const objectLabelPositionProperty = new DerivedProperty<Vector2>(
      [ model.sourceObject.boundsProperty ],
      // Because the we use a Y-inverted reference frame, the bottom of the image is the top of the model bounds.
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const objectLabel = new LabelNode( geometricOpticsStrings.object, objectLabelPositionProperty,
      modelViewTransformProperty, {
        visibleProperty: new DerivedProperty<boolean>( [ model.representationProperty ],
          ( representation: Representation ) => representation.isObject )
      } );

    // Optic label ------------------------------------------------------------------------------------

    const opticLabelPositionProperty = new DerivedProperty<Vector2>(
      [ model.optic.positionProperty, model.optic.diameterProperty ],
      ( position: Vector2, diameter: number ) => position.minusXY( 0, diameter / 2 )
    );

    const opticLabel = new LabelNode( '', opticLabelPositionProperty, modelViewTransformProperty );

    model.optic.opticShapeProperty.link( ( opticShape: OpticShapeEnum ) => {
      let text: string;
      if ( model.optic.isConvex( opticShape ) ) {
        text = model.optic.isLens() ? geometricOpticsStrings.convexLens : geometricOpticsStrings.convexMirror;
      }
      else if ( model.optic.isConcave( opticShape ) ) {
        text = model.optic.isLens() ? geometricOpticsStrings.concaveLens : geometricOpticsStrings.concaveMirror;
      }
      else {
        throw new Error( `unsupported opticShape: ${opticShape}` );
      }
      opticLabel.setText( text );
    } );

    // Focal point labels ------------------------------------------------------------------------------------

    const leftFocalPointLabel = new LabelNode( geometricOpticsStrings.focalPoint,
      model.optic.leftFocalPointProperty, modelViewTransformProperty, {
        visibleProperty: visibleProperties.focalPointsVisibleProperty
      } );

    const rightFocalPointLabel = new LabelNode( geometricOpticsStrings.focalPoint,
      model.optic.rightFocalPointProperty, modelViewTransformProperty, {
        visibleProperty: visibleProperties.focalPointsVisibleProperty
      } );

    // Image label ------------------------------------------------------------------------------------

    const imageLabelPositionProperty = new DerivedProperty<Vector2>(
      [ model.firstTarget.boundsProperty ],
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const imageLabelVisibleProperty = new DerivedProperty<boolean>( [
        model.firstTarget.visibleProperty,
        model.representationProperty,
        model.firstTarget.isVirtualProperty,
        visibleProperties.virtualImageVisibleProperty
      ],
      ( visible: boolean, representation: Representation, isVirtual: boolean, virtualImageVisible: boolean ) =>
        ( visible && representation.isObject && ( isVirtual ? virtualImageVisible : true ) )
    );

    const imageLabel = new LabelNode( '', imageLabelPositionProperty, modelViewTransformProperty, {
      visibleProperty: imageLabelVisibleProperty
    } );

    // Switch between 'Real Image' and 'Virtual Image'
    model.firstTarget.isVirtualProperty.link( ( isVirtual: boolean ) => {
      imageLabel.setText( isVirtual ? geometricOpticsStrings.virtualImage : geometricOpticsStrings.realImage );
    } );

    // Screen label ------------------------------------------------------------------------------------

    //TODO irrelevant for Mirror screen
    const screenLabelPositionProperty = new DerivedProperty<Vector2>(
      [ model.projectionScreen.positionProperty ],
      ( position: Vector2 ) => new Vector2( position.x - 25, position.y - 65 ) // empirically, model coordinates
    );

    const screenLabel = new LabelNode( geometricOpticsStrings.projectionScreen, screenLabelPositionProperty, modelViewTransformProperty, {
      visibleProperty: new DerivedProperty<boolean>(
        [ model.representationProperty ],
        ( representation: Representation ) => !representation.isObject
      )
    } );

    // Optical Axis label ------------------------------------------------------------------------------------

    const opticalAxisLabelPositionProperty = new DerivedProperty<Vector2>(
      [ model.optic.positionProperty ],
      ( position: Vector2 ) => new Vector2( position.x - 230, position.y ) // empirically, model coordinates
    );

    const opticalAxisLabel = new LabelNode( geometricOpticsStrings.opticalAxis, opticalAxisLabelPositionProperty, modelViewTransformProperty );

    // ------------------------------------------------------------------------------------

    assert && assert( !options.children );
    options.children = [
      opticalAxisLabel,
      leftFocalPointLabel, rightFocalPointLabel,
      opticLabel, objectLabel, imageLabel, screenLabel
    ];

    super( options );
  }

  /**
   * @override
   */
  public dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'LabelsNode', LabelsNode );
export default LabelsNode;