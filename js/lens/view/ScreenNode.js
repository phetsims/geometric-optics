// Copyright 2021, University of Colorado Boulder

/**
 * View of the lens (does not include guides, optical axis and focal points)
 *
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsColorProfile from '../../common/GeometricOpticsColorProfile.js';
import GeometricOpticsConstants from '../../common/GeometricOpticsConstants.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import screen3dImage from '../../../images/screen-3d_png.js';

class ScreenNode extends Node {

  /**
   * @param {Vector2Property} screenPositionProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( screenPositionProperty, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( options );

    const offset = new Vector2( -0.6, 1.5 );
    const imagePositionProperty = new Vector2Property( screenPositionProperty.value.plus( offset ) );

    // create a drag listener on the fill of the opticalElement
    const dragListener = new DragListener(
      {
        positionProperty: imagePositionProperty,
        transform: modelViewTransform
      } );

    const screenImage = new Image( screen3dImage );

    const circle = new Circle( 5, { fill: 'pink' } );

    imagePositionProperty.link( position => {
      screenPositionProperty.value = position.minus( offset );
      screenImage.leftTop = modelViewTransform.modelToViewPosition( position );
    } );

    screenPositionProperty.link( position => {
      circle.center = modelViewTransform.modelToViewPosition( position );
    } );

    screenImage.addInputListener( dragListener );
    this.addChild( screenImage );
    this.addChild( circle );

  }
}

geometricOptics.register( 'ScreenNode', ScreenNode );
export default ScreenNode;
