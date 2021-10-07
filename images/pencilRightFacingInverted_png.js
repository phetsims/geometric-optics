/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;