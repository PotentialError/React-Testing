import React from 'react';
import 'w3-css/w3.css';
import ReactDOM from 'react-dom/client';
import './index.css';
//File Holding app info
import { codes } from './codes.js';

function ArtistBlock(props) {
    return (
        <div className='w3-quarter w3-padding' height='100%'>
            <div className='w3-hover-shadow'>
                <img src={props.image} alt={props.name} width='100%'/>
                <div className='w3-center w3-red w3-container w3-cell-middle'>
                    <p className="w3-sans-serif w3-xlarge">{props.name}</p>
                </div>
            </div>
        </div>
        
    );
}
function TopArtists(props) {
    const elements = [];
    const rows = [];
    for(let i = 0; i < props.list.length; i++) {
        elements.push(<ArtistBlock key={i} name={props.list[i].name} image={props.list[i].image}></ArtistBlock>);
        if((i+1) % 4 === 0) {
            rows.push(<div className='w3-row' key={rows.length}>{elements.slice(-4)}</div>);
        }
    }
    if(props.list.length % 4 !== 0) {
        rows.push(<div className='w3-row' key={rows.length}>{elements.slice(-(props.list.length % 4))}</div>);
    }
    return (
        <div>{rows}</div>
    );
}
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  var authorization = 'Basic ' + btoa(codes.client_id + ':' + codes.client_secret);
  const ids = ['73rPcaYEhBd0UuVZBqqyQJ', '6wFwvxJkurQPU2UdeD4qVt', '6RCI4WXRwG9jnRHZgzBYFr', '6NgYKD0TKGjwtRFqTyyqKF', '7uwY65fDg3FVJ8MkJ5QuZK', '4iMO20EPodreIaEl8qW66y'];
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Authorization': authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        'grant_type': 'client_credentials'
    }),
    json: true
  }).then((response) => response.json().then((data) => getStuff(data.access_token, ids)));
  async function getArtistNameImage(accessToken, id) {
    let result = await fetch('https://api.spotify.com/v1/artists/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        }
      }).then((response) => response.json());
      var image = 0;
      console.log(result.name + ' ' + result.images[image].height + ' ' + result.images[image].width);
      while(result.images[image].height !== result.images[image].width) {
        console.log('Not equal!')
        image++;
      }
      return {name: result.name, image: result.images[image].url};
  }
  function getStuff(accessToken, ids) {
    const promises = [];
    for(let i = 0; i < ids.length; i++) {
        promises.push(getArtistNameImage(accessToken, ids[i]));
    }
    Promise.all(promises).then((results) => root.render(<TopArtists list={results}/>));
    
  }
