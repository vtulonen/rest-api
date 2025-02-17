import KoaBody from 'koa-bodyparser';

// The port that this server will run on, defaults to 9000
export const port = process.env.PORT || 9000;

// Define API path
export const apiPath = '/api/v1';

export const koaBody = new KoaBody();

export const museumsPath = `${apiPath}/museums`;
export const museumPath = `${museumsPath}/:id`;
export const museumArtworksPath = `${museumPath}/artworks`;

export const artistsPath = `${apiPath}/artists`;
export const artistPath = `${artistsPath}/:id`;
export const artistArtworksPath = `${artistPath}/artworks`;

export const artworksPath = `${apiPath}/artworks`;
export const artworkPath = `${artworksPath}/:id`;
