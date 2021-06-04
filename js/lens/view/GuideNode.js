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
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';

const GUIDE_FULCRUM_RADIUS = GeometricOpticsConstants.GUIDE_FULCRUM_RADIUS;

class GuideNode extends Node {

  /**
   *
   * @param {Guide} guide
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( guide, modelViewTransform, options ) {

    options = merge( {
      fill: 'white',
      stroke: 'black'
    }, options );

    super();
    const fulcrumCircle = new Circle( GUIDE_FULCRUM_RADIUS, options );
    const leftGuideRectangle = new Rectangle( fulcrumCircle.x, fulcrumCircle.y - viewGuideHeight / 2, viewGuideWidth, viewGuideHeight, options );

    guide.fulcrumPositionProperty.link( position => {
      const viewPosition = modelViewTransform.modelToViewPosition( position );
      fulcrumCircle.center = viewPosition;


      leftGuideRectangle.center = viewPosition.plusXY( -viewGuideWidth / 2 * Math.cos( guide.rotationAngleProperty.value ),
        viewGuideWidth / 2 * Math.sin( guide.rotationAngleProperty.value ) );
    } );

    guide.rotationAngleProperty.link( ( angle, oldAngle ) => {
      if ( oldAngle === null ) {
        oldAngle = 0;
      }
      const fulcrumPosition = modelViewTransform.modelToViewPosition( guide.fulcrumPositionProperty.value );
      leftGuideRectangle.rotateAround( fulcrumPosition, -angle + oldAngle );

      // position of the rectangle guide
      leftGuideRectangle.center = fulcrumPosition.plusXY( -viewGuideWidth / 2 * Math.cos( angle ),
        viewGuideWidth / 2 * Math.sin( angle ) );
    } );


    this.addChild( leftGuideRectangle );
    this.addChild( fulcrumCircle );
  }
}

geometricOptics.register( 'GuideNode', GuideNode );
export default GuideNode;
