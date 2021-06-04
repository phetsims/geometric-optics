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
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Vector2 from '../../../../dot/js/Vector2.js';

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
    const viewGuideHeight = modelViewTransform.modelToViewDeltaX( GUIDE_HEIGHT );

    // create fulcrum circle
    const fulcrumCircle = new Circle( GUIDE_FULCRUM_RADIUS, options );

    // create guide rectangle poiting to the object
    const leftGuideRectangle = new Rectangle( fulcrumCircle.x, fulcrumCircle.y - viewGuideHeight / 2, viewGuideWidth, viewGuideHeight, options );

    /**
     * set the position of the guide rectangle such that its right end center is on the fulcrum point.
     * @param {Vector2} viewFulcrumPosition
     * @param {number} angle
     */
    const setGuideRectanglePosition = ( viewFulcrumPosition, angle ) => {
      leftGuideRectangle.center = Vector2.createPolar( -viewGuideWidth / 2, -angle ).plus( viewFulcrumPosition );
    };

    // update the position of the fulcrum
    guide.fulcrumPositionProperty.link( position => {
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( position );
      fulcrumCircle.center = viewFulcrumPosition;

      // position the rectangle
      setGuideRectanglePosition( viewFulcrumPosition, guide.rotationAngleProperty.value );
    } );

    // rotate the guide
    guide.rotationAngleProperty.link( ( angle, oldAngle ) => {

      // for first angle
      if ( oldAngle === null ) {
        oldAngle = 0;
      }

      // rotate the guide
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( guide.fulcrumPositionProperty.value );
      leftGuideRectangle.rotateAround( viewFulcrumPosition, -angle + oldAngle );

      // position of the rectangle guide
      setGuideRectanglePosition( viewFulcrumPosition, angle );
    } );

    // add to scene graph
    this.addChild( leftGuideRectangle );
    this.addChild( fulcrumCircle );
  }
}

geometricOptics.register( 'GuideNode', GuideNode );
export default GuideNode;
