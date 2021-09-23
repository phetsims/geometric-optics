// Copyright 2021, University of Colorado Boulder

/**
 * LabelsNode is the parent Node for labels that appear below things of interest in the user interface.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import LabelNode from './LabelNode.js';

class LabelsNode extends Node {

  /**
   * @param {GeometricOpticsModel} model
   * @param {VisibleProperties} visibleProperties
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Property.<boolean>} zoomLevelProperty
   * @param {Object} [options]
   */
  constructor( model, visibleProperties, modelViewTransformProperty, zoomLevelProperty, options ) {

    options = merge( {
      visibleProperty: visibleProperties.labelsVisibleProperty
    }, options );

    // Object label ------------------------------------------------------------------------------------

    const objectLabelPositionProperty = new DerivedProperty(
      [ model.sourceObject.boundsProperty ],
      // Because the we use a Y-inverted reference frame, the bottom of the image is the top of the model bounds.
      bounds => bounds.centerTop
    );

    const objectLabel = new LabelNode( geometricOpticsStrings.object, objectLabelPositionProperty,
      modelViewTransformProperty, {
        visibleProperty: new DerivedProperty( [ model.representationProperty ], representation => representation.isObject )
      } );

    // Optic label ------------------------------------------------------------------------------------

    const opticLabelPositionProperty = new DerivedProperty(
      [ model.optic.positionProperty, model.optic.diameterProperty ],
      ( position, diameter ) => position.minusXY( 0, diameter / 2 )
    );

    const opticLabel = new LabelNode( '', opticLabelPositionProperty, modelViewTransformProperty );

    model.optic.curveProperty.link( curve => {
      let text;
      if ( model.optic.isConvex( curve ) ) {
        text = model.optic.isLens() ? geometricOpticsStrings.convexLens : geometricOpticsStrings.convexMirror;
      }
      else if ( model.optic.isConcave( curve ) ) {
        text = model.optic.isLens() ? geometricOpticsStrings.concaveLens : geometricOpticsStrings.concaveMirror;
      }
      opticLabel.setText( text );
    } );

    // Focal point labels ------------------------------------------------------------------------------------

    const leftFocalPointLabel = new LabelNode( geometricOpticsStrings.focalPoint, model.leftFocalPoint.positionProperty,
      modelViewTransformProperty, {
        visibleProperty: visibleProperties.focalPointVisibleProperty
      } );

    const rightFocalPointLabel = new LabelNode( geometricOpticsStrings.focalPoint, model.rightFocalPoint.positionProperty,
      modelViewTransformProperty, {
        visibleProperty: visibleProperties.focalPointVisibleProperty
      } );

    // Image label ------------------------------------------------------------------------------------

    const imageLabelPositionProperty = new DerivedProperty(
      [ model.firstTarget.boundsProperty ],
      bounds => bounds.centerTop
    );

    const imageLabelVisibleProperty = new DerivedProperty( [
        model.firstTarget.visibleProperty,
        model.representationProperty,
        model.firstTarget.isVirtualProperty,
        visibleProperties.virtualImageVisibleProperty
      ],
      ( visible, representation, isVirtual, virtualImageVisible ) =>
        ( visible && representation.isObject && ( isVirtual ? virtualImageVisible : true ) )
    );

    const imageLabel = new LabelNode( '', imageLabelPositionProperty, modelViewTransformProperty, {
      visibleProperty: imageLabelVisibleProperty
    } );

    // Switch between 'Real Image' and 'Virtual Image'
    model.firstTarget.isVirtualProperty.link( isVirtual => {
      imageLabel.setText( isVirtual ? geometricOpticsStrings.virtualImage : geometricOpticsStrings.realImage );
    } );

    // ------------------------------------------------------------------------------------

    assert && assert( !options.children );
    options.children = [ leftFocalPointLabel, rightFocalPointLabel, opticLabel, objectLabel, imageLabel ];

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'LabelsNode', LabelsNode );
export default LabelsNode;