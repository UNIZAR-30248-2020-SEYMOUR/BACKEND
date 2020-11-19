let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let app = require('../test');

chai.use(chaiHttp);

describe('Unit testing', () => {

    describe('Successful Get Users', () => {
        it('Should get ALL the users (0) and return 200', (done) => {
            chai.request(app)
                .post('/users/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(0);
                    done();
                })
        })
    });

    describe('Successful Get Categories', () => {
        it('Should get ALL the categories (12) and return 200', (done) => {
            chai.request(app)
                .post('/categories/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(12);
                    done();
                })
        })
    });

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

    describe('Successful Get Users', () => {
        it('Should get ALL the users (1) and return 200', (done) => {
            chai.request(app)
                .post('/users/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(1);
                    done();
                })
        })
    });

    let UUID2 = undefined;

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
                        UUID2 = res.body.UUID;
                        done();
                    }
                )
        });
    });

    describe('Successful Get Users', () => {
        it('Should get ALL the users (2) and return 200', (done) => {
            chai.request(app)
                .post('/users/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(2);
                    done();
                })
        })
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

    describe('Successful Get Courses', () => {
        it('Should get ALL the courses (1) and return 200', (done) => {
            chai.request(app)
                .post('/courses/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(1);
                    done();
                })
        })
    });

    describe('Unsuccessful Create Course: invalid coursename', () => {
        it('Should NOT register the course and return 500', (done) => {
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
                    expect(res).to.have.status(500);
                    done();
                })
        })
    });

    describe('Unsuccessful Create Course: invalid description', () => {
        it('Should NOT register the course and return 500', (done) => {
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
                    expect(res).to.have.status(500);
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

    describe('Successful Update User Information (Happy path)', () => {
        it('Should update user information and return 200', (done) => {
            chai.request(app)
                .post('/users/update_profile')
                .send(
                    {
                        'uuid': UUID,
                        'username': 'integration_user_mod',
                        'email': 'integration_mod@seymour.es',
                        'password': 'integration_password_mod',
                        'description': 'integration_description_mod'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username','integration_user_mod');
                    expect(res.body).to.have.property('email', 'integration_mod@seymour.es');
                    expect(res.body).to.have.property('password','integration_password_mod');
                    expect(res.body).to.have.property('description', 'integration_description_mod');
                    done();
                })
        })
    });

    describe('Unsuccessful Update User Information (Wrong UUID)', () => {
        it('Should not get user information and return 404', (done) => {
            chai.request(app)
                .post('/users/update_profile')
                .send(
                    {
                        'uuid': 'no_existo',
                        'username': 'integration_user_mod',
                        'email': 'integration_mod@seymour.es',
                        'password': 'integration_password_mod',
                        'description': 'integration_description_mod'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error');
                    done();
                })
        })
    });

    describe('Unsuccessful Update User Information (Wrong UUID)', () => {
        it('Should not get update information and return 404', (done) => {
            chai.request(app)
                .post('/users/update_profile')
                .send(
                    {
                        'uuid': 'no_existo',
                        'username': 'integration_user_mod',
                        'email': 'integration_mod@seymour.es',
                        'password': 'integration_password_mod',
                        'description': 'integration_description_mod'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error');
                    done();
                })
        })
    });

    describe('Unsuccessful Update User Information (E-mail already exists)', () => {
        it('Should not update user information and return 409', (done) => {
            chai.request(app)
                .post('/users/update_profile')
                .send(
                    {
                        'uuid': UUID,
                        'username': 'integration_user_mod',
                        'email': 'integration2@seymour.es',
                        'password': 'integration_password_mod',
                        'description': 'integration_description_mod'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(409);
                    expect(res.body).to.have.property('error');
                    done();
                })
        })
    });

    describe('Unsuccessful Update User Information (Username already exists)', () => {
        it('Should not update user information and return 409', (done) => {
            chai.request(app)
                .post('/users/update_profile')
                .send(
                    {
                        'uuid': UUID,
                        'username': 'integration_user2',
                        'email': 'integration@seymour.es',
                        'password': 'integration_password_mod',
                        'description': 'integration_description_mod'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(409);
                    expect(res.body).to.have.property('error');
                    done();
                })
        })
    });

    describe('Unsuccessful Update User Information (Invalid username)', () => {
        it('Should not update user information and return 500', (done) => {
            chai.request(app)
                .post('/users/update_profile')
                .send(
                    {
                        'uuid' : UUID,
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

    describe('Unsuccessful Update User Information (Invalid email)', () => {
        it('Should not update user information and return 500', (done) => {
            chai.request(app)
                .post('/users/update_profile')
                .send(
                    {
                        'uuid': UUID,
                        'username': 'integration_user',
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

    describe('Unsuccessful Update User Information (Invalid password)', () => {
        it('Should not update user information and return 500', (done) => {
            chai.request(app)
                .post('/users/update_profile')
                .send(
                    {
                        'uuid' : UUID,
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

    describe('Unsuccessful Update User Information (Invalid description)', () => {
        it('Should not update user information and return 500', (done) => {
            chai.request(app)
                .post('/users/update_profile')
                .send(
                    {
                        'uuid': UUID,
                        'username': 'integration_user3',
                        'email': 'integration3@seymour.es',
                        'password': 'integration_mod',
                        'description': 'LONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONG',

                    }
                )
                .end(function(err, res) {
                        expect(res).to.have.status(500);
                        done();
                    }
                )
        });
    });

    // SEARCH TESTS

    describe('Successful Search User (2)', () => {
        it('Should get users and return 200', (done) => {
            chai.request(app)
                .post('/users/search')
                .send(
                    {
                        'textToSearch': 'integration'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body[0]).to.have.deep.property('uuid');
                    expect(res.body[1]).to.have.deep.property('uuid');
                    expect(res.body).to.have.length(2);
                    done();
                })
        })
    });

    describe('Successful Search User (0)', () => {
        it('Should NOT get any user and return 200', (done) => {
            chai.request(app)
                .post('/users/search')
                .send(
                    {
                        'textToSearch': 'no_existe'
                    }
                )
                .end(function(err, res) {
                    expect(res.body).to.have.length(0);
                    done();
                })
        })
    });

    /** Search user will NEVER return 500!!
    describe('Unsuccessful Search User', () => {
        it('Should NOT return any user and return 500', (done) => {
            chai.request(app)
                .post('/users/search')
                .send({
                    'textToSearch': '%'
                })
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    done();
                })
        })
    });

*/


    // PASSWORD TESTS

    describe('Successful forgot password (Happy Path)', () => {
        it('Should get 200 because we provided valid email', (done) => {
            chai.request(app)
                .post('/users/forgot_password')
                .send({
                        'email': 'integration_mod@seymour.es',
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

    describe('Successful Update Course', () => {
        it('Should update the course and return 200 and the new course information', (done) => {
            chai.request(app)
                .post('/courses/update_course')
                .send(
                    {
                        'id': 1,
                        'coursename': 'testCourse',
                        'description': 'this is just a course for testing',
                        'category': 'Software',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('coursename');
                    expect(res.body).to.have.property('description');
                    expect(res.body).to.have.property('category');
                    expect(res.body).to.have.property('owner');
                    done();
                })
        });
    });

    describe('Unsuccessful Update Course', () => {
        it('Should NOT update the course and return 403 because course does not exist', (done) => {
            chai.request(app)
                .post('/courses/update_course')
                .send(
                    {
                        'id': 40,
                        'coursename': 'testCourse1',
                        'description': 'this is just a course for testing1',
                        'category': 'Software',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        });
    });

    describe('Unsuccessful Update Course', () => {
        it('Should NOT update the course and return 403 because category does not exist', (done) => {
            chai.request(app)
                .post('/courses/update_course')
                .send(
                    {
                        'id': 1,
                        'coursename': 'testCourse2',
                        'description': 'this is just a course for testing2',
                        'category': 'Softwareee',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        });
    });

    // VIDEO TESTS

    describe('Successful Upload a Video into a Course', () => {
        it('Should upload a video and return 201', (done) => {
            chai.request(app)
                .post('/videos/upload')
                .send(
                    {
                        'id': 1,
                        'title': 'testVideo1',
                        'description': 'this is just a video for testing',
                        'location': '/home/test',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(201);
                    done();
                })
        })
    });

    describe('Unsuccessful Upload a Video into a Course (Invalid course id)', () => {
        it('Should NOT upload a video and return 403', (done) => {
            chai.request(app)
                .post('/videos/upload')
                .send(
                    {
                        'id': -1,
                        'title': 'testVideo1',
                        'description': 'this is just a video for testing',
                        'location': '/home/test',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        })
    });

    describe('Unsuccessful Upload a Video into a Course (Params too long)', () => {
        it('Should NOT upload a video and return 500', (done) => {
            chai.request(app)
                .post('/videos/upload')
                .send(
                    {
                        'id': 1,
                        'title': 'LONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONG',
                        'description': 'this is just a video for testing',
                        'location': '/home/test',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    done();
                })
        })
    });


    // COURSE TESTS (again)

    describe('Successful Delete Course', () => {
        it('Should delete the course and return 204', (done) => {
            chai.request(app)
                .post('/courses/delete')
                .send(
                    {
                        'id': 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(204);
                    done();
                })
        });
    });

    describe('Unsuccessful Delete Course', () => {
        it('Should NOT delete the course and return 404', (done) => {
            chai.request(app)
                .post('/courses/delete')
                .send(
                    {
                        'id': 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                })
        });
    });

    describe('Successful Get Courses', () => {
        it('Should get ALL the courses (0) and return 200', (done) => {
            chai.request(app)
                .post('/courses/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(0);
                    done();
                })
        })
    });



    // USER TESTS (again xd)

    describe('Successful Delete User', () => {
        it('Should Delete the user and return 204', (done) => {
            chai.request(app)
                .post('/users/delete')
                .send(
                    {
                        'uuid': UUID
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(204);
                    done();
                })
        });
    });

    describe('Successful Get Users', () => {
        it('Should get ALL the users (1) and return 200', (done) => {
            chai.request(app)
                .post('/users/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(1);
                    done();
                })
        })
    });

    describe('Successful Delete User', () => {
        it('Should Delete the user and return 204', (done) => {
            chai.request(app)
                .post('/users/delete')
                .send(
                    {
                        'uuid': UUID2
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(204);
                    done();
                })
        });
    });

    describe('Successful Get Users', () => {
        it('Should get ALL the users (0) and return 200', (done) => {
            chai.request(app)
                .post('/users/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(0);
                    done();
                })
        })
    });

    describe('Unsuccessful Delete User (User does not exists)', () => {
        it('Should not delete the user and return 404', (done) => {
            chai.request(app)
                .post('/users/delete')
                .send(
                    {
                        'uuid': 'no_existo'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                })
        });
    });


    after(function(){
        process.exit(0)
    })
});
