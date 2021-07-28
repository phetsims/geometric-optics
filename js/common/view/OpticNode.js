// Copyright 2021, University of Colorado Boulder

/**
 * View of the optical element (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import LightRayMode from '../model/LightRayMode.js';

const OPTICAL_CENTER_LINE_STROKE = GeometricOpticsColors.opticalAxisStrokeProperty;

const FILL = GeometricOpticsColors.opticFillProperty;
const STROKE = GeometricOpticsColors.opticStrokeProperty;
const LINE_WIDTH = GeometricOpticsConstants.OPTICAL_ELEMENT_LINE_WIDTH;

class OpticNode extends Node {

  /**
   * @param {Optic} optic
   * @param {Property.<LightRayMode>} lightRayModeProperty
   * @param {Property.<Bounds2>} playAreaModelBoundsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( optic, lightRayModeProperty, playAreaModelBoundsProperty, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    options = merge( {
      fill: FILL,
      stroke: STROKE,
      lineWidth: LINE_WIDTH
    }, options );

    super( options );


    // create a drag listener on the fill of the opticalElement (see #22)
    let clickOffset;
    const dragListener = new DragListener( {
      start: event => {

        // click offset in model coordinate between the press drag and the center of the optic
        clickOffset = modelViewTransform.viewToModelPosition(
          this.globalToParentPoint( event.pointer.point ) ).minus( optic.positionProperty.value );
      },
      drag: event => {

        // position of the cursor in model coordinates
        const cursorModelPosition = modelViewTransform.viewToModelPosition(
          this.globalToParentPoint( event.pointer.point ) );

        // model position for the optic
        const unconstrainedModelPosition = cursorModelPosition.minus( clickOffset );

        // set drag bounds on the model position
        const dragBoundPosition = playAreaModelBoundsProperty.value.closestPointTo( unconstrainedModelPosition );

        // constrained optic to merely move vertically
        optic.setVerticalCoordinate( dragBoundPosition.y );
      }
    } );

    // {Path} create the fill (or backing) path of the optic
    const fillPath = new Path( modelViewTransform.modelToViewShape( optic.shapesProperty.value.fillShape ), {
      fill: options.fill
    } );

    // link the index of refraction to the opacity of the fill of the lens
    optic.indexOfRefractionProperty.link( index => {
      const normalizedIndex = optic.getNormalizedIndex( index );
      const fill = options.fill.value;
      fillPath.fill = new Color( fill.red, fill.green, fill.blue, normalizedIndex );
    } );

    // create the outline path of the optic {Path}
    const outlinePath = new Path( modelViewTransform.modelToViewShape( optic.shapesProperty.value.outlineShape ), {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    // create a vertical dashed line, through the optic - indicating the crossing plane of principal rays.
    const opticCenterLine = new Path(
      modelViewTransform.modelToViewShape( optic.getPrincipalLine() ), {
        stroke: OPTICAL_CENTER_LINE_STROKE,
        lineDash: [ 8, 5 ]
      } );


    /**
     * clip the center line based on model bounds
     * @param {Bounds2} modelBounds
     */
    const clipCenterLine = modelBounds => {
      opticCenterLine.clipArea = Shape.bounds( modelViewTransform.modelToViewBounds( modelBounds ) );
    };

    // update position of optic if the bounds change
    playAreaModelBoundsProperty.link( bounds => {

      // set drag bounds on the model position
      const dragBoundsOpticPosition = bounds.closestPointTo( optic.positionProperty.value );

      // constrained optic to merely move vertically
      optic.setVerticalCoordinate( dragBoundsOpticPosition.y );

      // clip the ends of the center line based on play area bounds
      clipCenterLine( bounds );
    } );

    // modify the shape of the optic
    optic.shapesProperty.link( shapes => {
      fillPath.shape = modelViewTransform.modelToViewShape( shapes.fillShape );
      outlinePath.shape = modelViewTransform.modelToViewShape( shapes.outlineShape );
    } );

    // layer for the optic
    const opticLayer = new Node();

    // move the optic layer
    optic.positionProperty.link( position => {
      opticLayer.translation = modelViewTransform.modelToViewDelta( position );
    } );

    // add child and listener to the optic layer
    opticLayer.addInputListener( dragListener );
    opticLayer.addChild( fillPath );
    opticLayer.addChild( outlinePath );

    // add the optic and center line to this node
    this.addChild( opticLayer );
    this.addChild( opticCenterLine );

    // set the optic center line to visible when mode is on Principal Ray
    lightRayModeProperty.link( lightRayMode => {

      opticCenterLine.visible = lightRayMode === LightRayMode.PRINCIPAL_RAYS;

    } );
  }
}

geometricOptics.register( 'OpticNode', OpticNode );
export default OpticNode;
