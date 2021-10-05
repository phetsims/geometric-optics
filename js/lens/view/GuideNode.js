// Copyright 2021, University of Colorado Boulder

/**
 * GuideNode is the view element for the guides at both ends of the lens. A guide consists of a fulcrum, to which
 * are attached 2 arms.  One arm corresponds to the incident angle, while the other corresponds to the transmitted
 * angle.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import GeometricOpticsColors from '../../common/GeometricOpticsColors.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from '../model/Guide.js';

const RECTANGLE_OPTIONS = {
  fill: GeometricOpticsColors.guideArmFillProperty,
  stroke: GeometricOpticsColors.guideStrokeProperty
};
const CIRCLE_OPTIONS = {
  fill: GeometricOpticsColors.guideFulcrumFillProperty,
  stroke: GeometricOpticsColors.guideStrokeProperty
};

class GuideNode extends Node {

  /**
   * @param {Guide} guide
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( guide, modelViewTransform, options ) {

    assert && assert( guide instanceof Guide );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {
      rectangle: RECTANGLE_OPTIONS,
      circle: CIRCLE_OPTIONS
    }, options );

    // width and height of the guide rectangles
    const viewRectangleWidth = modelViewTransform.modelToViewDeltaX( GeometricOpticsConstants.GUIDE_RECTANGLE_WIDTH );
    const viewRectangleHeight = Math.abs( modelViewTransform.modelToViewDeltaY( GeometricOpticsConstants.GUIDE_RECTANGLE_HEIGHT ) );

    const fulcrumNode = new Circle( GeometricOpticsConstants.GUIDE_FULCRUM_RADIUS, options.circle );

    // create two rectangles, with left center side laying on fulcrum (initially)
    const incidentArmNode = new Rectangle( fulcrumNode.x, fulcrumNode.y - viewRectangleHeight / 2, viewRectangleWidth, viewRectangleHeight, options.rectangle );
    const transmittedArmNode = new Rectangle( fulcrumNode.x, fulcrumNode.y - viewRectangleHeight / 2, viewRectangleWidth, viewRectangleHeight, options.rectangle );

    /**
     * set the position of the rectangle such that its left center is on the fulcrum point.
     * @param {Node} rectangleNode
     * @param {Vector2} viewFulcrumPosition
     * @param {number} angle - "model" angle of the rectangle, measured from the positive x -axis
     */
    const setRectanglePosition = ( rectangleNode, viewFulcrumPosition, angle ) => {
      assert && assert( rectangleNode instanceof Node );
      assert && assert( viewFulcrumPosition instanceof Vector2 );
      assert && assert( typeof angle === 'number' && isFinite( angle ) );

      // y-inverted modelViewTransform
      const viewAngle = -angle;

      // center of the rectangle is offset from the fulcrum point
      rectangleNode.center = Vector2.createPolar( viewRectangleWidth / 2, viewAngle ).plus( viewFulcrumPosition );
    };

    // update the position of the fulcrum
    guide.fulcrumPositionProperty.link( position => {
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( position );
      fulcrumNode.center = viewFulcrumPosition;

      // position the rectangles
      setRectanglePosition( incidentArmNode, viewFulcrumPosition, guide.getIncidentAngle() );
      setRectanglePosition( transmittedArmNode, viewFulcrumPosition, guide.getTransmittedAngle() );
    } );

    /**
     * Set the angle and position of a rectangle around the fulcrum
     * @param {number} angle - current "model" angle
     * @param {number|null} oldAngle - previous "model" angle
     * @param {Rectangle} rectangle - incident or transmitted rectangle to be rotated and positioned
     */
    const setAnglePosition = ( angle, oldAngle, rectangle ) => {
      assert && assert( typeof angle === 'number' && isFinite( angle ) );
      assert && assert( oldAngle === null || ( typeof oldAngle === 'number' && isFinite( oldAngle ) ) );
      assert && assert( rectangle instanceof Rectangle );

      // for first angle
      if ( oldAngle === null ) {
        oldAngle = 0;
      }

      // rotate the rectangle
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( guide.fulcrumPositionProperty.value );

      // the model view transform is Y-inverted
      // therefore a counterclockwise rotation in the model is clockwise is the view
      rectangle.rotateAround( viewFulcrumPosition, -angle + oldAngle );

      // position of the rectangle
      setRectanglePosition( rectangle, viewFulcrumPosition, angle );
    };

    // update position and angle of incident rectangle
    guide.incidentAngleProperty.link( ( angle, oldAngle ) => {
      setAnglePosition( angle, oldAngle, incidentArmNode );
    } );

    // update position and angle of transmitted rectangle
    guide.transmittedAngleProperty.link( ( transmittedAngle, oldTransmittedAngle ) => {
      setAnglePosition( transmittedAngle, oldTransmittedAngle, transmittedArmNode );
    } );

    assert && assert( !options.children );
    options.children = [ incidentArmNode, transmittedArmNode, fulcrumNode ];

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Creates an icon for guides, to be used with checkbox. This is intended to be a caricature of the actual guides.
   * @returns {Node}
   * @public
   */
  static createIcon() {

    const fulcrumRadius = 5;
    const fulcrumNode = new Circle( fulcrumRadius, CIRCLE_OPTIONS );
    const armWidth = 50;
    const armHeight = 0.5 * fulcrumNode.height;
    const leftArmNode = new Rectangle( 0, 0, armWidth, armHeight, RECTANGLE_OPTIONS );
    const rightArmNode = new Rectangle( 0, 0, armWidth, armHeight, RECTANGLE_OPTIONS );

    leftArmNode.rotation = -Math.PI / 15;
    rightArmNode.rotation = Math.PI / 15;
    rightArmNode.left = leftArmNode.right;
    rightArmNode.top = leftArmNode.top;
    fulcrumNode.centerX = leftArmNode.right;
    fulcrumNode.centerY = leftArmNode.top + 3;

    return new Node( {
      scale: 0.4,
      children: [ leftArmNode, rightArmNode, fulcrumNode ]
    } );
  }
}

geometricOptics.register( 'GuideNode', GuideNode );
export default GuideNode;
