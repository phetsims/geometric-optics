// Copyright 2021, University of Colorado Boulder

/**
 * View element for the guides at both ends of the lens
 *
 * @author Sarah Chang, Swarthmore College
 */
import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import geometricOptics from '../../geometricOptics.js';

class GuideNode extends Node {

  /**
   *
   * @param {Guide} guide
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( guide, modelViewTransform, options ) {

    options = merge( {
      fill: 'white'
    }, options );

    super();
    const fulcrumCircle = new Circle( 10, { fill: 'white' } );
    this.addChild( fulcrumCircle );
    guide.fulcrumPositionProperty.link( position => {
      fulcrumCircle.center = modelViewTransform.modelToViewPosition( position );
    } );
  }
}

geometricOptics.register( 'GuideNode', GuideNode );
export default GuideNode;
