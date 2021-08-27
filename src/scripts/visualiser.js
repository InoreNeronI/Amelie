
import React from 'react';
import Canvas from './canvas';

/**
 * @module Amelie
 * @submodule Visualiser
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Amelie
 */
export default Visualiser = React.createClass({

    /**
     * @method componentWillReceiveProps
     * @param nextProps {Object}
     * @return {void}
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.analyser) {
            // We have the `AnalyserNode` and therefore we're ready to analyse the
            // audio track.
            this.analyseAudioStream(nextProps.analyser);
        }
    },

    /**
     * @method getInitialState
     * @return {Object}
     */
    getInitialState() {
        return {cursor: {x: 0, y: 0}, frequencyData: []};
    },

    /**
     * @method analyseAudioStream
     * @param analyser {AnalyserNode}
     * @return {void}
     */
    analyseAudioStream(analyser) {
        // Round and round we go...
        (requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame)(function () {
            this.analyseAudioStream.call(this, analyser);
        }.bind(this));

        // Analyse the frequency data for the current audio track!
        const frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);

        // Define the items required to create the visualisation...
        this.setState({frequencyData: frequencyData, fftSize: analyser.fftSize});
    },

    /**
     * @method setCursorPosition
     * @param event {Object}
     * @return {void}
     */
    setCursorPosition(event) {
        this.setState({cursor: {x: event.clientX, y: event.clientY}});
    },

    /**
     * @method render
     * @return {*}
     */
    render() {
        return (
            <section className="visualiser" onMouseMove={this.setCursorPosition}>
                <Canvas frequencyData={this.state.frequencyData} cursor={this.state.cursor}
                        fftSize={this.state.fftSize}/>
            </section>
        );
    }
});