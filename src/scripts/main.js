
import React from 'react';
import Audio from './audio';

// It's time to throw everything to the devil and go to Kislovodsk...
const node = document.querySelector('#root');
React.render(<Audio audio={node.getAttribute('data-audio')} />, node);

require('./player');