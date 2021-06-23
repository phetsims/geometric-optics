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
const focalPointString = geometricOpticsStrings.focalPoint;
const convexLensString = geometricOpticsStrings.convexLens;
const concaveLensString = geometricOpticsStrings.concaveLens;
const convexMirrorString = geometricOpticsStrings.convexMirror;
const concaveMirrorString = geometricOpticsStrings.concaveMirror;

class LabelsNode extends Node {
  /**
   *
   * @param {GeometricOpticsModel} model
   * @param {GeometricOpticsScreenView} view
   * @param {VisibleProperties} visibleProperties
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Property.<boolean>} zoomLevelProperty
   * @param {Object} [options]
   */
  constructor( model, view, visibleProperties, modelViewTransformProperty, zoomLevelProperty, options ) {

    options = merge( {}, options );

    super( options );

    // create first focal point label
    const firstFocalPointLabel = new LabelNode( focalPointString,
      model.firstFocalPoint.positionProperty,
      visibleProperties.visibleFocalPointProperty,
      modelViewTransformProperty );

    // create second focal point label
    const secondFocalPointLabel = new LabelNode( focalPointString,
      model.secondFocalPoint.positionProperty,
      visibleProperties.visibleFocalPointProperty,
      modelViewTransformProperty );

    const opticLabelPositionProperty = new DerivedProperty( [ model.optic.positionProperty, model.optic.diameterProperty ], ( position, diameter ) =>
      position.minusXY( 0, diameter / 2 )
    );

    // create optic label with empty string
    const opticLabel = new LabelNode( '', opticLabelPositionProperty, new BooleanProperty( true ), modelViewTransformProperty );

    // update the label string
    model.optic.curveProperty.link( curve => {

      let curveOpticString;

      // string associated with optic
      if ( model.optic.isConvex( curve ) ) {
        if ( model.optic.isLens() ) {
          curveOpticString = convexLensString;
        }
        else if ( model.optic.isMirror() ) {
          curveOpticString = convexMirrorString;
        }
      }
      else if ( model.optic.isConcave( curve ) ) {
        if ( model.optic.isLens() ) {
          curveOpticString = concaveLensString;
        }
        else if ( model.optic.isMirror() ) {
          curveOpticString = concaveMirrorString;
        }
      }

      // update the text of label
      opticLabel.setText( curveOpticString );
    } );

    // create image label
    const imageLabel = new LabelNode( imageString, model.targetImage.positionProperty, new BooleanProperty( true ), modelViewTransformProperty );


    // create object label
    const objectLabel = new LabelNode( objectString, model.sourceObject.positionProperty, new BooleanProperty( true ), modelViewTransformProperty );

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