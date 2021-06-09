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
   * @param {Property.<boolean>} visibleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( guide, visibleProperty, modelViewTransform, options ) {

    options = merge( {
      rectangle: {
        fill: 'white',
        stroke: 'black'
      },
      circle: {
        fill: 'grey',
        stroke: 'black'
      }
    }, options );

    super();

    // width and height of the guide rectangles
    const viewRectangleWidth = modelViewTransform.modelToViewDeltaX( GUIDE_RECTANGLE_WIDTH );
    const viewRectangleHeight = Math.abs( modelViewTransform.modelToViewDeltaY( GUIDE_RECTANGLE_HEIGHT ) );

    // create fulcrum circle
    const fulcrumCircle = new Circle( GUIDE_FULCRUM_RADIUS, options.circle );

    // create two rectangles, with left center side laying on fulcrum circle (initially)
    const incidentRectangle = new Rectangle( fulcrumCircle.x, fulcrumCircle.y - viewRectangleHeight / 2, viewRectangleWidth, viewRectangleHeight, options.rectangle );
    const transmittedRectangle = new Rectangle( fulcrumCircle.x, fulcrumCircle.y - viewRectangleHeight / 2, viewRectangleWidth, viewRectangleHeight, options.rectangle );

    /**
     * set the position of the rectangle such that its left center is on the fulcrum point.
     * @param {Node} rectangleNode
     * @param {Vector2} viewFulcrumPosition
     * @param {number} angle - "model" angle of the rectangle, measured from the positive x -axis
     */
    const setRectanglePosition = ( rectangleNode, viewFulcrumPosition, angle ) => {

      // y-inverted modelViewTransform
      const viewAngle = -angle;

      // center of the rectangle is offset from the fulcrum point
      rectangleNode.center = Vector2.createPolar( viewRectangleWidth / 2, viewAngle ).plus( viewFulcrumPosition );
    };

    // update the position of the fulcrum
    guide.fulcrumPositionProperty.link( position => {
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( position );
      fulcrumCircle.center = viewFulcrumPosition;

      // position the rectangles
      setRectanglePosition( incidentRectangle, viewFulcrumPosition, guide.getIncidentAngle() );
      setRectanglePosition( transmittedRectangle, viewFulcrumPosition, guide.getTransmittedAngle() );
    } );

    /**
     * Set the angle and position of a rectangle around the fulcrum
     * @param {number} angle - current "model" angle
     * @param {number} oldAngle - previous "model" angle
     * @param {Rectangle} rectangle - incident or transmitted rectangle to be rotated and positioned
     */
    const setAnglePosition = ( angle, oldAngle, rectangle ) => {

      // for first angle
      if ( oldAngle === null ) {
        oldAngle = 0;
      }

      // rotate the rectangle
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( guide.getPosition() );

      // the model view transform is Y-inverted
      // therefore a counterclockwise rotation in the model is clockwise is the view
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

    // update guides visibility based on checkbox
    visibleProperty.linkAttribute( this, 'visible' );

  }
}

geometricOptics.register( 'GuideNode', GuideNode );
export default GuideNode;
