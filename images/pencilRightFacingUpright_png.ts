/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;