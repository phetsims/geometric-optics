// Copyright 2021, University of Colorado Boulder

/**
 * View of the optical element (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import RaysMode from '../model/RaysMode.js';
import Optic from '../model/Optic.js';

class OpticNode extends Node {

  /**
   * @param {Optic} optic
   * @param {Property.<RaysMode>} raysModeProperty
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( optic, raysModeProperty, modelBoundsProperty, modelViewTransform, options ) {

    assert && assert( optic instanceof Optic );
    assert && assert( raysModeProperty instanceof Property );
    assert && assert( modelBoundsProperty instanceof Property );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      cursor: 'ns-resize',
      fill: GeometricOpticsColors.opticFillProperty,
      stroke: GeometricOpticsColors.opticStrokeProperty,
      lineWidth: GeometricOpticsConstants.OPTICAL_ELEMENT_LINE_WIDTH
    }, options );

    super( options );

    // create a drag listener on the fill of the opticalElement (see #22)
    let clickOffset;
    const dragListener = new DragListener( {
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
    } );

    // Renders the shape of the optic
    const opticPath = new Path( modelViewTransform.modelToViewShape( optic.shapesProperty.value.fillShape ), {
      fill: options.fill
    } );

    // link the index of refraction to the opacity of the lens
    optic.indexOfRefractionProperty.link( index => {
      const normalizedIndex = optic.getNormalizedIndex( index );
      opticPath.opacity = normalizedIndex;
    } );

    // A separate Node for the optic's outline
    const opticOutlinePath = new Path( modelViewTransform.modelToViewShape( optic.shapesProperty.value.outlineShape ), {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    // create a vertical dashed line, through the optic - indicating the crossing plane of principal rays.
    const opticCenterLine = new Path(
      modelViewTransform.modelToViewShape( optic.getPrincipalLine() ), {
        stroke: GeometricOpticsColors.opticalAxisStrokeProperty,
        lineDash: GeometricOpticsConstants.AXIS_LINE_DASH
      } );

    /**
     * clip the center line based on model bounds
     * @param {Bounds2} modelBounds
     */
    const clipCenterLine = modelBounds => {
      opticCenterLine.clipArea = Shape.bounds( modelViewTransform.modelToViewBounds( modelBounds ) );
    };

    // update position of optic if the bounds change
    modelBoundsProperty.link( bounds => {

      // set drag bounds on the model position
      const dragBoundsOpticPosition = bounds.closestPointTo( optic.positionProperty.value );

      // constrained optic to merely move vertically
      optic.setVerticalCoordinate( dragBoundsOpticPosition.y );

      // clip the ends of the center line based on play area bounds
      clipCenterLine( bounds );
    } );

    // modify the shape of the optic
    optic.shapesProperty.link( shapes => {
      opticPath.shape = modelViewTransform.modelToViewShape( shapes.fillShape );
      opticOutlinePath.shape = modelViewTransform.modelToViewShape( shapes.outlineShape );
    } );

    // layer for the optic
    const opticLayer = new Node();

    // move the optic layer
    optic.positionProperty.link( position => {
      opticLayer.translation = modelViewTransform.modelToViewDelta( position );
    } );

    // add child and listener to the optic layer
    opticLayer.addInputListener( dragListener );
    opticLayer.addChild( opticPath );
    opticLayer.addChild( opticOutlinePath );

    // add the optic and center line to this node
    this.addChild( opticLayer );
    this.addChild( opticCenterLine );

    // Make opticCenterLine visible when Rays mode is Principal
    raysModeProperty.link( raysMode => {
      opticCenterLine.visible = ( raysMode === RaysMode.PRINCIPAL );
    } );
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