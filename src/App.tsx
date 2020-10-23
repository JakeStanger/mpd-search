import 'regenerator-runtime/runtime';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import './styles/GlobalStyle.scss';
import MPD from './services/MPD';
import Result from './components/result/Result';
import { remote } from 'electron';
import { Song } from 'mpc-js';
import IAlbum from './types/IAlbum';

const con: Console = remote.getGlobal('console');

async function init() {
  const mainElement = document.createElement('div');
  mainElement.setAttribute('id', 'root');
  document.body.appendChild(mainElement);

  const client = await MPD.connect();

  render(<App client={client} />, mainElement);
}

const App: React.FC<{ client: MPD }> = ({ client }) => {
  const searchBox = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    artists: string[];
    albums: IAlbum[];
    tracks: Song[];
  }>({
    artists: [],
    albums: [],
    tracks: []
  });
  const [selectedResult, setSelectedResult] = useState(-1);

  const onKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      // scroll down
      // if (ev.key === 'ArrowDown' && selectedResult < results.length - 1) {
      //   ev.preventDefault();
      //   setSelectedResult(selectedResult + 1);
      //
      //   searchBox.current?.blur();
      // }
      //
      // // scroll up
      // else if (ev.key === 'ArrowUp' && selectedResult > -1) {
      //   ev.preventDefault();
      //   setSelectedResult(selectedResult - 1);
      //
      //   if (selectedResult - 1 === -1) {
      //     searchBox.current?.focus();
      //     searchBox.current?.setSelectionRange(query.length, query.length);
      //   }
      // }
      //
      // // // scroll to top
      // // else if (ev.key === 'Home') {
      // //   ev.preventDefault();
      // //   setSelectedResult(-1);
      // //   searchBox.current?.focus();
      // //   searchBox.current?.setSelectionRange(query.length, query.length);
      // // }
      // //
      // // // scroll to bottom
      // // else if (ev.key === 'End') {
      // //   ev.preventDefault();
      // //   searchBox.current?.blur();
      // //   setSelectedResult(results.length - 1);
      // // }
      // //
      // // // select result
      // // else if (ev.key === 'Enter' && selectedResult > -1) {
      // //   con.log(results[selectedResult]);
      // // }
      // //
      // // // close on escape press
      // // else if (ev.key === 'Escape') {
      // //   const win = remote.getCurrentWindow();
      // //   win.close();
      // // }
    },
    [results, selectedResult]
  );

  // key press handler
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedResult, onKeyDown]);

  const onQueryChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(ev.target.value);
      if (ev.target.value.length >= 3) {
        client.search(ev.target.value).then(setResults);
      } else {
        setResults({ artists: [], albums: [], tracks: [] });
      }
    },
    []
  );

  console.log(results);

  return (
    <div>
      <input
        ref={searchBox}
        className={'search-box'}
        value={query}
        onChange={onQueryChange}
        autoFocus
      />
      <div className={'results'}>
        {!!results.artists.length && (
          <div className={'artists'}>
            <h2>Artists</h2>
            {results.artists.map((artist) => (
              <div key={artist}>{artist}</div>
            ))}
          </div>
        )}
        {!!results.albums.length && (
          <div className={'artists'}>
            <h2>Albums</h2>
            {results.albums.map((album) => (
              <div key={album.name} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600 }}>{album.name}</div>
                <div>{album.artist}</div>
              </div>
            ))}
          </div>
        )}
        {!!results.tracks.length && (
          <div className={'artists'}>
            <h2>Tracks</h2>
            {results.tracks.map((song) => (
              <div key={song.path} style={{ marginBottom: 10, display: 'flex' }}>
                <div>
                  <img src={`data:image/jpeg;base64,${client.getAlbumArt(song.path)}`} width={200} height={200} draggable={false} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{song.title}</div>
                <div>{song.album}</div>
                <div>{song.artist}</div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      {/*<div className={'results'}>*/}
      {/*  {results.map((res, i) => (*/}
      {/*    <Result result={res} key={i} selected={i === selectedResult} />*/}
      {/*  ))}*/}
      {/*</div>*/}
    </div>
  );
};

init().catch(console.error);
