let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let app = require('../test');

chai.use(chaiHttp);

describe('User tests', () => {

    // REGISTER TESTS

    describe('Successful Register (Happy Path)', () => {
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

    describe('Successful Register (No description)', () => {
        it('Should register and return 201 and the UUID', (done) => {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        'username': 'integration_user2',
                        'email': 'integration2@seymour.es',
                        'password': 'integration_password'
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

    describe('Unsuccessful Register: Invalid username', () => {
        it('Should NOT register and return 500', (done) => {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        'username': 'LONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONG',
                        'email': 'integration3@seymour.es',
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

    describe('Unsuccessful Register: Invalid email', () => {
        it('Should NOT register and return 500', (done) => {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        'username': 'integration_user3',
                        'email': 'LONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONG',
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

    describe('Unsuccessful Register: Invalid password', () => {
        it('Should NOT register and return 500', (done) => {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        'username': 'integration_user3',
                        'email': 'integration3@seymour.es',
                        'password': 'LONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONG',
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

    describe('Unsuccessful Register: Invalid description', () => {
        it('Should NOT register and return 500', (done) => {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        'username': 'integration_user3',
                        'email': 'integration3@seymour.es',
                        'password': 'integration_password',
                        'description': 'LONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONG'
                    }
                )
                .end(function(err, res) {
                        expect(res).to.have.status(500);
                        done();
                    }
                )
        });
    });

    describe('Unsuccessful Register: Already existing username', () => {
        it('Should NOT register and return 409', (done) => {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        'username': 'integration_user',
                        'email': 'integration3@seymour.es',
                        'password': 'integration_password',
                        'description': 'integration_description'
                    }
                )
                .end(function(err, res) {
                        expect(res).to.have.status(409);
                        done();
                    }
                )
        });
    });

    describe('Unsuccessful Register: Already existing email', () => {
        it('Should NOT register and return 409', (done) => {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        'username': 'integration_user3',
                        'email': 'integration@seymour.es',
                        'password': 'integration_password',
                        'description': 'integration_description'
                    }
                )
                .end(function(err, res) {
                        expect(res).to.have.status(409);
                        done();
                    }
                )
        });
    });

    // LOGIN TESTS

    describe('Successful Login (Happy Path)', () => {
        it('Should login and return 200 and the UUID', (done) => {
            chai.request(app)
                .post('/users/login')
                .send(
                    {
                        'email': 'integration@seymour.es',
                        'password': 'integration_password',
                    }
                )
                .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('UUID');
                        done();
                    }
                )
        });
    });

    describe('Unsuccessful Login (Wrong email)', () => {
        it('Should not login and return 403', (done) => {
            chai.request(app)
                .post('/users/login')
                .send(
                    {
                        'email': 'integration@seymour.ess',
                        'password': 'integration_password',
                    }
                )
                .end(function(err, res) {
                        expect(res).to.have.status(403);
                        done();
                    }
                )
        });
    });

    describe('Unsuccessful Login (Wrong password)', () => {
        it('Should not login and return 403', (done) => {
            chai.request(app)
                .post('/users/login')
                .send(
                    {
                        'email': 'integration@seymour.es',
                        'password': 'integration_passworddddd',
                    }
                )
                .end(function(err, res) {
                        expect(res).to.have.status(403);
                        done();
                    }
                )
        });
    });

    after(function(){
        console.log('Code coverage:')
        process.exit(0)
    })

});
