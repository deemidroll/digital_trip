var Gith = require('./lib/gith.js');

var gith = Gith.create();

var json = require( './test/payloads/create-branch-with-files.json' );

gith({
  repo: 'danheberden/payloads',
  branch: /merge/,
  file: 'README.md'
}).on( 'all', function( payload ) {
  console.log( 'worked' );
});

gith.payload( json );

