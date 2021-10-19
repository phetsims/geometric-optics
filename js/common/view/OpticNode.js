// Copyright 2021, University of Colorado Boulder

/**
 * OpticNode displays the optic, a lens or mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
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

    // Shape of the optic will change when curve type, radius of curvature, or diameter is changed.
    optic.shapesProperty.link( shapes => {

      // The position of this Node should be based on optic.positionProperty, so we do not want to translate these
      // Shapes. Create our own matrix based on modelViewTransform, but with no effective translation.
      const matrix = modelViewTransform.getMatrix().copy();
      const translation = matrix.getTranslation();
      matrix.prependTranslation( -translation.x, -translation.y );

      // Create the shapes in view coordinates.
      opticFillNode.shape = shapes.fillShape.transformed( matrix );
      opticStrokeNode.shape = shapes.outlineShape.transformed( matrix );
    } );

    // Index of refraction determines opacity.
    optic.indexOfRefractionProperty.link( indexOfRefraction => {
      opticFillNode.opacity = optic.getNormalizedIndexOfRefraction( indexOfRefraction );
    } );

    // Dragging is constrained to vertical, so create an adapter Property that can be used by DragListener.
    const positionProperty = new Vector2Property( optic.positionProperty.value );
    positionProperty.link( position => {
      optic.yProperty.value = position.y;
    } );
    optic.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // Constrain dragging such that an optic with maximum diameter is fully inside the model bounds.
    // See https://github.com/phetsims/geometric-optics/issues/204
    const dragBoundsProperty = new DerivedProperty( [ modelBoundsProperty, optic.diameterProperty ],
      ( modelBounds, diameter ) => modelBounds.erodedY( diameter / 2 )
    );

    // When the dragBounds changes, move the optic inside the drag bounds.
    dragBoundsProperty.link( dragBounds => {
      optic.yProperty.value = dragBounds.closestPointTo( optic.positionProperty.value ).y;
    } );

    this.addInputListener( new DragListener( {
      pressCursor: options.cursor,
      positionProperty: positionProperty,
      transform: modelViewTransform,
      dragBoundsProperty: dragBoundsProperty
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