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
import pencil3dInvertedImage from '../../../images/pencil-3d-inverted_png.js';
import pencil3dReversedInvertedImage from '../../../images/pencil-3d-reversed-inverted_png.js';
import pencil3dReversedImage from '../../../images/pencil-3d-reversed_png.js';
import pencil3dImage from '../../../images/pencil-3d_png.js';
import pencilImage from '../../../images/pencil_png.js';
import rocket3dReversedImage from '../../../images/rocket-3d-reversed_png.js';
import rocket3dImage from '../../../images/rocket-3d_png.js';
import rocketImage from '../../../images/rocket_png.js';
import projectorScreen3dImage from '../../../images/projector-screen-3d_png.js';
import tree3dReversedImage from '../../../images/tree-3d-reversed_png.js';
import tree3dImage from '../../../images/tree-3d_png.js';
import treeImage from '../../../images/tree_png.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

const pencilString = geometricOpticsStrings.object.pencil;
const rocketString = geometricOpticsStrings.object.rocket;
const lightString = geometricOpticsStrings.object.light;
const treeString = geometricOpticsStrings.object.tree;

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
  PENCIL: new RepresentationGenerator( pencilImage,
    pencil3dImage,
    pencil3dInvertedImage,
    pencil3dReversedInvertedImage,
    pencil3dReversedImage,
    pencilString, true ),
  TREE: new RepresentationGenerator( treeImage,
    tree3dImage,
    tree3dImage,
    tree3dReversedImage,
    tree3dReversedImage,
    treeString, true ),
  ROCKET: new RepresentationGenerator( rocketImage,
    rocket3dImage,
    rocket3dImage,
    rocket3dReversedImage,
    rocket3dReversedImage,
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
