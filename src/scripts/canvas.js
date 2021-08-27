
import d3 from 'd3';
import React from 'react';

/**
 * @module Amelie
 * @submodule Canvas
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Amelie
 */
export default Canvas = React.createClass({

    /**
     * @method componentDidMount
     * @return {void}
     */
    componentDidMount() {
        // Configure the D3 SVG component.
        const d3Element = d3.select(this.getDOMNode())
            .append('svg')
            .attr('width', this.state.size[0])
            .attr('height', this.state.size[1])
            .append('g');

        this.getDOMNode().style.width = this.state.size[0] + 'px';
        this.getDOMNode().style.height = this.state.size[1] + 'px';

        /**
         * Responsible for generating the greyscale colours for the circle.
         *
         * @return {Function}
         * @constructor
         */
        const ColourGenerator = function ColourGenerator() {

            const cache = [];

            return function (index) {

                if (!cache[index]) {
                    // Generate a random set of RGB values for the current circle.
                    const random = Math.round((Math.random() * 255));
                    cache[index] = 'rgb(' + random + ', ' + random + ', ' + random + ')';
                }

                return cache[index];
            };
        };

        this.setState({d3: d3Element, colours: new ColourGenerator()});
    },

    /**
     * @method componentWillReceiveProps
     * @param nextProps {Object}
     * @return {void}
     */
    componentWillReceiveProps(nextProps) {
        if (this.state.circles.length === 0 && nextProps.fftSize) {
            // We know the `fftSize` and can therefore pre-render the required number of
            // circles to quicken the rendering.
            this.setState({circles: this.createCircles(nextProps.fftSize)});
        }
    },

    /**
     * @method createCircles
     * @param amountOfCircles {Number}
     * @return {Array}
     */
    createCircles(amountOfCircles) {
        const circles = [];

        for (let index = 0; index < amountOfCircles; index++) {
            circles.push(this.state.d3.append('circle'));
        }

        return circles;
    },

    /**
     * @method getInitialState
     * @return {Object}
     */
    getInitialState() {
        return {
            circles: [], colours: function noop() {
            }, size: [400, 400]
        };
    },

    /**
     * @method renderCircles
     * @param frequencyData {Uint8Array}
     * @return {void}
     */
    renderCircles(frequencyData) {
        if (this.state.circles.length === 0) {
            // Circles haven't yet been pre-rendered and therefore we're unable to go
            // any further.
            return;
        }

        const colours = this.state.colours,
            positions = this.computeCxCy();

        let index = 0, maxLength = frequencyData.length;
        for (; index < maxLength; index++) {

            this.state.circles[index].attr('cx', positions.cx).attr('cy', positions.cy)
                .attr('r', frequencyData[index] / 2.5)
                .style('fill', colours(index));
        }

        // Create the mini little circles.
        this.renderSplodges(frequencyData);
    },

    /**
     * @method computeCxCy
     * @return {Object}
     */
    computeCxCy() {
        return {cx: this.state.size[0] - 110, cy: this.state.size[1] - 110};
    },

    /**
     * @method renderSplodges
     * @param frequencyData {Uint8Array}
     * @return {void}
     */
    renderSplodges(frequencyData) {
        const positions = this.computeCxCy(),
            length = frequencyData.length,
            trebleParts = (length - (length / 4)),
            trebleArray = Array.prototype.slice.call(frequencyData).splice(length - trebleParts),
            trebleSegment = trebleArray.reduce(function reduce(currentValue, value) {
                return currentValue + value;
            }, 0);
        if (trebleSegment !== 0) {
            positions.cx += (Math.random() * 190) - 95;
            positions.cy += (Math.random() * 190) - 95;

            const circle = this.state.d3.append('circle').attr('cx', positions.cx).attr('cy', positions.cy)
                .attr('r', trebleSegment / 40).style('fill', this.getRandomColour());

            circle.transition().attr('r', 0).duration(500).remove();
        }
    },

    /**
     * @method getRandomColour
     * @return {String}
     */
    getRandomColour() {
        const colours = ['267831', 'B1B541', 'FFCD36', 'D60404', '1F0404'];
        return '#' + colours[Math.floor(Math.random() * colours.length)];
    },

    /**
     * @method positionDOMElement
     * @param cursorData {Object}
     * @return {void}
     */
    positionDOMElement(cursorData) {
        this.getDOMNode().style.left = (cursorData.x - (this.state.size[0] / 2)) + 'px';
        this.getDOMNode().style.top = (cursorData.y - (this.state.size[1] / 2)) + 'px';
    },

    /**
     * @method render
     * @return {*}
     */
    render() {
        if (this.props.frequencyData) {
            // We're ready to begin rendering the circles for this particular canvas element.
            this.renderCircles(this.props.frequencyData);

            if (this.state.d3) {
                this.positionDOMElement(this.props.cursor);
            }
        }

        return (
            <div className="canvas-container"/>
        );
    }
});