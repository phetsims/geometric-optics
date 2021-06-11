// Copyright 2021, University of Colorado Boulder

/**
 * View of the optical element (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import Vector2Property from '../../../../dot/js/Vector2Property.js';
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

    // position (in model coordinate) for the drag listener.
    const positionProperty = new Vector2Property( optic.positionProperty.value );

    // create a drag listener on the fill of the opticalElement
    const dragListener = new DragListener( {
      positionProperty: positionProperty,
      transform: modelViewTransform,
      applyOffset: false
    } );

    positionProperty.link( position => {
      optic.setVerticalCoordinate( position.y );
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
