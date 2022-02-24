// Copyright 2021-2022, University of Colorado Boulder

/**
 * MirrorNode displays the mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../../common/GOColors.js';
import Mirror from '../model/Mirror.js';
import MirrorShapes from '../model/MirrorShapes.js';
import { OpticShape } from '../../common/model/OpticShape.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import GOQueryParameters from '../../common/GOQueryParameters.js';
import OriginNode from '../../common/view/OriginNode.js';
import merge from '../../../../phet-core/js/merge.js';
import { PickRequired } from '../../common/GOTypes.js';

// constants
const FILL = GOColors.mirrorBackingColorProperty;
const STROKE = GOColors.mirrorReflectiveCoatingColorProperty;
const LINE_WIDTH = 2;
const ICON_FLAT_RADIUS_OF_CURVATURE_MAGNITUDE = 200000;
const ICON_CONVEX_RADIUS_OF_CURVATURE_MAGNITUDE = 20;
const ICON_CONCAVE_RADIUS_OF_CURVATURE_MAGNITUDE = -ICON_CONVEX_RADIUS_OF_CURVATURE_MAGNITUDE;
const ICON_DIAMETER = 30;

type MirrorNodeOptions = PickRequired<NodeOptions, 'tandem'>;

class MirrorNode extends Node {

  /**
   * @param mirror
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( mirror: Mirror, modelViewTransform: ModelViewTransform2, providedOptions: MirrorNodeOptions ) {

    const options = merge( {
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // the mirror's backing
    const backingNode = new Path( null, {
      fill: FILL
    } );

    // the mirror's reflective coating
    const reflectiveCoatingNode = new Path( null, {
      stroke: STROKE,
      lineWidth: LINE_WIDTH
    } );

    const children: Node[] = [ backingNode, reflectiveCoatingNode ];

    // Red dot at the origin
    if ( GOQueryParameters.debugOrigins ) {
      children.push( new OriginNode() );
    }

    super( merge( {
      children: children
    }, options ) );

    // Shapes are described in model coordinates. Scale them to view coordinates.
    // Translation is handled by mirror.positionProperty listener.
    const scaleVector = modelViewTransform.getMatrix().getScaleVector();
    const scalingMatrix = Matrix3.scaling( scaleVector.x, scaleVector.y );
    mirror.shapesProperty.link( shapes => {
      backingNode.shape = shapes.backingShape.transformed( scalingMatrix );
      reflectiveCoatingNode.shape = shapes.reflectiveCoatingShape.transformed( scalingMatrix );
    } );

    mirror.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    this.addLinkedElement( mirror, {
      tandem: options.tandem.createTandem( 'mirror' )
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Creates an icon for a mirror.
   * @param opticShape
   */
  public static createIconNode( opticShape: OpticShape ): Node {

    const radiusOfCurvature = ( opticShape === 'flat' ) ? ICON_FLAT_RADIUS_OF_CURVATURE_MAGNITUDE :
                              ( opticShape === 'convex' ) ? ICON_CONVEX_RADIUS_OF_CURVATURE_MAGNITUDE :
                              ICON_CONCAVE_RADIUS_OF_CURVATURE_MAGNITUDE;

    const mirrorShapes = new MirrorShapes( radiusOfCurvature, ICON_DIAMETER, {
      backingThickness: 4 // cm
    } );

    const backingNode = new Path( mirrorShapes.backingShape, {
      fill: GOColors.mirrorBackingColorProperty
    } );

    const reflectiveCoatingNode = new Path( mirrorShapes.reflectiveCoatingShape, {
      stroke: GOColors.mirrorReflectiveCoatingColorProperty
    } );

    return new Node( {
      children: [ backingNode, reflectiveCoatingNode ]
    } );
  }
}

geometricOptics.register( 'MirrorNode', MirrorNode );
export default MirrorNode;