/**
 * text ellipsis plugin
 *
 * this plugin is used to do a text-ellipsis with multiple text lines the amazing way...
 *
 * usage:
 *
 * textEllipsis.getTrimmedText("A collaboration between Markes and the German Federal Institute for Materials Research
 * and Testing (BAM) has resulted in a new test scheme, featuring", 3, 221, "16px Georgia, 'Times New Roman', Times, serif")
 *
 * will return:
 *
 * "A collaboration between Markes and the German Federal Institute for ..."
 *
 */

define([
   "jquery"
   , "underscore.string"
], function($) {

	var textEllipsis = function() {

		var
			me = this
			, s = {
				$canvas : ''
				, ctx : ''
				, ellipsis : "..."
			};

			// check if canvas is supported
		function isCanvasSupported(){
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		}


		function initialize() {
			if (isCanvasSupported()) {
				$('body').append('<canvas id="bJS_textEllipsisCanvas" width="300" height="150" style="display:none;"></canvas>');
				s.$canvas = $('#bJS_textEllipsisCanvas');
				s.ctx = s.$canvas[0].getContext("2d");
			}
			return me;
		}

			/**
			 * get trimmed text
			 *
			 * @param text
			 * @param linesToShow
			 * @param containerWidth
			 * @param font i.e. "12px Arial"
			 */
		me.getTrimmedText = function(text, linesToShow, containerWidth, font) {
			if (!isCanvasSupported()) { return text; }
			var
				text    = _.str.words(text)
				, index = 0;

				// set font for canvas
			s.ctx.font = font;

			for (i=0; i < linesToShow; i++) {
				var textLine = text[index];

				do {
					index++;
					textLine = _.str.join(" ", textLine, text[index]);
					if (index == text.length) { break; }
				}
					// take care for the ellipsis ("...") on the last line
				while ((i+1 == linesToShow ? (s.ctx.measureText(textLine).width + s.ctx.measureText(s.ellipsis).width) : s.ctx.measureText(textLine).width) < containerWidth);
					// reset text line
				textLine = "";
			}

				// build trimmed string
			var trimmedText = "";
			for (i=0; i < index; i++) {
				trimmedText = _.str.join(" ", trimmedText, text[i]);
			}

				// add "..." if the text is trimmed
			if (index < text.length) {
				trimmedText = _.str.join(" ", trimmedText, s.ellipsis);
			}

			return _.str.ltrim(trimmedText);
		};


			/**
			 * count text lines for a text in a container with a fixed with
			 * @param text
			 * @param containerWidth
			 * @param font
			 */
		me.getLinesForText = function(text, containerWidth, font) {
			if (!isCanvasSupported()) { return 3; }

			var
				text    = _.str.words(text)
				, lines = 0, index = 0;

				// set font for canvas
			s.ctx.font = font;

			do {
				var textLine = text[index];
				do {
					index++;
					textLine = _.str.join(" ", textLine, text[index]);
					if (index == text.length) { break; }
				}
				while (s.ctx.measureText(textLine).width < containerWidth);
				lines++;
			}
			while (index < text.length);

			return lines;
		};


			/**
			 * trim text after X words
			 *
			 * @param text
			 * @param count
			 * @returns {*}
			 */
		me.getTextTrimmedByWordCount = function(text, count) {
			if (!isCanvasSupported()) { return text; }
			var
				textString   = ""
				, originText = text
				, text       = _.str.words(text);


			if (text.length > count) {
				_.each(text.slice(0,count), function(value) {
					textString = _.str.join(" ", textString, value);
				});
				return _.str.trim(_.str.join(" ", textString, "..."));
			} else {
					// no text cropping is needed
				return originText;
			}
		};


		return initialize();
	};


	return textEllipsis;
});