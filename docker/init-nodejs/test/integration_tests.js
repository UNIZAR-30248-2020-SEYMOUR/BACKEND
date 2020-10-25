let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let app = require('../test');

chai.use(chaiHttp);

describe('User tests', () => {

    describe('Successful Register', () => {
        it('Should register and return 201 and the UUID', (done) => {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        'username': 'integration_user',
                        'email': 'integration@seymour.es',
                        'password': 'integration_password',
                        'description': 'integration_description'
                    }
                )
                .end(function(err, res) {
                        expect(res).to.have.status(201);
                        expect(res.body).to.have.property('UUID');
                        done();
                    }
                )
        });
    });

    describe('Unsuccessful Register', () => {
        it('Should NOT register and return 500', (done) => {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        'username': 'LONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONG',
                        'email': 'integration2@seymour.es',
                        'password': 'integration_password',
                        'description': 'integration_description'
                    }
                )
                .end(function(err, res) {
                        expect(res).to.have.status(500);
                        done();
                    }
                )
        });
    });

    after(function(){
        console.log('Runs once after all test in this file')
        process.exit(0)
    })

});
