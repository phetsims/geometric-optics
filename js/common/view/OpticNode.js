// Copyright 2021, University of Colorado Boulder

/**
 * OpticNode displays the optic, a lens or mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
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
      lineWidth: 2
    }, options );

    // Separate Nodes for fill and stroke, because we'll be changing opticFillNode opacity to match index of refraction.
    // Shapes will be properly initialized by optic.shapesProperty listener below.
    const opticFillNode = new Path( null, {
      fill: options.fill
    } );
    const opticStrokeNode = new Path( null, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    assert && assert( !options.children );
    options.children = [ opticFillNode, opticStrokeNode ];

    super( options );

    // Move to the optic's position.
    //TODO DragListener should handle this via options positionProperty and modelViewTransform
    optic.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewDelta( position ); //TODO why not modelToViewPosition?
    } );

    // Index of refraction determines opacity.
    optic.indexOfRefractionProperty.link( index => {
      opticFillNode.opacity = optic.getNormalizedIndex( index );
    } );

    // Shape of the optic will change when diameter or radius of curvature is changed.
    optic.shapesProperty.link( shapes => {
      opticFillNode.shape = modelViewTransform.modelToViewShape( shapes.fillShape );
      opticStrokeNode.shape = modelViewTransform.modelToViewShape( shapes.outlineShape );
    } );

    // Keep the optic inside the model bounds.
    //TODO DragListener should handle this via option dragBoundsProperty
    modelBoundsProperty.link( bounds => {
      optic.yProperty.value = bounds.closestPointTo( optic.positionProperty.value ).y;
    } );

    let clickOffset; //TODO DragListener should handle this
    this.addInputListener( new DragListener( {
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
        //TODO DragListener should handle this via option dragBoundsProperty
        const dragBounds = modelBoundsProperty.value.erodedY( optic.maxDiameter / 2 );
        const constrainedModelPosition = dragBounds.closestPointTo( unconstrainedModelPosition );

        // constrained to move vertically
        optic.yProperty.value = constrainedModelPosition.y;
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