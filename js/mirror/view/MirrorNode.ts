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

class MirrorNode extends Node {

  /**
   * @param mirror
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( mirror: Mirror, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, options?: any ) { //TYPESCRIPT any

    options = merge( {
      fill: GeometricOpticsColors.mirrorGlassColorProperty,
      stroke: GeometricOpticsColors.mirrorBackingColorProperty,
      lineWidth: 2,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const fillNode = new Path( null, {
      fill: options.fill
    } );

    const strokeNode = new Path( null, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    assert && assert( !options.children );
    options.children = [ fillNode, strokeNode ];

    super( options );

    // Shapes are described in model coordinates. Scale them to view coordinates.
    // Translation is handled by mirror.positionProperty listener.
    mirror.shapesProperty.link( shapes => {
      const scaleVector = modelViewTransform.getMatrix().getScaleVector();
      const scalingMatrix = Matrix3.scaling( scaleVector.x, scaleVector.y );
      fillNode.shape = shapes.fillShape.transformed( scalingMatrix );
      strokeNode.shape = shapes.strokeShape.transformed( scalingMatrix );
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
   * @param options
   */
  public static createIconNode( opticShape: OpticShapeEnum, options?: any ): Node { //TYPESCRIPT any

    options = merge( {
      radius: 20, // radius of curvature of the mirror, in cm
      diameter: 30 // diameter of the mirror, in cm
    }, options );

    const iconShapes = new MirrorShapes( opticShape, options.radius, options.diameter, {
      backingThickness: 4
    } );

    const fillNode = new Path( iconShapes.fillShape, {
      fill: GeometricOpticsColors.mirrorGlassColorProperty
    } );

    const strokeNode = new Path( iconShapes.strokeShape, {
      stroke: GeometricOpticsColors.mirrorBackingColorProperty
    } );

    return new Node( {
      children: [ fillNode, strokeNode ]
    } );
  }
}

geometricOptics.register( 'MirrorNode', MirrorNode );
export default MirrorNode;