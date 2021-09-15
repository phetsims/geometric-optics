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

class RepresentationGenerator {

  /**
   * Generator of representation
   * @param {HTMLImageElement} logo
   * @param {HTMLImageElement} rightFacingUpright
   * @param {HTMLImageElement|null} rightFacingInverted
   * @param {HTMLImageElement|null} leftFacingUpright
   * @param {HTMLImageElement|null} leftFacingInverted
   * @param {Dimension2} dimensions - dimensions of the rightFacingUpright Image in pixels
   * @param {Vector2} rightFacingUprightOffsetPosition -  offset in pixel between point of interest and left top corer
   * @param {string} label - label for the representation
   * @param {boolean} isObject - is this representation an object?, otherwise it is a source of light
   * @param {Object} [options]
   */
  constructor( logo, rightFacingUpright, rightFacingInverted, leftFacingUpright, leftFacingInverted, dimensions,
               rightFacingUprightOffsetPosition, label, isObject, options ) {

    options = merge( {

      // {HTMLImageElement|null} image for source of light
      source: null
    }, options );

    //@public (read-only)
    this.logo = logo;
    this.rightFacingUpright = rightFacingUpright;
    this.rightFacingInverted = rightFacingInverted;
    this.leftFacingUpright = leftFacingUpright;
    this.leftFacingInverted = leftFacingInverted;
    this.dimensions = dimensions;
    this.offsetPosition = rightFacingUprightOffsetPosition;
    this.label = label;
    this.isObject = isObject;
    this.source = options.source;
  }
}

const Representation = Enumeration.byMap( {

  PENCIL: new RepresentationGenerator(
    pencilIcon_png,
    pencilRightFacingUpright_png,
    pencilRightFacingInverted_png,
    pencilLeftFacingUpright_png,
    pencilLeftFacingInverted_png,
    new Dimension2( 111, 365 ),
    new Vector2( -64, 70 ),
    geometricOpticsStrings.pencil,
    true
  ),

  TREE: new RepresentationGenerator(
    treeIcon_png,
    treeRightFacingUpright_png,
    treeRightFacingInverted_png,
    treeLeftFacingUpright_png,
    treeLeftFacingInverted_png,
    new Dimension2( 135, 391 ),
    new Vector2( -80, 88 ),
    geometricOpticsStrings.tree,
    true
  ),

  ROCKET: new RepresentationGenerator(
    rocketIcon_png,
    rocketRightFacingUpright_png,
    rocketRightFacingInverted_png,
    rocketLeftFacingUpright_png,
    rocketLeftFacingInverted_png,
    new Dimension2( 116, 414 ),
    new Vector2( -68, 112 ),
    geometricOpticsStrings.rocket,
    true
  ),

  LIGHT: new RepresentationGenerator(
    lampBlueIcon_png,
    lampBlue_png,
    null,
    null,
    null,
    new Dimension2( 100, 100 ),
    new Vector2( -66, 28 ),
    geometricOpticsStrings.light,
    false,
    { source: lampRed_png }
  )
} );

geometricOptics.register( 'Representation', Representation );
export default Representation;