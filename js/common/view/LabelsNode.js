// Copyright 2021, University of Colorado Boulder

/**
 * Scenery node for labels that appear below each element in the simulation when toggled.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import geometricOptics from '../../geometricOptics.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
// import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

// const objectString = geometricOpticsStrings.object;
// const imageString = geometricOpticsStrings.image;
// const convexString = geometricOpticsStrings.convex;
// const concaveString = geometricOpticsStrings.concave;
const focalPointString = geometricOpticsStrings.focalPoint;
// const lensString = geometricOpticsStrings.lens;
// const mirrorString = geometricOpticsStrings.mirror;
//
// const ZOOM_SCALE_FACTOR = GeometricOpticsConstants.ZOOM_SCALE_FACTOR;

class LabelsNode extends Node {
  /**
   *
   * @param {GeometricOpticsModel} model
   * @param {Property.<boolean>} visibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} zoomLevelProperty
   * @param {Object} [options]
   */
  constructor( model, visibleProperty, modelViewTransform, zoomLevelProperty, options ) {
    options = merge( {
      text: { fill: 'white' },
      xMargin: 50,
      yMargin: 10
    }, options );

    super( options );

    const focalPointLabel = new Text( focalPointString, options.text );
    const backgroundRectangle = new Rectangle( 0, 0, 1, 1, {
      fill: 'grey',
      opacity: 0.5,
      cornerRadius: 10
    } );

    model.firstFocalPoint.positionProperty.link( position => {
      focalPointLabel.centerTop = modelViewTransform.modelToViewPosition( position ).plusXY( 0, 10 );
      backgroundRectangle.setRectWidth( focalPointLabel.width + options.xMargin * 2 );
      backgroundRectangle.setRectHeight( focalPointLabel.height + options.yMargin * 2 );
      backgroundRectangle.center = focalPointLabel.center;
    } );

    zoomLevelProperty.link( ( zoomLevel, oldZoomLevel ) => {
      if ( oldZoomLevel ) {

        focalPointLabel.centerTop = modelViewTransform.modelToViewPosition( model.firstFocalPoint.positionProperty.value )
          .plusXY( 0, 10 );

        backgroundRectangle.setRectWidth( focalPointLabel.width + options.xMargin * 2 );
        backgroundRectangle.setRectHeight( focalPointLabel.height + options.yMargin * 2 );
        backgroundRectangle.center = focalPointLabel.center;
      }
    } );

    this.addChild( backgroundRectangle );

    this.addChild( focalPointLabel );

  }
}

geometricOptics.register( 'LabelsNode', LabelsNode );

export default LabelsNode;