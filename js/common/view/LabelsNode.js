// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for labels that appear below each element in the simulation when toggled.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import LabelNode from './LabelNode.js';

const objectString = geometricOpticsStrings.object;
const imageString = geometricOpticsStrings.image;
const virtualImageString = geometricOpticsStrings.virtualImage;
const focalPointString = geometricOpticsStrings.focalPoint;
const convexLensString = geometricOpticsStrings.convexLens;
const concaveLensString = geometricOpticsStrings.concaveLens;
const convexMirrorString = geometricOpticsStrings.convexMirror;
const concaveMirrorString = geometricOpticsStrings.concaveMirror;

class LabelsNode extends Node {

  /**
   * @param {GeometricOpticsModel} model
   * @param {GeometricOpticsScreenView} view
   * @param {VisibleProperties} visibleProperties
   * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
   * @param {Property.<boolean>} zoomLevelProperty
   * @param {Object} [options]
   */
  constructor( model, view, visibleProperties, modelViewTransformProperty, zoomLevelProperty, options ) {

    super( options );

    // create first focal point label
    const firstFocalPointLabel = new LabelNode( focalPointString,
      model.firstFocalPoint.positionProperty,
      visibleProperties.focalPointVisibleProperty,
      modelViewTransformProperty );

    // create second focal point label
    const secondFocalPointLabel = new LabelNode( focalPointString,
      model.secondFocalPoint.positionProperty,
      visibleProperties.focalPointVisibleProperty,
      modelViewTransformProperty );

    // define optic label position
    const opticLabelPositionProperty = new DerivedProperty(
      [ model.optic.positionProperty, model.optic.diameterProperty ],
      ( position, diameter ) =>
        position.minusXY( 0, diameter / 2 )
    );

    // create optic label with empty string
    const opticLabel = new LabelNode( '',
      opticLabelPositionProperty,
      new BooleanProperty( true ),
      modelViewTransformProperty );

    // update the label string of the optic
    model.optic.curveProperty.link( curve => {

      let curveOpticString;

      // string associated with optic and curve
      if ( model.optic.isConvex( curve ) ) {
        curveOpticString = model.optic.isLens() ? convexLensString : convexMirrorString;
      }
      else if ( model.optic.isConcave( curve ) ) {
        curveOpticString = model.optic.isLens() ? concaveLensString : concaveMirrorString;
      }

      // update the text of label for optic
      opticLabel.setText( curveOpticString );
    } );

    // define image label position
    const imageLabelPositionProperty = new DerivedProperty(
      [ model.firstTarget.boundsProperty ],
      bounds => bounds.centerTop
    );

    // find appropriate string for image label
    const imageLabelString = model.firstTarget.isVirtual() ? virtualImageString : imageString;

    // create image label
    const imageLabel = new LabelNode( imageLabelString,
      imageLabelPositionProperty,
      new BooleanProperty( true ),
      modelViewTransformProperty );

    // define object label position
    const objectLabelPositionProperty = new DerivedProperty( [ model.sourceObject.boundsProperty ],

      // because the we use a Y inverted reference frame, the bottom of the image is the top of the model bounds.
      bounds => bounds.centerTop );

    // create object label
    const objectLabel = new LabelNode( objectString,
      objectLabelPositionProperty,
      new BooleanProperty( true ),
      modelViewTransformProperty );

    // update the visibility of the object and image labels
    Property.multilink( [
        model.representationProperty,
        model.firstTarget.enabledProperty,
        model.firstTarget.isVirtualProperty,
        visibleProperties.virtualImageVisibleProperty
      ],
      ( representation, isEnabled, isVirtual, virtualImageVisible ) => {

        // label is visible if the representation is an object
        objectLabel.visible = representation.isObject;

        // label is visible if (1) the image is enabled, (2) the representation is an object
        // (3) if the image is virtual and the checkbox is virtual is on  (but on if real)
        imageLabel.visible = isEnabled && ( isVirtual ? virtualImageVisible : true ) && representation.isObject;

        // update the text of the image appropriately
        imageLabel.setText( isVirtual ? virtualImageString : imageString );
      } );

    // add the labels to this node
    this.addChild( firstFocalPointLabel );
    this.addChild( secondFocalPointLabel );
    this.addChild( opticLabel );
    this.addChild( objectLabel );
    this.addChild( imageLabel );

    // update the visibility of the labels
    visibleProperties.labelsVisibleProperty.linkAttribute( this, 'visible' );
  }
}

geometricOptics.register( 'LabelsNode', LabelsNode );
export default LabelsNode;