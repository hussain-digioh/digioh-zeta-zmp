// Mock Zeta ZMP environment for Digioh QA testing
// Edit the scores below to change which interest gets preselected
window.zt_wp = {
    score: {
        data: {
            site_score: 47,
            top_products: {
                interest_sidebar: 80,
                interest_leave_intent: 60,
                interest_inline: 20
            }
        }
    },
    segment: ['SEGMENT_TEST_1']
};

// Mock bt() — logs to browser console instead of sending to Zeta
window.bt = function(action, eventType, payload) {
    console.log(
        '[ZMP bt mock] action=' + action + ' | type=' + eventType,
        JSON.stringify(payload, null, 2)
    );
};
