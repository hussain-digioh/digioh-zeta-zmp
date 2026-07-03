// ZMP Mock — add to WordPress page header or footer
window.zt_wp = {
	segment: ['travel'],
	score: {
    	data: {
        	site_score: 85,
        	top_products: {
            	'interest_leave_intent': 75,
            	'interest_sidebar': 25,
            	'interest_inline': 10
        	}
    	}
	}
};
window.bt = function(action, eventType, payload) {
	console.log('[ZMP Mock] bt called:', action, eventType, payload);
};
// Poll for Digioh API then trigger ZMP init chain
var _zmpMock = setInterval(function() {
	if (window.DIGIOH_API && typeof window.DIGIOH_API.tryInitDigiohZmpApp === 'function') {
    	clearInterval(_zmpMock);
    	window.DIGIOH_API.zmp_started_init = false; // reset so first-call path runs
        window.DIGIOH_API.tryInitDigiohZmpApp();
	}
}, 100);
