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
import lampBlueLogoImage from '../../../images/lamp-blue-logo_png.js';
import lampBlueImage from '../../../images/lamp-blue_png.js';
import lampRedImage from '../../../images/lamp-red_png.js';
import pencil3dLeftFacingInvertedImage from '../../../images/pencil-3d-left-facing-inverted_png.js';
import pencil3dLeftFacingUprightImage from '../../../images/pencil-3d-left-facing-upright_png.js';
import pencil3dRightFacingInvertedImage from '../../../images/pencil-3d-right-facing-inverted_png.js';
import pencil3dRightFacingUprightImage from '../../../images/pencil-3d-right-facing-upright_png.js';
import pencilLogoImage from '../../../images/pencil-logo_png.js';
import projectorScreen3dImage from '../../../images/projector-screen-3d_png.js';
import rocket3dLeftFacingInvertedImage from '../../../images/rocket-3d-left-facing-inverted_png.js';
import rocket3dLeftFacingUprightImage from '../../../images/rocket-3d-left-facing-upright_png.js';
import rocket3dRightFacingUprightImage from '../../../images/rocket-3d-right-facing-upright_png.js';
import rocket3dRightFacingInvertedImage from '../../../images/rocket-3d-right-facing-inverted_png.js';
import rocketLogoImage from '../../../images/rocket-logo_png.js';
import tree3dLeftFacingInvertedImage from '../../../images/tree-3d-left-facing-inverted_png.js';
import tree3dLeftFacingUprightImage from '../../../images/tree-3d-left-facing-upright_png.js';
import tree3dRightFacingUprightImage from '../../../images/tree-3d-right-facing-upright_png.js';
import tree3dRightFacingInvertedImage from '../../../images/tree-3d-right-facing-inverted_png.js';
import treeLogoImage from '../../../images/tree-logo_png.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

const pencilString = geometricOpticsStrings.pencil;
const rocketString = geometricOpticsStrings.rocket;
const lightString = geometricOpticsStrings.light;
const treeString = geometricOpticsStrings.tree;

class RepresentationGenerator {
  /**
   * Generator of representation
   * @param {HTMLImageElement} logo
   * @param {HTMLImageElement} rightFacingUpright
   * @param {HTMLImageElement} rightFacingInverted
   * @param {HTMLImageElement} leftFacingUpright
   * @param {HTMLImageElement} leftFacingInverted
   * @param {Dimensions2} dimensions
   * @param {Vector2} leftFacingUprightOffsetPosition
   * @param {string} label
   * @param {boolean} isObject
   * @param {Object} [options]
   */
  constructor( logo,
               rightFacingUpright,
               rightFacingInverted,
               leftFacingUpright,
               leftFacingInverted,
               dimensions,
               leftFacingUprightOffsetPosition,
               label,
               isObject, options ) {

    options = merge( {

      // {HTMLImageElement||null} image for source of light
      source: null
    }, options );

    this.logo = logo;
    this.rightFacingUpright = rightFacingUpright;
    this.rightFacingInverted = rightFacingInverted;
    this.leftFacingUpright = leftFacingUpright;
    this.leftFacingInverted = leftFacingInverted;
    this.dimensions = dimensions;
    this.offsetPosition = leftFacingUprightOffsetPosition;
    this.label = label;
    this.isObject = isObject;
    this.source = options.source;
  }
}

const Representation = Enumeration.byMap( {
  PENCIL: new RepresentationGenerator( pencilLogoImage,
    pencil3dRightFacingUprightImage,
    pencil3dRightFacingInvertedImage,
    pencil3dLeftFacingUprightImage,
    pencil3dLeftFacingInvertedImage,
    new Dimension2( 111, 365 ),
    new Vector2( -32, 35 ),
    pencilString, true ),
  TREE: new RepresentationGenerator( treeLogoImage,
    tree3dRightFacingUprightImage,
    tree3dRightFacingInvertedImage,
    tree3dLeftFacingUprightImage,
    tree3dLeftFacingInvertedImage,
    new Dimension2( 135, 391 ),
    new Vector2( -40, 44 ),
    treeString, true ),
  ROCKET: new RepresentationGenerator( rocketLogoImage,
    rocket3dRightFacingUprightImage,
    rocket3dRightFacingInvertedImage,
    rocket3dLeftFacingUprightImage,
    rocket3dLeftFacingInvertedImage,
    new Dimension2( 116, 414 ),
    new Vector2( -34, 56 ),
    rocketString, true ),
  LIGHT: new RepresentationGenerator( lampBlueLogoImage,
    lampBlueImage,
    lampBlueImage,
    projectorScreen3dImage,
    projectorScreen3dImage,
    new Dimension2( 100, 100 ),
    new Vector2( -33, 14 ),
    lightString, false, { source: lampRedImage } )
} );


geometricOptics.register( 'Representation', Representation );
export default Representation;
