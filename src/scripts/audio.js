
import React from 'react';
import Visualizer from './visualizer';

/**
 * @module Amelie
 * @submodule Audio
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Amelie
 */
const Audio = React.createClass({
    /**
     * @method componentDidMount
     * @return {void}
     */
    componentDidMount() {
        // Once the component has been rendered we can listen for the "canplay" event to setup
        // the audio context to begin analysing the audio stream.
        this.getElement().addEventListener('canplay', this.configureAudioContext);
    },

    /**
     * @method getInitialState
     * @return {Object}
     */
    getInitialState() {
        return {analyser: null};
    },

    /**
     * @method getElement
     * @return {HTMLElement}
     */
    getElement() {
        return this.getDOMNode().querySelector('audio');
    },

    /**
     * @method configureAudioContext
     * @return {void}
     */
    configureAudioContext() {
        // Dependencies for analysing the audio stream.
        const ContextClass = (AudioContext || mozAudioContext || webkitAudioContext || oAudioContext || msAudioContext);

        if (!ContextClass) {
            // AudioContext API isn't supported.
            throw "AudioContext API unavailable in current browser. Please try another!";
        }

        // Audio context instantiation.
        const context = new ContextClass(), analyser = context.createAnalyser();

        // Route the audio source through our visualizer.
        const source = context.createMediaElementSource(this.getElement());
        source.connect(analyser)

        // Create the analyser object and specify its FFT size in bytes.
        analyser.connect(context.destination);
        analyser.fftSize = 128;

        // ...And now we can begin the visualization rendering!
        this.setState({analyser: analyser});
    },

    /**
     * @method render
     * @return {*}
     */
    render() {
        return (
            <section className="main">
                <audio>
                    <source src={this.props.audio}/>
                </audio>
                <Visualizer analyser={this.state.analyser}/>
            </section>
        );
    }
});

export default Audio;