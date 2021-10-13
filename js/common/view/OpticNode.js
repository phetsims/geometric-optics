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
      opticPath.opacity = optic.getNormalizedIndex( index );
    } );

    // A separate Node for the optic's outline
    const opticOutlinePath = new Path( modelViewTransform.modelToViewShape( optic.shapesProperty.value.outlineShape ), {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    // update position of optic if the bounds change
    modelBoundsProperty.link( bounds => {

      // set drag bounds on the model position
      const dragBoundsOpticPosition = bounds.closestPointTo( optic.positionProperty.value );

      // constrained optic to merely move vertically
      optic.setVerticalCoordinate( dragBoundsOpticPosition.y );
    } );

    // modify the shape of the optic
    optic.shapesProperty.link( shapes => {
      opticPath.shape = modelViewTransform.modelToViewShape( shapes.fillShape );
      opticOutlinePath.shape = modelViewTransform.modelToViewShape( shapes.outlineShape );
    } );

    // layer for the optic
    const opticLayer = new Node();     //TODO get rid of this

    // move the optic layer
    optic.positionProperty.link( position => {
      opticLayer.translation = modelViewTransform.modelToViewDelta( position );
    } );

    opticLayer.addInputListener( dragListener );
    opticLayer.addChild( opticPath );
    opticLayer.addChild( opticOutlinePath );
    this.addChild( opticLayer );
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