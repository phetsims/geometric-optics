/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAACXBIWXMAABcRAAAXEQHKJvM/AAADCElEQVRoge2a3ZHaMBSFv2RSgEtwZiiADlapIOSBd5dACdsBJUAqgK3A2QpIB6YDtoPkQWYwRle6siXMbnJmNMwIy0fHvn+SDB8Yn+7INQcK4A34fUferCiAGvjTaXXb/+7xzLWwc9vkJv6cmwB4EvrL3MT3ECfB5CaYUlx2TCnumJtAK67CRrgaGwhSRLoy4toCG5hqYNfOJwnW3Ea6EzZvadBPA92mwRxoHGPXyvFeSBPTCpTE1Yqx85Zn0MMJmaXx/HdOziGBr5H9Z8wJJ3sTuEcQ0lPrvkHfBIZUKAX+N3Zuo33f5XNDqo059klrTHmj4EzicxqyJhVRC18Q0vprFHwCU5P5xB3IVHRLAlcpSWaz2UrgCfnqaPR9MJntT8RzgwIbHEJP0WDfdj8JN22/UXBprrkrSsJBoWtq5RSTHIJQVSHlSm05NxmGCHs3Ag8ME5YrXyZDxThh51almlB/a69Cdu43YNv+unAgjVkdga/CfwV2jlKUPmLneAONSUl+USrGxrTSwaH155sKRqoIpNDdh0kszjg4dhHjV3BZzz05bibBRZwaLutYRIz/Dhdxkh+5EHPtULg4YniPcBH3M2LgPuLaoTg6+rYR41/6HRVhh62RI1VKn3NxFOgWzs/nAa5THiNM/oh/r3FHnF9I2AM/PP8XyCnnVwJ+Jwz5IuVDYMM4Ybv7T1mPguH1Zbbtg5RwbeVpCoOHF9ZFhXsbvNsaEhbKfQw5Ey+wUbHERs89/gS7wEa3bhX0ij0XD+XMKoJnNFyHEg3pTcrlu1kXs76qfJOYS0rWWQSGlht1Yj5fQFIL1Bw+ljxWNNOeLvFFcbMNYWGh46iS66i4xV/KvRA+PlsD3wK8QYRylNfflsuly6Q1pqWpdsoBeq4wtqqQJqkptUICRwcXKRFryyUpOByU/JLARq3AA8OtWcWEfl/k06Iv8ESa5RVgbXuFXQjGmoIk7hRzE2OMaflXPNDZQoo3Nwj/P4/KhOy7aFOK+xBfyy5w+1s14ZySYsUlXzYk/kDgn8RfWgFjIYoRFSsAAAAASUVORK5CYII=';
export default image;