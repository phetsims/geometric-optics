// Copyright 2021, University of Colorado Boulder

/**
 * View of the optical element (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Optic from '../model/Optic.js';

class OpticNode extends Node {

  /**
   * @param {Optic} optic
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( optic, modelBoundsProperty, modelViewTransform, options ) {

    assert && assert( optic instanceof Optic );
    assert && assert( modelBoundsProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      cursor: 'ns-resize',
      fill: GeometricOpticsColors.opticFillProperty,
      stroke: GeometricOpticsColors.opticStrokeProperty,
      lineWidth: GeometricOpticsConstants.OPTICAL_ELEMENT_LINE_WIDTH
    }, options );

    // Renders the shape of the optic
    const opticPath = new Path( modelViewTransform.modelToViewShape( optic.shapesProperty.value.fillShape ), {
      fill: options.fill
    } );

    // A separate Node for the optic's outline
    const opticOutlinePath = new Path( modelViewTransform.modelToViewShape( optic.shapesProperty.value.outlineShape ), {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    // layer for the optic
    const opticLayer = new Node( {
      children: [ opticPath, opticOutlinePath ]
    } );

    assert && assert( !options.children );
    options.children = [ opticLayer ];

    super( options );

    // move the optic layer
    optic.positionProperty.link( position => {
      opticLayer.translation = modelViewTransform.modelToViewDelta( position );
    } );

    // Index of refraction determines opacity.
    optic.indexOfRefractionProperty.link( index => {
      opticPath.opacity = optic.getNormalizedIndex( index );
    } );

    // Shape of the optic will change when diameter or radius of curvature is changed.
    optic.shapesProperty.link( shapes => {
      opticPath.shape = modelViewTransform.modelToViewShape( shapes.fillShape );
      opticOutlinePath.shape = modelViewTransform.modelToViewShape( shapes.outlineShape );
    } );

    // Keep the optic inside the model bounds.
    modelBoundsProperty.link( bounds => {
      const closestPoint = bounds.closestPointTo( optic.positionProperty.value );
      optic.setVerticalCoordinate( closestPoint.y );
    } );

    // create a drag listener on the fill of the opticalElement (see #22)
    let clickOffset; //TODO this should not be necessary with a DragListener
    opticLayer.addInputListener( new DragListener( {
      pressCursor: options.cursor,
      start: event => {

        // click offset in model coordinate between the press drag and the center of the optic
        clickOffset = modelViewTransform.viewToModelPosition(
          this.globalToParentPoint( event.pointer.point ) ).minus( optic.positionProperty.value );
      },
      drag: event => {

        // position of the cursor in model coordinates
        const cursorModelPosition = modelViewTransform.viewToModelPosition(
          this.globalToParentPoint( event.pointer.point ) );

        // model position for the optic
        const unconstrainedModelPosition = cursorModelPosition.minus( clickOffset );

        // Constrain dragging such that an optic with maximum diameter is fully inside the model bounds.
        // See https://github.com/phetsims/geometric-optics/issues/204
        const dragBounds = modelBoundsProperty.value.erodedY( optic.maxDiameter / 2 );
        const constrainedModelPosition = dragBounds.closestPointTo( unconstrainedModelPosition );

        // constrained optic to merely move vertically
        optic.setVerticalCoordinate( constrainedModelPosition.y );
      }
    } ) );
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

geometricOptics.register( 'OpticNode', OpticNode );
export default OpticNode;