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
const GUIDE_RECTANGLE_WIDTH = GeometricOpticsConstants.GUIDE_RECTANGLE_WIDTH;
const GUIDE_RECTANGLE_HEIGHT = GeometricOpticsConstants.GUIDE_RECTANGLE_HEIGHT;

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

    const viewRectangleWidth = modelViewTransform.modelToViewDeltaX( GUIDE_RECTANGLE_WIDTH );
    const viewRectangleHeight = -1 * modelViewTransform.modelToViewDeltaY( GUIDE_RECTANGLE_HEIGHT );

    // create fulcrum circle
    const fulcrumCircle = new Circle( GUIDE_FULCRUM_RADIUS, options );

    // create rectangle pointing to the object
    const incidentRectangle = new Rectangle( fulcrumCircle.x, fulcrumCircle.y - viewRectangleHeight / 2, viewRectangleWidth, viewRectangleHeight, options );
    const transmittedRectangle = new Rectangle( fulcrumCircle.x, fulcrumCircle.y - viewRectangleHeight / 2, viewRectangleWidth, viewRectangleHeight, options );

    /**
     * set the position of the rectangle such that its right end center is on the fulcrum point.
     * @param {Node} rectangleNode
     * @param {Vector2} viewFulcrumPosition
     * @param {number} angle
     */
    const setRectanglePosition = ( rectangleNode, viewFulcrumPosition, angle ) => {

      rectangleNode.center = Vector2.createPolar( -1 * viewRectangleWidth / 2, -angle ).plus( viewFulcrumPosition );
    };


    // update the position of the fulcrum
    guide.fulcrumPositionProperty.link( position => {
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( position );
      fulcrumCircle.center = viewFulcrumPosition;

      // position the rectangle
      setRectanglePosition( incidentRectangle, viewFulcrumPosition, guide.getIncidentAngle() );
      setRectanglePosition( transmittedRectangle, viewFulcrumPosition, guide.getTransmittedAngle() );
    } );

    /**
     * Set the angle and position of a rectangle around the fulcrum
     * @param {number} angle - current angle of rectangle
     * @param {number} oldAngle - previous angle of rectangle
     * @param {Rectangle} rectangle - incident or transmitted rectangle to be rotated and positioned
     */
    const setAnglePosition = ( angle, oldAngle, rectangle ) => {

      // for first angle
      if ( oldAngle === null ) {
        oldAngle = 0;
      }

      // rotate the rectangle
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( guide.getPosition() );
      rectangle.rotateAround( viewFulcrumPosition, -angle + oldAngle );

      // position of the rectangle
      setRectanglePosition( rectangle, viewFulcrumPosition, angle );
    };

    // update position and angle of incident rectangle
    guide.incidentAngleProperty.link( ( angle, oldAngle ) => {
      setAnglePosition( angle, oldAngle, incidentRectangle );
    } );

    // update position and angle of transmitted rectangle
    guide.transmittedAngleProperty.link( ( transmittedAngle, oldTransmittedAngle ) => {
      setAnglePosition( transmittedAngle, oldTransmittedAngle, transmittedRectangle );
    } );

    // add to scene graph
    this.addChild( incidentRectangle );
    this.addChild( transmittedRectangle );
    this.addChild( fulcrumCircle );
  }
}

geometricOptics.register( 'GuideNode', GuideNode );
export default GuideNode;
