// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration of the representation of the objects and source of light
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import lampBlueImage from '../../../images/lamp-blue_png.js';
import lampRedImage from '../../../images/lamp-red_png.js';
import pencil3dLeftFacingInvertedImage from '../../../images/pencil-3d-left-facing-inverted_png.js';
import pencil3dLeftFacingUprightImage from '../../../images/pencil-3d-left-facing-upright_png.js';
import pencil3dRightFacingInvertedImage from '../../../images/pencil-3d-right-facing-inverted_png.js';
import pencil3dRightFacingUprightImage from '../../../images/pencil-3d-right-facing-upright_png.js';
import pencilLogoImage from '../../../images/pencil-logo_png.js';
import projectorScreen3dImage from '../../../images/projector-screen-3d_png.js';
import rocket3dLeftFacingInvertedImage from '../../../images/rocket-3d-left-facing-inverted_png.js';
import rocket3dRightFacingUprightImage from '../../../images/rocket-3d-right-facing-upright_png.js';
import rocketLogoImage from '../../../images/rocket-logo_png.js';
import tree3dLeftFacingInvertedImage from '../../../images/tree-3d-left-facing-inverted_png.js';
import tree3dRightFacingUprightImage from '../../../images/tree-3d-right-facing-upright_png.js';
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
   * @param {string} label
   * @param {boolean} isObject
   * @param {Object} [options]
   */
  constructor( logo,
               rightFacingUpright,
               rightFacingInverted,
               leftFacingUpright,
               leftFacingInverted,
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
    pencilString, true ),
  TREE: new RepresentationGenerator( treeLogoImage,
    tree3dRightFacingUprightImage,
    tree3dRightFacingUprightImage,
    tree3dLeftFacingInvertedImage,
    tree3dLeftFacingInvertedImage,
    treeString, true ),
  ROCKET: new RepresentationGenerator( rocketLogoImage,
    rocket3dRightFacingUprightImage,
    rocket3dRightFacingUprightImage,
    rocket3dLeftFacingInvertedImage,
    rocket3dLeftFacingInvertedImage,
    rocketString, true ),
  LIGHT: new RepresentationGenerator( lampRedImage,
    lampBlueImage,
    lampBlueImage,
    projectorScreen3dImage,
    projectorScreen3dImage,
    lightString, false, { source: lampRedImage } )
} );


geometricOptics.register( 'Representation', Representation );
export default Representation;
