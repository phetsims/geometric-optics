// Copyright 2021, University of Colorado Boulder

/**
 * MirrorNode displays the mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../../common/GeometricOpticsColors.js';
import Mirror from '../model/Mirror.js';
import MirrorShapes from '../model/MirrorShapes.js';
import OpticShapeEnum from '../../common/model/OpticShapeEnum.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import GeometricOpticsQueryParameters from '../../common/GeometricOpticsQueryParameters.js';
import OriginNode from '../../common/view/OriginNode.js';

// constants
const FILL = GeometricOpticsColors.mirrorBackingColorProperty;
const STROKE = GeometricOpticsColors.mirrorReflectiveCoatingColorProperty;
const LINE_WIDTH = 2;
const ICON_RADIUS_OF_CURVATURE = 20;
const ICON_DIAMETER = 30;

type Options = {
  tandem: Tandem
};

class MirrorNode extends Node {

  /**
   * @param mirror
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( mirror: Mirror, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, options: Options ) {

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
    if ( GeometricOpticsQueryParameters.showPositions ) {
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
      backingNode.shape = shapes.fillShape.transformed( scalingMatrix );
      reflectiveCoatingNode.shape = shapes.strokeShape.transformed( scalingMatrix );
    } );

    mirror.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
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
  public static createIconNode( opticShape: OpticShapeEnum ): Node {

    const mirrorShapes = new MirrorShapes( opticShape, ICON_RADIUS_OF_CURVATURE, ICON_DIAMETER, {
      backingThickness: 4 // cm
    } );

    const backingNode = new Path( mirrorShapes.fillShape, {
      fill: GeometricOpticsColors.mirrorBackingColorProperty
    } );

    const reflectiveCoatingNode = new Path( mirrorShapes.strokeShape, {
      stroke: GeometricOpticsColors.mirrorReflectiveCoatingColorProperty
    } );

    return new Node( {
      children: [ backingNode, reflectiveCoatingNode ]
    } );
  }
}

geometricOptics.register( 'MirrorNode', MirrorNode );
export default MirrorNode;