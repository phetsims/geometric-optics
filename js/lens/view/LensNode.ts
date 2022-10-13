// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensNode displays a lens.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line, Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../../common/GOColors.js';
import Lens from '../model/Lens.js';
import { OpticSurfaceType } from '../../common/model/OpticSurfaceType.js';
import LensShapes from '../model/LensShapes.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import GOQueryParameters from '../../common/GOQueryParameters.js';
import OriginNode from '../../common/view/OriginNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// constants
const FILL_PROPERTY = GOColors.lensFillProperty;
const STROKE_PROPERTY = GOColors.lensStrokeProperty;
const LINE_WIDTH = 2;
const ICON_RADIUS_OF_CURVATURE_MAGNITUDE = 20;
const ICON_DIAMETER = 30;

type SelfOptions = EmptySelfOptions;

type LensNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class LensNode extends Node {

  public constructor( lens: Lens, modelViewTransform: ModelViewTransform2, providedOptions: LensNodeOptions ) {

    const options = optionize<LensNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    const fillNode = new Path( null, {
      fill: FILL_PROPERTY
    } );

    // Separate Node for stroke, because we'll be changing fillNode opacity to match IOR.
    const strokeNode = new Path( null, {
      stroke: STROKE_PROPERTY,
      lineWidth: LINE_WIDTH
    } );

    // Vertical axis for the lens, see https://github.com/phetsims/geometric-optics/issues/190
    const verticalCenterLine = new Line( 0, 0, 0, 1, {
      stroke: GOColors.verticalAxisStrokeProperty,
      lineWidth: 2
    } );

    const children: Node[] = [ fillNode, verticalCenterLine, strokeNode ];

    // Red dot at the origin
    if ( GOQueryParameters.debugOrigins ) {
      children.push( new OriginNode() );
    }

    this.children = children;

    // Shapes are described in model coordinates. Scale them to view coordinates.
    // Translation is handled by lens.positionProperty listener.
    const scaleVector = modelViewTransform.getMatrix().getScaleVector();
    const scalingMatrix = Matrix3.scaling( scaleVector.x, scaleVector.y );
    lens.shapesProperty.link( shapes => {
      const shape = shapes.lensShape.transformed( scalingMatrix );
      fillNode.shape = shape;
      strokeNode.shape = shape;
    } );

    lens.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    lens.diameterProperty.link( diameter => {
      const radiusView = modelViewTransform.modelToViewDeltaY( diameter / 2 );
      verticalCenterLine.setLine( 0, -radiusView, 0, radiusView );
    } );

    lens.opacityProperty.linkAttribute( fillNode, 'opacity' );

    this.addLinkedElement( lens, {
      tandem: options.tandem.createTandem( lens.tandem.name )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Creates an icon for a lens.
   */
  public static createIconNode( opticSurfaceType: OpticSurfaceType ): Node {
    assert && assert( opticSurfaceType !== 'flat', 'flat lens is not supported' );

    const radiusOfCurvature = ( opticSurfaceType === 'convex' ) ? ICON_RADIUS_OF_CURVATURE_MAGNITUDE : -ICON_RADIUS_OF_CURVATURE_MAGNITUDE;

    const lensShapes = new LensShapes( radiusOfCurvature, ICON_DIAMETER, {
      isHollywooded: false
    } );

    const fillNode = new Path( lensShapes.lensShape, {
      fill: GOColors.lensFillProperty
    } );

    const strokeNode = new Path( lensShapes.lensShape, {
      stroke: GOColors.lensStrokeProperty
    } );

    return new Node( {
      children: [ fillNode, strokeNode ]
    } );
  }
}

geometricOptics.register( 'LensNode', LensNode );