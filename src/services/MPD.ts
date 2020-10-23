import { MPC, Song } from 'mpc-js';
import IArtist from '../types/IArtist';
import Type from '../types/Type';
import IAlbum from '../types/IAlbum';
import ITrack from '../types/ITrack';
import { uniqBy } from 'lodash';
// import { readFile } from 'fs/promises';
import { readFileSync, existsSync } from 'fs';
import * as path from 'path';

class MPD {
  private mpc: MPC;

  private constructor() {
    this.mpc = new MPC();
  }

  public static async connect(
    hostname = 'localhost',
    port = 6600
  ): Promise<MPD> {
    const client = new MPD();
    await client.mpc.connectTCP(hostname, port);

    client.getAlbumArt(
      'King Crimson/Starless and Bible Black/Stereo Mix/04 - .flac'
    );

    return client;
  }

  public async search(query: string, albumArtist = false) {
    return {
      artists: await this.searchArtists(query, albumArtist),
      albums: await this.searchAlbums(query),
      tracks: await this.searchTracks(query)
    };
  }

  public async searchArtists(
    query: string,
    albumArtist: boolean
  ): Promise<string[]> {
    return Array.from(
      new Set(
        await this.mpc.database
          .search([[albumArtist ? 'AlbumArtist' : 'Artist', query]])
          .then((songs) =>
            songs.map((song) =>
              albumArtist ? song.albumArtist! : song.artist!
            )
          )
      )
    );
  }

  public async searchAlbums(query: string): Promise<IAlbum[]> {
    const directories: Record<string, Set<string>> = {};

    const albums: IAlbum[] = uniqBy(
      await this.mpc.database.search([['Album', query]]).then((songs) =>
        songs.map((song) => {
          if (!directories[song.album!]) {
            directories[song.album!] = new Set();
          }
          directories[song.album!].add(path.dirname(song.path));
          return { name: song.album!, artist: song.artist!, directories: [] };
        })
      ),
      'name'
    );

    return albums.map((album) => ({
      ...album,
      directories: Array.from(directories[album.name])
    }));
  }

  public async searchTracks(query: string): Promise<Song[]> {
    return await this.mpc.database.search([['Title', query]]);
  }

  public getAlbumArt(uri: string) {
    const MUSIC_DIRECTORY = '/home/jake/Music';
    const cover = path.join(MUSIC_DIRECTORY, path.dirname(uri), 'cover.jpg');

    if (existsSync(cover)) {
      const base64 = readFileSync(cover, { encoding: 'base64' });
      return base64;
    } else {
      console.error(cover);
    }

    // const image = new Image();
    // image.src = 'data:image/jpeg;base64,' + base64;
    // document.body.append(image);

    // while (!existsSync(cover)) {
    //   path.basename(path.dirname(filename))
    // }

    // // let artString = '';
    // // let [length, chunk, binary] = await this.getAlbumArtChunk(uri, 0);
    // // artString += binary;
    // //
    // // console.log('length', length);
    // //
    // // let total = chunk;
    // // while (total < length) {
    // //   [length, chunk, binary] = await this.getAlbumArtChunk(uri, total);
    // //   artString += binary;
    // //   total += chunk;
    // //
    // //   // console.log(chunk, total, length);
    // // }
    // //
    // // console.log(artString.length)
    // //
    // // function b64EncodeUnicode(str: string) {
    // //   // first we use encodeURIComponent to get percent-encoded UTF-8,
    // //   // then we convert the percent encodings into raw bytes which
    // //   // can be fed into btoa.
    // //   return btoa(
    // //     encodeURIComponent(str).replace(
    // //       /%([0-9A-F]{2})/g,
    // //       function toSolidBytes(match, p1) {
    // //         return String.fromCharCode(('0x' + p1) as any);
    // //       }
    // //     )
    // //   );
    // // }
    // //
    // // // console.log(b64EncodeUnicode(artString));
    // //
    // // console.log(Buffer.from(artString, 'utf8'));
    //
    // const image = new Image();
    // image.src =
    //   'data:image/jpeg;base64,' +
    //   Buffer.from(artString, 'utf-8').toString('base64');
    // document.body.append(image);

    // const textEncoder = new TextEncoder();
    // const arr = textEncoder.encode(artString);
    // console.log(btoa(String.fromCharCode.apply(null, (arr.buffer a)));
  }

  // private async getAlbumArtChunk(
  //   uri: string,
  //   offset: number
  // ): Promise<[number, number, string]> {
  //   // console.log(offset);
  //   const [length, chunk, ...binary] = await this.mpc.sendCommand(
  //     `albumart "${uri}" ${offset}`
  //   );
  //
  //   console.log(binary);
  //
  //   // console.log(offset);
  //
  //   return [
  //     parseInt(length.split(': ')[1]),
  //     parseInt(chunk.split(': ')[1]),
  //     binary.join('\n')
  //   ];
  // }
}

export default MPD;
