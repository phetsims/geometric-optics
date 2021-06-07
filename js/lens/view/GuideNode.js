// Copyright 2021, University of Colorado Boulder

/**
 * View element for the guides at both ends of the lens
 *
 * @author Sarah Chang, Swarthmore College
 */
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import geometricOptics from '../../geometricOptics.js';

const GUIDE_FULCRUM_RADIUS = GeometricOpticsConstants.GUIDE_FULCRUM_RADIUS;
const GUIDE_WIDTH = GeometricOpticsConstants.GUIDE_WIDTH;
const GUIDE_HEIGHT = GeometricOpticsConstants.GUIDE_HEIGHT;

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

    const viewGuideWidth = modelViewTransform.modelToViewDeltaX( GUIDE_WIDTH );
    const viewGuideHeight = -1 * modelViewTransform.modelToViewDeltaY( GUIDE_HEIGHT );

    // create fulcrum circle
    const fulcrumCircle = new Circle( GUIDE_FULCRUM_RADIUS, options );

    // create guide rectangle pointing to the object
    const incomingRectangle = new Rectangle( fulcrumCircle.x, fulcrumCircle.y - viewGuideHeight / 2, viewGuideWidth, viewGuideHeight, options );
    const outgoingRectangle = new Rectangle( fulcrumCircle.x, fulcrumCircle.y - viewGuideHeight / 2, viewGuideWidth, viewGuideHeight, options );

    /**
     * set the position of the guide rectangle such that its right end center is on the fulcrum point.
     * @param {Node} rectangleNode
     * @param {Vector2} viewFulcrumPosition
     * @param {number} angle
     * @param {boolean} isOutgoing
     */
    const setRectanglePosition = ( rectangleNode, viewFulcrumPosition, angle, isOutgoing ) => {
      const sign = isOutgoing ? -1 : 1;
      rectangleNode.center = Vector2.createPolar( -1 * sign * viewGuideWidth / 2, -angle ).plus( viewFulcrumPosition );
    };


    // update the position of the fulcrum
    guide.fulcrumPositionProperty.link( position => {
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( position );
      fulcrumCircle.center = viewFulcrumPosition;

      // position the rectangle
      setRectanglePosition( incomingRectangle, viewFulcrumPosition, guide.getRotationAngle(), false );
      setRectanglePosition( outgoingRectangle, viewFulcrumPosition,
        guide.getRotationAngle() - guide.getInternalAngle(), true );
    } );

    // rotate the guide
    guide.rotationAngleProperty.link( ( angle, oldAngle ) => {

      // for first angle
      if ( oldAngle === null ) {
        oldAngle = 0;
      }

      // rotate the guide
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( guide.fulcrumPositionProperty.value );
      incomingRectangle.rotateAround( viewFulcrumPosition, -angle + oldAngle );
      outgoingRectangle.rotateAround( viewFulcrumPosition, -angle + oldAngle );

      // position of the rectangle guide
      setRectanglePosition( incomingRectangle, viewFulcrumPosition, angle, false );
      setRectanglePosition( outgoingRectangle, viewFulcrumPosition, angle - guide.getInternalAngle(), true );
    } );

    guide.internalAngleProperty.link( ( internalAngle, oldInternalAngle ) => {
      // for first angle
      if ( oldInternalAngle === null ) {
        oldInternalAngle = 0;
      }
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( guide.getPosition() );
      outgoingRectangle.rotateAround( viewFulcrumPosition, internalAngle - oldInternalAngle );

      // position the rectangle
      setRectanglePosition( outgoingRectangle, viewFulcrumPosition,
        guide.getRotationAngle() - internalAngle, true );

    } );

    // add to scene graph
    this.addChild( incomingRectangle );
    this.addChild( outgoingRectangle );
    this.addChild( fulcrumCircle );
  }
}

geometricOptics.register( 'GuideNode', GuideNode );
export default GuideNode;
