// Copyright 2021, University of Colorado Boulder

/**
 * GuideNode displays a guide, which consists of a fulcrum, to which are attached 2 arms.  One arm corresponds to the
 * incident angle, while the other corresponds to the transmitted angle. An optic has a pair of guides, positioned at
 * the top and bottom of the optic - see GuidesNode.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Node, Rectangle } from '../../../../scenery/js/imports.js';
import GOColors from '../../common/GOColors.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from '../model/Guide.js';

// constants, in view coordinates
const GUIDE_FULCRUM_RADIUS = 5;
const GUIDE_RECTANGLE_WIDTH = 96;
const GUIDE_RECTANGLE_HEIGHT = 6;
const FULCRUM_OPTIONS = {
  fill: GOColors.guideFulcrumFillProperty,
  stroke: GOColors.guideStrokeProperty
};
const ARM_STROKE = GOColors.guideStrokeProperty;

class GuideNode extends Node {

  private readonly guide: Guide;
  private readonly modelViewTransform: ModelViewTransform2;

  /**
   * @param guide
   * @param armColor
   * @param modelViewTransform
   */
  constructor( guide: Guide, armColor: ColorDef, modelViewTransform: ModelViewTransform2 ) {

    const fulcrumNode = new Circle( GUIDE_FULCRUM_RADIUS, FULCRUM_OPTIONS );

    // The arms are two rectangles, with left center side laying on fulcrum initially.
    const armOptions = {
      stroke: ARM_STROKE,
      fill: armColor
    };
    const incidentArmNode = new Rectangle( fulcrumNode.x, fulcrumNode.y - GUIDE_RECTANGLE_HEIGHT / 2,
      GUIDE_RECTANGLE_WIDTH, GUIDE_RECTANGLE_HEIGHT, armOptions );
    const transmittedArmNode = new Rectangle( fulcrumNode.x, fulcrumNode.y - GUIDE_RECTANGLE_HEIGHT / 2,
      GUIDE_RECTANGLE_WIDTH, GUIDE_RECTANGLE_HEIGHT, armOptions );

    super( {
      children: [ incidentArmNode, transmittedArmNode, fulcrumNode ]
    } );

    this.guide = guide;
    this.modelViewTransform = modelViewTransform;

    guide.fulcrumPositionProperty.link( fulcrumPosition => {

      // fulcrum position
      const viewFulcrumPosition = modelViewTransform.modelToViewPosition( fulcrumPosition );
      fulcrumNode.center = viewFulcrumPosition;

      // position the arms
      setArmPosition( incidentArmNode, viewFulcrumPosition, guide.incidentAngleProperty.value );
      setArmPosition( transmittedArmNode, viewFulcrumPosition, guide.transmittedAngleProperty.value );
    } );

    // update position and angle of incident arm
    guide.incidentAngleProperty.link( incidentAngle => this.updateArm( incidentArmNode, incidentAngle ) );

    // update position and angle of transmitted arm
    guide.transmittedAngleProperty.link( transmittedAngle => this.updateArm( transmittedArmNode, transmittedAngle ) );
  }

  /**
   * Updates the angle and position of an arm.
   * @param armNode - incident or transmitted arm (rectangle) to be rotated and positioned
   * @param angle - incident or transmitted angle
   */
  updateArm( armNode: Node, angle: number ): void {
    assert && assert( isFinite( angle ) );

    const viewFulcrumPosition = this.modelViewTransform.modelToViewPosition( this.guide.fulcrumPositionProperty.value );

    // because rotateAround prepends the transform
    armNode.rotation = 0;

    // The model-view transform is Y-inverted, so a positive rotation in the model is counterclockwise (negative) in the view.
    armNode.rotateAround( viewFulcrumPosition, -angle );

    // position of the arm
    setArmPosition( armNode, viewFulcrumPosition, angle );
  }

  /**
   * Creates an icon for guides, to be used with checkbox. This is intended to be a caricature of the actual guides.
   * @param armColor
   */
  public static createIcon( armColor: ColorDef = GOColors.guideArm1FillProperty ): Node {

    // constants
    const fulcrumRadius = 5;
    const armWidth = 50;
    const armHeight = 1.25 * fulcrumRadius;
    const angle = Math.PI / 15;

    // Nodes
    const fulcrumNode = new Circle( fulcrumRadius, FULCRUM_OPTIONS );
    const armOptions = {
      stroke: ARM_STROKE,
      fill: armColor
    };
    const leftArmNode = new Rectangle( 0, 0, armWidth, armHeight, armOptions );
    const rightArmNode = new Rectangle( 0, 0, armWidth, armHeight, armOptions );

    // Layout
    leftArmNode.rotation = -angle;
    rightArmNode.rotation = angle;
    rightArmNode.left = leftArmNode.right;
    rightArmNode.top = leftArmNode.top;
    fulcrumNode.centerX = leftArmNode.right;
    fulcrumNode.centerY = leftArmNode.top + ( fulcrumRadius / 2 );

    return new Node( {
      scale: 0.4,
      children: [ leftArmNode, rightArmNode, fulcrumNode ]
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Sets the position of an arm such that its left center is on the fulcrum point.
 * @param armNode
 * @param viewFulcrumPosition
 * @param angle
 */
function setArmPosition( armNode: Node, viewFulcrumPosition: Vector2, angle: number ): void {
  assert && assert( isFinite( angle ) );

  // Center of the arm is offset from the fulcrum point.
  // The model-view transform is Y-inverted, so a positive rotation in the model is counterclockwise (negative) in the view.
  armNode.center = Vector2.createPolar( GUIDE_RECTANGLE_WIDTH / 2, -angle ).plus( viewFulcrumPosition );
}

geometricOptics.register( 'GuideNode', GuideNode );
export default GuideNode;
