// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsControlPanel is the main control panel for both screens.
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import VSeparator from '../../../../sun/js/VSeparator.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Optic from '../model/Optic.js';
import RayModeRadioButtonGroup from './RayModeRadioButtonGroup.js';
import VisibilityCheckboxGroup from './VisibilityCheckboxGroup.js';
import VisibleProperties from './VisibleProperties.js';

// constants
const NUMBER_CONTROL_OPTIONS = {
  layoutFunction: NumberControl.createLayoutFunction3( { ySpacing: 12 } ),
  titleNodeOptions: {
    font: GeometricOpticsConstants.CONTROL_FONT,
    maxWidth: 140
  },
  sliderOptions: {
    trackSize: new Dimension2( 120, 4 ),
    thumbSize: new Dimension2( 10, 20 )
  },
  numberDisplayOptions: {
    maxWidth: 70
  }
};

class GeometricOpticsControlPanel extends Panel {

  /**
   * @param {Optic} optic
   * @param {EnumerationProperty.<LightRayMode>} lightRayModeProperty
   * @param {VisibleProperties} visibleProperties
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( optic, lightRayModeProperty, visibleProperties, modelViewTransform, options ) {

    assert && assert( optic instanceof Optic );
    assert && assert( lightRayModeProperty instanceof EnumerationProperty );
    assert && assert( visibleProperties instanceof VisibleProperties );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {

      // Panel options
      xMargin: 15,
      yMargin: 10,
      fill: 'rgb( 240, 240, 240 )'
    }, options );

    // Rays radio buttons ---------------------------------------------------------------------------------------

    // create title for radio button group for light ray mode
    const rayModeTitle = new Text( geometricOpticsStrings.rayModeTitle, {
      font: GeometricOpticsConstants.TITLE_FONT,
      maxWidth: 100
    } );

    // create button radio group for the light ray mode
    const rayModeRadioButtonGroup = new RayModeRadioButtonGroup( lightRayModeProperty );

    // create vertical box for ray modes
    const rayModesBox = new VBox( {
      children: [ rayModeTitle, rayModeRadioButtonGroup ],
      align: 'left',
      spacing: 4
    } );

    // Lens/Mirror controls ---------------------------------------------------------------------------------------

    const numberControls = [];

    // create number control for the radius of curvature of optical element
    const curvatureRadiusControl = new NumberControl(
      geometricOpticsStrings.curvatureRadius,
      optic.radiusOfCurvatureProperty,
      optic.radiusOfCurvatureProperty.range,
      merge( {}, NUMBER_CONTROL_OPTIONS, {
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.CURVATURE_RADIUS_DECIMAL_PLACES,
          valuePattern: geometricOpticsStrings.valueCentimetersPattern
        }
      } ) );
    numberControls.push( curvatureRadiusControl );

    if ( optic.type === Optic.Type.LENS ) {
      const refractiveIndexControl = new NumberControl(
        geometricOpticsStrings.refractiveIndex,
        optic.indexOfRefractionProperty,
        optic.indexOfRefractionProperty.range,
        merge( {}, NUMBER_CONTROL_OPTIONS, {
          delta: 0.01,
          numberDisplayOptions: {
            decimalPlaces: GeometricOpticsConstants.REFRACTIVE_INDEX_DECIMAL_PLACES
          }
        } ) );
      numberControls.push( refractiveIndexControl );
    }

    // create number control for the diameter of optical element
    const diameterControl = new NumberControl(
      geometricOpticsStrings.diameter,
      optic.diameterProperty,
      optic.diameterProperty.range,
      merge( {}, NUMBER_CONTROL_OPTIONS, {
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.DIAMETER_DECIMAL_PLACES,
          valuePattern: geometricOpticsStrings.valueCentimetersPattern
        }
      } ) );
    numberControls.push( diameterControl );

    // Visibility checkboxes ---------------------------------------------------------------------------------------

    const checkboxGroup = new VisibilityCheckboxGroup( visibleProperties, optic.type );

    // Put it all together ---------------------------------------------------------------------------------------

    // Vertical separators between sections of the control panel
    const separatorLength = Math.max( checkboxGroup.height, rayModesBox.height );
    const separatorOptions = { stroke: 'gray', lineWidth: 1 };
    const leftSeparator = new VSeparator( separatorLength, separatorOptions );
    const rightSeparator = new VSeparator( separatorLength, separatorOptions );

    const content = new AlignBox( new HBox( {
        children: [ rayModesBox,
          leftSeparator,
          ...numberControls,
          rightSeparator,
          checkboxGroup ],
        spacing: 20,
        align: 'center'
      } ),
      { xAlign: 'left' }
    );

    super( content, options );
  }
}

geometricOptics.register( 'GeometricOpticsControlPanel', GeometricOpticsControlPanel );
export default GeometricOpticsControlPanel;