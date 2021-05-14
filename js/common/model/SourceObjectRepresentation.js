// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration of the representation of the objects
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import geometricOptics from '../../geometricOptics.js';

import rocket3dImage from '../../../images/rocket-3d_png.js';
import rocketImage from '../../../images/rocket_png.js';
import rocket3dReversedImage from '../../../images/rocket-3d-reversed_png.js';
import lampRedImage from '../../../images/lamp-red_png.js';
import lampBlueImage from '../../../images/lamp-blue_png.js';
import pencilImage from '../../../images/pencil_png.js';
import pencil3dImage from '../../../images/pencil-3d_png.js';
import pencil3dReversedImage from '../../../images/pencil-3d-reversed_png.js';
import treeImage from '../../../images/tree_png.js';
import tree3dImage from '../../../images/tree-3d_png.js';
import tree3dReversedImage from '../../../images/tree-3d-reversed_png.js';
import screen3dImage from '../../../images/screen-3d_png.js';

const pencilString = geometricOpticsStrings.object.pencil;
const rocketString = geometricOpticsStrings.object.rocket;
const lightString = geometricOpticsStrings.object.light;
const treeString = geometricOpticsStrings.object.tree;

/**
 * Generator of type
 * @param {Image} logo
 * @param {Image} source
 * @param {Image} target
 * @param {string} label
 * @param {boolean} isObject
 * @returns {{isObject, logo, source, label, target}}
 */
const representationGenerator = ( logo, source, target, label, isObject ) => {
  return {
    logo: logo,
    source: source,
    target: target,
    label: label,
    isObject: isObject
  };
};

const SourceObjectRepresentation = Enumeration.byMap( {
  PENCIL: representationGenerator( pencilImage, pencil3dImage, pencil3dReversedImage, pencilString, true ),
  TREE: representationGenerator( treeImage, tree3dImage, tree3dReversedImage, treeString, true ),
  ROCKET: representationGenerator( rocketImage, rocket3dImage, rocket3dReversedImage, rocketString, true ),
  LIGHT: representationGenerator( lampRedImage, lampBlueImage, screen3dImage, lightString, false )
} );


geometricOptics.register( 'SourceObjectRepresentation', SourceObjectRepresentation );
export default SourceObjectRepresentation;
