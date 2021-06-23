// Copyright 2021, University of Colorado Boulder

/**
 * View of the optical element (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

class OpticNode extends Node {

  /**
   * @param {Optic} optic
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( optic, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( options );

    // create a drag listener on the fill of the opticalElement (see #22)
    let clickOffset;
    const dragListener = new DragListener( {
      start: event => {

        // click offset in model coordinate between the press drag and the center of the optic
        clickOffset = modelViewTransform.viewToModelPosition(
          this.globalToParentPoint( event.pointer.point ) ).minus( optic.positionProperty.value );
      },
      drag: event => {

        // position of the cursor in model coordinates
        const cursorModelPosition = modelViewTransform.viewToModelPosition(
          this.globalToParentPoint( event.pointer.point ) );

        const unconstrainedModelPosition = cursorModelPosition.minus( clickOffset );

        // constrained optic to merely move vertically
        optic.setVerticalCoordinate( unconstrainedModelPosition.y );
      }
    } );

    // create the path of the optic
    // @protected {Path}
    this.fillPath = new Path( modelViewTransform.modelToViewShape( optic.outlineAndFillProperty.value.fillShape ), {
      fill: options.fill
    } );

    // create the outline path of the optic {Path}
    const outlinePath = new Path( modelViewTransform.modelToViewShape( optic.outlineAndFillProperty.value.outlineShape ), {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    optic.outlineAndFillProperty.link( shapes => {
      this.fillPath.shape = modelViewTransform.modelToViewShape( shapes.fillShape );
      outlinePath.shape = modelViewTransform.modelToViewShape( shapes.outlineShape );
    } );

    optic.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewDelta( position );
    } );

    this.addInputListener( dragListener );
    this.addChild( this.fillPath );
    this.addChild( outlinePath );

  }
}

geometricOptics.register( 'OpticNode', OpticNode );
export default OpticNode;
