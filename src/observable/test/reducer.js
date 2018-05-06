import {expect} from "chai";
import Observable from "../index";
import {series} from "./utils"

describe('reduce', function () {

    it('simple1', (done) => {

        done = series(done, [
            evt => expect(evt).to.deep.equal( Observable.keyF ),
            evt => expect(evt).to.deep.equal( { n: [  ], id: 158, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( { n: [ 10, 15, ], id: 158, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( { n: [ 10, 15, 16, 17, 18, ], id: 158, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( { n: [ 10, 15, 16, 17, 18, ], id: 158, stage: 0, time: 15 } ),
            evt => expect(evt).to.deep.equal( { n: [ ], id: 159, stage: 1, time: 0 } ),
        ]);
        
        const initor = new Observable( function (emt) {
            emt.kf();
            emt({ n: [], id: 158, stage: 1, time: 0 });
        } );

        const maintainer = new Observable(function (emt) {
            emt.kf();
            emt({ action: "continue", data: [ 10, 15 ] });
            emt({ action: "continue", data: [ 16, 17, 18 ] });
            emt({ action: "end", time: 15 });
            emt({ action: "next" });
        });

        const reducer = maintainer.reducer( initor, function (acc, {action, data, time}) {

            if(action === "continue") {
                return {
                    ...acc,
                    n: [ ...acc.n, ...data ]
                }
            }

            else if(action === "end") {
                return {
                    ...acc,
                    stage: 0,
                    time
                };
            }

            else if(action === "next") {
                return {
                    n: [],
                    stage: 1,
                    time: 0,
                    id: acc.id + 1
                }
            }

        } );

        reducer.on( done );

    });

    it('from one source', (done) => {

        done = series(done, [
            evt => expect(evt).to.deep.equal( Observable.keyF ),
            evt => expect(evt).to.deep.equal( { n: [  ], id: 158, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( { n: [ 10, 15, ], id: 158, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( { n: [ 10, 15, 16, 17, 18, ], id: 158, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( { n: [ 10, 15, 16, 17, 18, ], id: 158, stage: 0, time: 15 } ),
            evt => expect(evt).to.deep.equal( { n: [ ], id: 159, stage: 1, time: 0 } ),
        ]);

        const source = new Observable( function (emt) {
            emt.kf();
            emt({ n: [], id: 158, stage: 1, time: 0 });
            emt({ action: "continue", data: [ 10, 15 ] });
            emt({ action: "continue", data: [ 16, 17, 18 ] });
            emt({ action: "end", time: 15 });
            emt({ action: "next" });
        } );

        const initor = source.filter(({action}) => !action);
        const maintainer = source.filter(({action}) => action);

        const reducer = maintainer.reducer( initor, function (acc, {action, data, time}) {

            if(action === "continue") {
                return {
                    ...acc,
                    n: [ ...acc.n, ...data ]
                }
            }

            else if(action === "end") {
                return {
                    ...acc,
                    stage: 0,
                    time
                };
            }

            else if(action === "next") {
                return {
                    n: [],
                    stage: 1,
                    time: 0,
                    id: acc.id + 1
                }
            }

        } );

        reducer.log();

        reducer.on( done );

    });

    it('with reinit from one source', (done) => {

        done = series(done, [
            evt => expect(evt).to.deep.equal( Observable.keyF ),
            evt => expect(evt).to.deep.equal( { n: [  ], id: 158, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( { n: [ 10, 15, ], id: 158, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( { n: [ 10, 15, 16, 17, 18, ], id: 158, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( { n: [ 10, 15, 16, 17, 18, ], id: 159, stage: 0, time: 15 } ),
            evt => expect(evt).to.deep.equal( { n: [ ], id: 159, stage: 1, time: 0 } ),
            evt => expect(evt).to.deep.equal( Observable.keyF ),
            //evt => expect(evt).to.deep.equal( { n: [ ], id: 158, stage: 1, time: 0 } ),
        ]);

        const source = new Observable( function ({emt}) {
            emt.kf();
            emt({ n: [], id: 158, stage: 1, time: 0 });
            emt({ action: "continue", data: [ 10, 15 ] });
            emt({ action: "continue", data: [ 16, 17, 18 ] });
            emt({ action: "end", time: 15 });
            emt({ action: "next" });
            setTimeout(function () {
                emt.kf();
            });
        } );

        const initor = source.filter(({action}) => !action);
        const maintainer = source.filter(({action}) => action);

        const reducer = maintainer.reducer( initor, function (acc, {action, data, time}) {

            if(action === "continue") {
                return {
                    ...acc,
                    n: [ ...acc.n, ...data ]
                }
            }

            else if(action === "end") {
                return {
                    ...acc,
                    stage: 0,
                    id: acc.id + 1,
                    time
                };
            }

            else if(action === "next") {
                return {
                    ...acc,
                    n: [],
                    stage: 1,
                    time: 0
                }
            }

        } );

        reducer.on( done );

    });

});