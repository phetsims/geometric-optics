// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration of the representation of the objects and source of light
 *
 * @author Martin Veillette
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import lampBlue_png from '../../../images/lampBlue_png.js';
import lampBlueIcon_png from '../../../images/lampBlueIcon_png.js';
import lampRed_png from '../../../images/lampRed_png.js';
import pencilIcon_png from '../../../images/pencilIcon_png.js';
import pencilLeftFacingInverted_png from '../../../images/pencilLeftFacingInverted_png.js';
import pencilLeftFacingUpright_png from '../../../images/pencilLeftFacingUpright_png.js';
import pencilRightFacingInverted_png from '../../../images/pencilRightFacingInverted_png.js';
import pencilRightFacingUpright_png from '../../../images/pencilRightFacingUpright_png.js';
import rocketIcon_png from '../../../images/rocketIcon_png.js';
import rocketLeftFacingInverted_png from '../../../images/rocketLeftFacingInverted_png.js';
import rocketLeftFacingUpright_png from '../../../images/rocketLeftFacingUpright_png.js';
import rocketRightFacingInverted_png from '../../../images/rocketRightFacingInverted_png.js';
import rocketRightFacingUpright_png from '../../../images/rocketRightFacingUpright_png.js';
import treeIcon_png from '../../../images/treeIcon_png.js';
import treeLeftFacingInverted_png from '../../../images/treeLeftFacingInverted_png.js';
import treeLeftFacingUpright_png from '../../../images/treeLeftFacingUpright_png.js';
import treeRightFacingInverted_png from '../../../images/treeRightFacingInverted_png.js';
import treeRightFacingUpright_png from '../../../images/treeRightFacingUpright_png.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

class RepresentationInstance {

  /**
   * @param {Object} config
   */
  constructor( config ) {

    config = merge( {

      // required fields
      // {HTMLImageElement} icon - the icon that appears in UI controls
      icon: required( config.icon ),

      // images
      rightFacingUpright: required( config.rightFacingUpright ), // {HTMLImageElement}
      rightFacingInverted: required( config.rightFacingInverted ), // {HTMLImageElement|null}
      leftFacingUpright: required( config.leftFacingUpright ), // {HTMLImageElement|null}
      leftFacingInverted: required( config.leftFacingInverted ), // {HTMLImageElement|null}

      // {Dimension2} dimensions of the rightFacingUpright Image in pixels
      dimensions: required( config.dimensions ),

      // {Vector2} offset in pixel between point of interest and left top corer
      rightFacingUprightOffsetPosition: required( config.rightFacingUprightOffsetPosition ),

      // {string} label for the representation
      label: required( config.label ),

      // {boolean} is this representation an object?, otherwise it is a source of light
      isObject: required( config.isObject ),

      // optional fields
      secondSourceImage: null // {HTMLImageElement|null} image for second source of light
    }, config );

    // @public (read-only)
    this.icon = config.icon;
    this.rightFacingUpright = config.rightFacingUpright;
    this.rightFacingInverted = config.rightFacingInverted;
    this.leftFacingUpright = config.leftFacingUpright;
    this.leftFacingInverted = config.leftFacingInverted;
    this.dimensions = config.dimensions;
    this.offsetPosition = config.rightFacingUprightOffsetPosition;
    this.label = config.label;
    this.isObject = config.isObject;
    this.secondSourceImage = config.secondSourceImage;
  }
}

const Representation = Enumeration.byMap( {

  PENCIL: new RepresentationInstance( {
    icon: pencilIcon_png,
    rightFacingUpright: pencilRightFacingUpright_png,
    rightFacingInverted: pencilRightFacingInverted_png,
    leftFacingUpright: pencilLeftFacingUpright_png,
    leftFacingInverted: pencilLeftFacingInverted_png,
    dimensions: new Dimension2( 111, 365 ),
    rightFacingUprightOffsetPosition: new Vector2( -64, 70 ),
    label: geometricOpticsStrings.pencil,
    isObject: true
  } ),

  TREE: new RepresentationInstance( {
    icon: treeIcon_png,
    rightFacingUpright: treeRightFacingUpright_png,
    rightFacingInverted: treeRightFacingInverted_png,
    leftFacingUpright: treeLeftFacingUpright_png,
    leftFacingInverted: treeLeftFacingInverted_png,
    dimensions: new Dimension2( 135, 391 ),
    rightFacingUprightOffsetPosition: new Vector2( -80, 88 ),
    label: geometricOpticsStrings.tree,
    isObject: true
  } ),

  ROCKET: new RepresentationInstance( {
    icon: rocketIcon_png,
    rightFacingUpright: rocketRightFacingUpright_png,
    rightFacingInverted: rocketRightFacingInverted_png,
    leftFacingUpright: rocketLeftFacingUpright_png,
    leftFacingInverted: rocketLeftFacingInverted_png,
    dimensions: new Dimension2( 116, 414 ),
    rightFacingUprightOffsetPosition: new Vector2( -68, 112 ),
    label: geometricOpticsStrings.rocket,
    isObject: true
  } ),

  LIGHT: new RepresentationInstance( {
    icon: lampBlueIcon_png,
    rightFacingUpright: lampBlue_png,
    rightFacingInverted: null,
    leftFacingUpright: null,
    leftFacingInverted: null,
    dimensions: new Dimension2( 100, 100 ),
    rightFacingUprightOffsetPosition: new Vector2( -66, 28 ),
    label: geometricOpticsStrings.light,
    isObject: false,
    secondSourceImage: lampRed_png
  } )
} );

geometricOptics.register( 'Representation', Representation );
export default Representation;