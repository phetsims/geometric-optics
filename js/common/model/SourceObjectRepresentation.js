// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration of the representation of the objects
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import geometricOptics from '../../geometricOptics.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import rocket3dImage from '../../../images/rocket-3d_png.js';
import rocketImage from '../../../images/rocket_png.js';
import rocket3dReversedImage from '../../../images/rocket-3d-reversed_png.js';
import lampRedImage from '../../../images/lamp-red_png.js';
import lampBlueImage from '../../../images/lamp-blue_png.js';
import pencilImage from '../../../images/pencil_png.js';
import pencil3dImage from '../../../images/pencil-3d_png.js';
import pencil3dInvertedImage from '../../../images/pencil-3d-inverted_png.js';
import pencil3dReversedImage from '../../../images/pencil-3d-reversed_png.js';
import pencil3dReversedInvertedImage from '../../../images/pencil-3d-reversed-inverted_png.js';
import treeImage from '../../../images/tree_png.js';
import tree3dImage from '../../../images/tree-3d_png.js';
import tree3dReversedImage from '../../../images/tree-3d-reversed_png.js';
import screen3dImage from '../../../images/screen-3d_png.js';

const pencilString = geometricOpticsStrings.object.pencil;
const rocketString = geometricOpticsStrings.object.rocket;
const lightString = geometricOpticsStrings.object.light;
const treeString = geometricOpticsStrings.object.tree;
const circleNode = new Circle( 10, { fill: 'yellow' } );
const circleImage = circleNode.rasterized();

class RepresentationGenerator {
  /**
   * Generator of representation
   * @param {Image} logo
   * @param {Image} objectUpright
   * @param {Image} objectInverted
   * @param {Image} targetUpright
   * @param {Image} targetInverted
   * @param {string} label
   * @param {boolean} isObject
   */
  constructor( logo,
               objectUpright,
               objectInverted,
               targetUpright,
               targetInverted,
               label,
               isObject, options ) {

    options = merge( {
      source: circleImage
    }, options );

    this.logo = logo;
    this.objectUpright = objectUpright;
    this.objectInverted = objectInverted;
    this.targetUpright = targetUpright;
    this.targetInverted = targetInverted;
    this.label = label;
    this.isObject = isObject;
    this.source = options.source;
  }


}

const SourceObjectRepresentation = Enumeration.byMap( {
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
    screen3dImage,
    screen3dImage,
    lightString, false, { source: new Image( lampRedImage ) } )
} );


geometricOptics.register( 'SourceObjectRepresentation', SourceObjectRepresentation );
export default SourceObjectRepresentation;
