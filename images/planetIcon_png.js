/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;