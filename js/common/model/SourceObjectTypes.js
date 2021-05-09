// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration for the different curvature types of optical elements
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import geometricOptics from '../../geometricOptics.js';

import rocket_3d_png from '../../../images/rocket_3d_png.js';
import rocket_png from '../../../images/rocket_png.js';
import rocket_3d_png_reversed from '../../../images/rocket_3d_png_reversed.js';
import lamp_red_png from '../../../images/lamp_red_png.js';
//import lamp_blue_png from '../../../images/lamp_blue_png.js';
import pencil_png from '../../../images/pencil_png.js';
import pencil_3d_png from '../../../images/pencil_3d_png.js';
import pencil_3d_reversed_png from '../../../images/pencil_3d_reversed_png.js';
import tree_png from '../../../images/tree_png.js';
import tree_3d_png from '../../../images/tree_3d_png.js';
import tree_3d_reversed_png from '../../../images/tree_3d_reversed_png.js';

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
const typeGenerator = ( logo, source, target, label, isObject ) => {
  return {
    logo: logo,
    source: source,
    target: target,
    label: label,
    isObject: isObject
  };
};

const SourceObjectTypes = Enumeration.byMap( {
  PENCIL: typeGenerator( pencil_png, pencil_3d_png, pencil_3d_reversed_png, pencilString, true ),
  TREE: typeGenerator( tree_png, tree_3d_png, tree_3d_reversed_png, treeString, true ),
  ROCKET: typeGenerator( rocket_png, rocket_3d_png, rocket_3d_png_reversed, rocketString, true ),
  LIGHT: typeGenerator( lamp_red_png, lamp_red_png, lamp_red_png, lightString, false )
} );


geometricOptics.register( 'SourceObjectTypes', SourceObjectTypes );
export default SourceObjectTypes;
