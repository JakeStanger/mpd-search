import React, { useEffect, useRef } from 'react';
import './Result.scss';
import IResultProps from './IResultProps';
import { isAlbum, isTrack } from '../../types/Type';
import { remote } from 'electron';

const con = remote.getGlobal('console');

function isInViewPort(elem: HTMLDivElement) {
  const bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

const Result: React.FC<IResultProps> = ({ result, selected }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected && container.current && !isInViewPort(container.current)) {
      const yOffset = -55;
      const y =
        container.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y });
    }
  }, [selected]);

  return (
    <div
      ref={container}
      className={`result ${selected ? 'selected' : ''}`}
      onClick={() => {
        con.log(result);
        // win.close();
      }}
    >
      <div>
        <img
          src={'https://via.placeholder.com/150'}
          alt={result.name}
          draggable={false}
        />
      </div>
      <div className={'content'}>
        <div>{result.name}</div>
        <div>{result.type}</div>
        {isTrack(result) && <div>{result.album}</div>}
        {(isTrack(result) || isAlbum(result)) && <div>{result.artist}</div>}
        {isTrack(result) && (
          <>
            <div>Track {result.track}</div>
            {!isNaN(result.disc) && <div>Disc {result.disc}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default Result;
