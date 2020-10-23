const test = require( "ava" );
const add = require("./library")

// TO BE UPDATED

test( "should return 4 when adding 2 + 2", t => {
    t.is( add(2,2), 4 );
} );

test( "should return 0 when adding zeros", t => {
    t.is( add(0,0), 0 );
} );
