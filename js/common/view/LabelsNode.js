// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for labels that appear below each element in the simulation when toggled.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import LabelNode from './LabelNode.js';

const objectString = geometricOpticsStrings.object;
const imageString = geometricOpticsStrings.image;
const convexString = geometricOpticsStrings.convex;
const concaveString = geometricOpticsStrings.concave;
const focalPointString = geometricOpticsStrings.focalPoint;
const lensString = geometricOpticsStrings.lens;
const mirrorString = geometricOpticsStrings.mirror;

class LabelsNode extends Node {
  /**
   *
   * @param {GeometricOpticsModel} model
   * @param {GeometricOpticsScreenView} view
   * @param {VisibleProperties} visibleProperties
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} zoomLevelProperty
   * @param {Object} [options]
   */
  constructor( model, view, visibleProperties, modelViewTransform, zoomLevelProperty, options ) {

    options = merge( {}, options );

    super( options );

    // create first focal point label
    const firstFocalPointLabel = new LabelNode( focalPointString,
      model.firstFocalPoint.positionProperty,
      visibleProperties.visibleFocalPointProperty,
      modelViewTransform );

    // create second focal point label
    const secondFocalPointLabel = new LabelNode( focalPointString,
      model.secondFocalPoint.positionProperty,
      visibleProperties.visibleFocalPointProperty,
      modelViewTransform );

    const opticLabelPositionProperty = new DerivedProperty( [ model.optic.positionProperty, model.optic.diameterProperty ], ( position, diameter ) =>
      position.minusXY( 0, diameter / 2 )
    );

    // create optic label with empty string
    const opticLabel = new LabelNode( '', opticLabelPositionProperty, new BooleanProperty( true ), modelViewTransform );

    // update the label string
    model.optic.curveProperty.link( curve => {

      // string associated with curve
      const curveString = model.optic.isConvex( curve ) ? convexString : concaveString;

      // string associated with type of optic
      const opticString = model.optic.isLens() ? lensString : mirrorString;

      // TODO: need to think about i18n
      const curveOpticString = curveString + ' ' + opticString;

      // update the text of label
      opticLabel.setText( curveOpticString );
    } );

    // create image label
    const imageLabel = new LabelNode( imageString, model.targetImage.positionProperty, new BooleanProperty( true ), modelViewTransform );


    // create object label
    const objectLabel = new LabelNode( objectString, model.sourceObject.positionProperty, new BooleanProperty( true ), modelViewTransform );

    // update the visibility of object and image labels.
    Property.multilink( [ model.representationProperty, model.targetImage.isVirtualProperty, visibleProperties.visibleVirtualImageProperty ],
      ( representation, isVirtual, showVirtual ) => {
        objectLabel.visible = representation.isObject;
        imageLabel.visible = representation.isObject && ( isVirtual ? showVirtual : true );
      } );


    // add the labels to this node
    this.addChild( objectLabel );
    this.addChild( imageLabel );
    this.addChild( opticLabel );
    this.addChild( firstFocalPointLabel );
    this.addChild( secondFocalPointLabel );

    // update the visibility of the labels
    visibleProperties.visibleLabelsProperty.linkAttribute( this, 'visible' );
  }
}

geometricOptics.register( 'LabelsNode', LabelsNode );

export default LabelsNode;