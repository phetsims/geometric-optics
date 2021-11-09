// Copyright 2021, University of Colorado Boulder

/**
 * OpticNode displays the optic, a lens or mirror.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Optic from '../model/Optic.js';

class OpticNode extends Node {

  /**
   * @param {Optic} optic
   * @param {Property.<Bounds2>} modelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( optic: Optic, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, options?: any ) { //TYPESCRIPT any

    options = merge( {
      fill: GeometricOpticsColors.opticFillProperty,
      stroke: GeometricOpticsColors.opticStrokeProperty,
      lineWidth: 2,

      // pdom options
      tagName: 'div',
      focusable: true,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.children );
    options.children = [];

    const opticFillNode = new Path( null, {
      fill: options.fill
    } );
    options.children.push( opticFillNode );

    // Vertical axis for the lens, see https://github.com/phetsims/geometric-optics/issues/190
    if ( optic.isLens() ) {
      const verticalCenterLine = new Line( 0, 0, 0, 1, {
        stroke: GeometricOpticsColors.verticalAxisStrokeProperty,
        lineWidth: GeometricOpticsConstants.AXIS_LINE_WIDTH
      } );
      options.children.push( verticalCenterLine );

      optic.diameterProperty.link( diameter => {
        const radiusView = modelViewTransform.modelToViewDeltaY( diameter / 2 );
        verticalCenterLine.setLine( 0, -radiusView, 0, radiusView );
      } );
    }

    // Separate Node for stroke, because we'll be changing opticFillNode opacity to match index of refraction.
    const opticStrokeNode = new Path( null, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );
    options.children.push( opticStrokeNode );

    super( options );

    // Shape of the optic will change when curve type, radius of curvature, or diameter is changed.
    optic.shapesProperty.link( shapes => {

      // Shapes are described in model coordinates. If we use modelViewTransform.modelToViewShape to transform
      // to view coordinates, the Shapes will be translated. That creates problems, because translation of this
      // Node should be based on optic.positionProperty. So create our own matrix based on modelViewTransform,
      // but with no effective translation, and use that matrix to transform the Shapes from model to view coordinates.
      const matrix = modelViewTransform.getMatrix().copy();
      const translation = matrix.getTranslation();
      matrix.prependTranslation( -translation.x, -translation.y );

      // Create the shapes in view coordinates.
      opticFillNode.shape = shapes.fillShape.transformed( matrix );
      opticStrokeNode.shape = shapes.outlineShape.transformed( matrix );
    } );

    // Index of refraction determines the opacity used for the lens fill.
    // The lens is never fully transparent, because it's index of refraction is not equivalent to air.
    // See https://github.com/phetsims/geometric-optics/issues/242
    if ( optic.isLens() ) {
      const opacityProperty = new DerivedProperty<number>( [ optic.indexOfRefractionProperty ],
        ( indexOfRefraction: number ) => {
          assert && assert( optic.indexOfRefractionProperty.range ); // {Range|null}
          const range: Range = optic.indexOfRefractionProperty.range!;
          return Utils.linear( range.min, range.max, 0.2, 1, indexOfRefraction );
        } );
      opacityProperty.linkAttribute( opticFillNode, 'opacity' );
    }

    optic.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );
  }

  /**
   * @override
   */
  public dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticNode', OpticNode );
export default OpticNode;