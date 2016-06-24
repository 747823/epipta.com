// Jquery
window.$ = window.jQuery = require( "jquery" );

// Scrollbar plugin
require( "./jquery.trackpad-scroll-emulator.min.js" );

require( "./renderer.js" );

( function() {

	// Scrollbar setup
	$( document ).ready( function() {
		$( ".tse-scrollable" ).each( function() {
			$( this ).TrackpadScrollEmulator({ wrapContent: false });
		} );
	} );

} )();