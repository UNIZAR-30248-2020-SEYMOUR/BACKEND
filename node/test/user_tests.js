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
                        expect(res.body).to.have.property('error');
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
                        expect(res.body).to.have.property('error');
                        done();
                    }
                )
        });
    });

    // LOGIN TESTS

    let UUID = undefined;

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
                        UUID = res.body.UUID;
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
                        expect(res.body).to.have.property('error');
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
                        expect(res.body).to.have.property('error');
                        done();
                    }
                )
        });

    });


    // COURSES TESTS

    describe('Successful Create Course (Happy Path)', () => {
        it('Should register the course for the given user and return 201', (done) => {
            chai.request(app)
                .post('/courses/create_course')
                .send(
                    {
                        'coursename': 'test course',
                        'description': 'this is a description for a test course',
                        'owner': UUID,
                        'category': 'Marketing'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(201);
                    done();
                })
        })
    });

    describe('Unsuccessful Create Course: invalid coursename', () => {
        it('Should NOT register the course and return 403', (done) => {
            chai.request(app)
                .post('/courses/create_course')
                .send(
                    {
                        'coursename': 'LONGLONGLONGLONGLONGLONGLONGLONGLONGLONGL',
                        'description': 'this is a description for a test course',
                        'owner': UUID,
                        'category': 'Marketing'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        })
    });

    describe('Unsuccessful Create Course: invalid description', () => {
        it('Should NOT register the course and return 403', (done) => {
            chai.request(app)
                .post('/courses/create_course')
                .send(
                    {
                        'coursename': 'test course',
                        'description': 'LONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONG',
                        'owner': UUID,
                        'category': 'Marketing'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        })
    });

    describe('Unsuccessful Create Course: invalid owner', () => {
        it('Should NOT register the course and return 403', (done) => {
            chai.request(app)
                .post('/courses/create_course')
                .send(
                    {
                        'coursename': 'test course',
                        'description': 'this is a description for a test course',
                        'owner': 'invalid UUID',
                        'category': 'Marketing'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        })
    });

    describe('Unsuccessful Create Course: invalid category', () => {
        it('Should NOT register the course and return 403', (done) => {
            chai.request(app)
                .post('/courses/create_course')
                .send(
                    {
                        'coursename': 'test course',
                        'description': 'this is a description for a test course',
                        'owner': UUID,
                        'category': 'i donnut exist'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        })
    });

    // PROFILE TESTS

    describe('Successful Response With User Information (Happy Path)', () => {
        it('Should get the user information and return 200', (done) => {
            chai.request(app)
                .post('/users/user_profile')
                .send(
                    {
                        'uuid': UUID
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username');
                    expect(res.body).to.have.property('description');
                    expect(res.body).to.have.property('courses');
                    expect(res.body).to.have.property('email');
                    expect(res.body.courses).to.have.length(1);
                    done();
                })
        })
    });

    describe('Unsuccessful Get User Information (Wrong UUID)', () => {
        it('Should not get user information and return 404', (done) => {
            chai.request(app)
                .post('/users/user_profile')
                .send(
                    {
                        'uuid': 'no_existo'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error');
                    done();
                })
        })
    });

    // PASSWORD TESTS

    describe('Successful forgot password (Happy Path)', () => {
        it('Should get 200 because we provided valid email', (done) => {
            chai.request(app)
                .post('/users/forgot_password')
                .send({
                        'email': 'integration@seymour.es',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                })
        })
    });

    describe('Unsuccessful forgot password', () => {
        it('Should get 403 because we provided an invalid email', (done) => {
            chai.request(app)
                .post('/users/forgot_password')
                .send({
                        'email': 'integration@seymour.esssssss',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    expect(res.body).to.have.property('error');
                    done();
                })
        })
    });

    describe('Unsuccessful reset password', () => {
        it('Should get 401 because we provided an invalid token', (done) => {
            chai.request(app)
                .post('/users/reset_password')
                .send({
                        'token': 'invalid_token',
                        'password': 'new_password'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('error');
                    done();
                })
        })
    });




    after(function(){
        process.exit(0)
    })
});
