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

class MirrorNode extends Node {

  /**
   * @param mirror
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( mirror: Mirror, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, options?: any ) { //TYPESCRIPT any

    options = merge( {
      fill: GeometricOpticsColors.mirrorFillProperty,
      stroke: GeometricOpticsColors.mirrorStrokeProperty,
      lineWidth: 2,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const glassNode = new Path( null, {
      fill: options.fill
    } );

    const backingNode = new Path( null, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    assert && assert( !options.children );
    options.children = [ glassNode, backingNode ];

    super( options );

    mirror.shapesProperty.link( shapes => {

      // Shapes are described in model coordinates. If we use modelViewTransform.modelToViewShape to transform
      // to view coordinates, the Shapes will be translated. That creates problems, because translation of this
      // Node should be based on optic.positionProperty. So create our own matrix based on modelViewTransform,
      // but with no effective translation, and use that matrix to transform the Shapes from model to view coordinates.
      const matrix = modelViewTransform.getMatrix().copy();
      const translation = matrix.getTranslation();
      matrix.prependTranslation( -translation.x, -translation.y );

      // Create the shapes in view coordinates.
      glassNode.shape = shapes.fillShape.transformed( matrix ); //TODO shapes.glassShape
      backingNode.shape = shapes.outlineShape.transformed( matrix ); //TODO shapes.backingShape
    } );

    mirror.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'MirrorNode', MirrorNode );
export default MirrorNode;