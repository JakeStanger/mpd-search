import IArtist from './IArtist';
import IAlbum from './IAlbum';
import ITrack from './ITrack';
import { Result } from '../services/Search';

enum Type {
  Artist = 'Artist',
  Album = 'Album',
  Track = 'Title',
  Index = 'Track',
  Disc = 'Disc'
}

export function isArtist(
  result: Result<IArtist> | Result<IAlbum> | Result<ITrack>
): result is Result<IArtist> {
  return result.type == Type.Artist;
}

export function isAlbum(
  result: Result<IArtist> | Result<IAlbum> | Result<ITrack>
): result is Result<IAlbum> {
  return result.type == Type.Album;
}

export function isTrack(
  result: Result<IArtist> | Result<IAlbum> | Result<ITrack>
): result is Result<ITrack> {
  return result.type == Type.Track;
}

export default Type;
