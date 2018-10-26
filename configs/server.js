//important: first value in the array is considered as default value for the property
//this file is visible to the server-side
export default {
    serverPort: [4000],
    sparqlEndpoint: {
        'generic': {
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso'
        },
        'http://demo.ld-r.org/d1540392312' :{
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso', graphName:'https://slidewiki.org'
        },
        'http://demo.ld-r.org/d1540392312-deckRevisions' :{
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso', graphName:'https://slidewiki.org'
        },
        'http://demo.ld-r.org/d1540392312-decks' :{
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso', graphName:'https://slidewiki.org'
        },
        'http://demo.ld-r.org/d1540392312-questions' :{
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso', graphName:'https://slidewiki.org'
        },
        'http://demo.ld-r.org/d1540392312-slideRevisions' :{
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso', graphName:'https://slidewiki.org'
        },
        'http://demo.ld-r.org/d1540392312-slides' :{
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso', graphName:'https://slidewiki.org'
        },
        'http://demo.ld-r.org/d1540392312-tags' :{
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso', graphName:'https://slidewiki.org'
        },
        'http://demo.ld-r.org/d1540392312-usergroups' :{
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso', graphName:'https://slidewiki.org'
        },
        'http://demo.ld-r.org/d1540392312-users' :{
            host: '145.100.58.198', port: 8890, path: '/sparql', endpointType: 'virtuoso', graphName:'https://slidewiki.org'
        },
    },
    dbpediaLookupService: [
        { host: 'lookup.dbpedia.org' }
    ],
    dbpediaSpotlightService: [
        { host: 'model.dbpedia-spotlight.org', port: 80, path: '/en/annotate' }
    ],
    //it is used only if you enabled recaptcha feature for user authentication
    //get keys from https://www.google.com/recaptcha
    googleRecaptchaService: {
        siteKey: ['put your google recaptcha site key here...'],
        secretKey: ['put your google recaptcha secret key here...']
    }
};
