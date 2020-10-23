import { Result } from '../../services/Search';
import IArtist from '../../types/IArtist';
import IAlbum from '../../types/IAlbum';
import ITrack from '../../types/ITrack';

interface IResultProps {
  result: Result<IArtist> | Result<IAlbum> | Result<ITrack>;
  selected: boolean;
}

export default IResultProps;