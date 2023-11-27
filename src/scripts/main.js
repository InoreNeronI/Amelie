import { render } from 'react-dom';
import Audio from './audio';

// It's time to throw everything to the devil and go to Kislovodsk...
const node = document.querySelector('#root');
render(<Audio audio={node.getAttribute('data-audio')} />, node);

import './player';
