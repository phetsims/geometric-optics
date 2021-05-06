// Copyright 2021, University of Colorado Boulder

/**
 * View of the lens (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Property from '../../../../axon/js/Property.js';

const FILL = GeometricOpticsColorProfile.lensFillProperty;
const STROKE = GeometricOpticsColorProfile.lensStrokeProperty;
const LINE_WIDTH = GeometricOpticsConstants.LENS_LINE_WIDTH;

class LensNode extends Node {

  /**
   * @param {Lens} lens
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( lens, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super();

    // create a drag listener on this node
    const dragListener = new DragListener(
      {
        positionProperty: lens.positionProperty,
        transform: modelViewTransform,
        applyOffset: false
      } );

    // create the path of the lens
    const lensPath = new Path( modelViewTransform.modelToViewShape( lens.shape ), {
      stroke: STROKE,
      lineWidth: LINE_WIDTH
    } );

    // update the shape and position of the lens
    Property.multilink( [
        lens.positionProperty,
        lens.radiusOfCurvatureProperty,
        lens.indexOfRefractionProperty,
        lens.diameterProperty,
        lens.curvatureTypeProperty ],
      () => {
        lensPath.shape = modelViewTransform.modelToViewShape( lens.shape );
      } );

    // link the normalized index of refraction to the opacity of the fill of the lens
    lens.normalizedIndexProperty.link( index => {
      lensPath.fill = new Color( FILL.value.red, FILL.value.green, FILL.value.blue, index );
    } );

    this.addInputListener( dragListener );
    this.addChild( lensPath );

  }
}

geometricOptics.register( 'LensNode', LensNode );
export default LensNode;
