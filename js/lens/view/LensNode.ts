// Copyright 2021, University of Colorado Boulder

/**
 * LensNode displays a lens.
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
import { Line, Node, Path } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../../common/GeometricOpticsColors.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import Lens from '../model/Lens.js';
import OpticShapeEnum from '../../common/model/OpticShapeEnum.js';
import LensShapes from '../model/LensShapes.js';

class LensNode extends Node {

  /**
   * @param lens
   * @param modelBoundsProperty
   * @param modelViewTransform
   * @param options
   */
  constructor( lens: Lens, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, options?: any ) { //TYPESCRIPT any

    options = merge( {
      fill: GeometricOpticsColors.lensFillProperty,
      stroke: GeometricOpticsColors.lensStrokeProperty,
      lineWidth: 2,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const fillNode = new Path( null, {
      fill: options.fill
    } );

    // Separate Node for stroke, because we'll be changing fillNode opacity to match index of refraction.
    const strokeNode = new Path( null, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    // Vertical axis for the lens, see https://github.com/phetsims/geometric-optics/issues/190
    const verticalCenterLine = new Line( 0, 0, 0, 1, {
      stroke: GeometricOpticsColors.verticalAxisStrokeProperty,
      lineWidth: GeometricOpticsConstants.AXIS_LINE_WIDTH
    } );

    assert && assert( !options.children );
    options.children = [ fillNode, verticalCenterLine, strokeNode ];

    super( options );

    // Shape of the optic will change when curve type, radius of curvature, or diameter is changed.
    lens.shapesProperty.link( shapes => {

      // Shapes are described in model coordinates. If we use modelViewTransform.modelToViewShape to transform
      // to view coordinates, the Shapes will be translated. That creates problems, because translation of this
      // Node should be based on optic.positionProperty. So create our own matrix based on modelViewTransform,
      // but with no effective translation, and use that matrix to transform the Shapes from model to view coordinates.
      const matrix = modelViewTransform.getMatrix().copy();
      const translation = matrix.getTranslation();
      matrix.prependTranslation( -translation.x, -translation.y );

      // Create the shapes in view coordinates.
      //TODO why do we need 2 different shapes?
      fillNode.shape = shapes.fillShape.transformed( matrix );
      strokeNode.shape = shapes.outlineShape.transformed( matrix );
    } );

    lens.diameterProperty.link( diameter => {
      const radiusView = modelViewTransform.modelToViewDeltaY( diameter / 2 );
      verticalCenterLine.setLine( 0, -radiusView, 0, radiusView );
    } );

    // Index of refraction determines the opacity used for the lens fill.
    // The lens is never fully transparent, because it's index of refraction is not equivalent to air.
    // See https://github.com/phetsims/geometric-optics/issues/242
    const opacityProperty = new DerivedProperty<number>( [ lens.indexOfRefractionProperty ],
      ( indexOfRefraction: number ) => {
        assert && assert( lens.indexOfRefractionProperty.range ); // {Range|null}
        const range: Range = lens.indexOfRefractionProperty.range!;
        return Utils.linear( range.min, range.max, 0.2, 1, indexOfRefraction );
      } );
    opacityProperty.linkAttribute( fillNode, 'opacity' );

    lens.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Creates an icon for a lens.
   * @param opticShape
   * @param options
   */
  public static createIconNode( opticShape: OpticShapeEnum, options?: any ): Node { //TYPESCRIPT any

    options = merge( {
      radius: 20, // radius of curvature of the lens, in cm
      diameter: 30 // diameter of the lens, in cm
    }, options );

    const iconShapes = new LensShapes( opticShape, options.radius, options.diameter, {
      isHollywooded: false
    } );

    const fillNode = new Path( iconShapes.fillShape, {
      fill: GeometricOpticsColors.lensFillProperty
    } );

    const outlineNode = new Path( iconShapes.outlineShape, {
      stroke: GeometricOpticsColors.lensStrokeProperty
    } );

    return new Node( {
      children: [ fillNode, outlineNode ]
    } );
  }
}

geometricOptics.register( 'LensNode', LensNode );
export default LensNode;