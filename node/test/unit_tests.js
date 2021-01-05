let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let app = require('../test');
const fs = require('fs');

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
        it('Should NOT register and return 400', (done) => {
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
                        expect(res).to.have.status(400);
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

    describe('Unsuccessful Create Course (Long description)', () => {
      it('Should NOT register the course for the given user and return 400', (done) => {
        chai.request(app)
          .post('/courses/create_course')
          .send(
            {
              'coursename': 'test course',
              'description': 'this is a description for a test coursethis is a description for a test coursethis is a description for a test coursethis is a description for a test coursethis is a description for a test coursethis is a description for a test coursethis is a description for a test coursethis is a description for a test coursethis is a description for a test coursethis is a description for a test coursethis is a description for a test coursethis is a description for a test course',
              'owner': UUID,
              'category': 'Marketing'
            }
          )
          .end(function(err, res) {
            expect(res).to.have.status(400);
            done();
          })
      })
    });


    describe('Unsuccessful Create Course (Long coursename)', () => {
      it('Should NOT register the course for the given user and return 400', (done) => {
        chai.request(app)
          .post('/courses/create_course')
          .send(
            {
              'coursename': 'test coursetest coursetest coursetest coursetest coursetest coursetest course',
              'description': 'this is a description for a test course',
              'owner': UUID,
              'category': 'Marketing'
            }
          )
          .end(function(err, res) {
            expect(res).to.have.status(400);
            done();
          })
      })
    });

    describe('Successful Get Information of a course', () => {
        it('Should get the information of a course and return 200', (done) => {
            chai.request(app)
                .post('/courses/get_info')
                .send(
                    {
                        'id': 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("name");
                    expect(res.body).to.have.property("description");
                    expect(res.body).to.have.property("category");
                    expect(res.body.category).to.have.property("name");
                    expect(res.body.category).to.have.property("imageUrl");
                    done();
                })
        })
    });

    describe('Unsuccessful Get Information of a course', () => {
        it('Should NOT get the information of a course that does not exist and return 404', (done) => {
            chai.request(app)
                .post('/courses/get_info')
                .send(
                    {
                        'id': 404
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                })
        })
    });

    describe('Successful Get Videos of a course (0)', () => {
        it('Should get 0 videos and return 200', (done) => {
            chai.request(app)
                .post('/courses/get_videos')
                .send(
                    {
                        'id': 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                })
        })
    });

    describe('Unsuccessful Get Videos of a course', () => {
        it('Should NOT get the videos of a course that does not exist and return 404', (done) => {
            chai.request(app)
                .post('/courses/get_videos')
                .send(
                    {
                        'id': 404
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
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
                    expect(res.body).to.have.property('name');
                    expect(res.body).to.have.property('imageUrl');
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

    describe('Successful Response With User Profile Information (Happy Path)', () => {
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
                    expect(res.body).to.have.property('rate');
                    expect(res.body.courses).to.have.length(1);
                    done();
                })
        })
    });

    describe('Unsuccessful Get User Profile Information (Wrong UUID)', () => {
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

    describe('Successful Response With User Information (Happy Path)', () => {
        it('Should get the user information and return 200', (done) => {
            chai.request(app)
                .post('/users/get_user')
                .send(
                    {
                        'username': 'integration_user'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username');
                    expect(res.body).to.have.property('description');
                    expect(res.body).to.have.property('courses');
                    expect(res.body).to.have.property('email');
                    expect(res.body).to.have.property('rate');
                    expect(res.body.courses).to.have.length(1);
                    done();
                })
        })
    });

    describe('Unsuccessful Get User Information (Wrong username)', () => {
        it('Should not get user information and return 404', (done) => {
            chai.request(app)
                .post('/users/get_user')
                .send(
                    {
                        'username': 'no_existo'
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
                        'description': 'integration_description_mod'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username','integration_user_mod');
                    expect(res.body).to.have.property('email', 'integration_mod@seymour.es');
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

    describe('Successful accessing video', () => {
        it('Should return 200', (done) => {
            chai.request(app)
                .get('/videos/video-test.mp4')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                })
        })
    });

    describe('Successful Upload a Video into a Course', () => {
        it('Should upload a video and return 201',  (done) => {
            chai.request(app)
                .post('/videos/upload')
                .set('content-type', 'multipart/form-data')
                .attach('video', fs.readFileSync('video-test.mp4'), 'video-test.mp4')
                .end(function(err, res) {
                    expect(res).to.have.status(201);
                    done();
                });
        })
    });

    describe('Unsuccessful Upload a Video (No content)', () => {
        it('Should NOT upload a video and return 400', (done) => {
            chai.request(app)
                .post('/videos/upload')
                .send(
                    {}
                )
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                })
        })
    });

    describe('Successful Assign details to an uploaded video', () => {
        it('Should assign details to an video and return 201', (done) => {
            chai.request(app)
                .post('/videos/details')
                .send(
                    {
                        'course': 1,
                        'video' : 1,
                        'title': 'test title',
                        'description': 'this is just a video for testing',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(201);
                    done();
                })
        })
    });

    describe('Successful get Feed of a Course', () => {
        it('Should retrieve the feed of the user and return 200', (done) => {
            chai.request(app)
                .post('/users/feed')
                .send(
                    {
                        'uuid': UUID,
                        'firstVideo' : 0,
                        'lastVideo' : 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                })
        })
    });

    describe('Unsuccessful get Feed of a Course (invalid arguments)', () => {
        it('Should return 500', (done) => {
            chai.request(app)
                .post('/users/feed')
                .send(
                    {
                        'uuid': UUID,
                        'firstVideo' : -3,
                        'lastVideo' : -8
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    done();
                })
        })
    });

    describe('Unsuccessful Assign details to an uploaded video (Invalid course ID)', () => {
        it('Should NOT assign details to an video and return 403', (done) => {
            chai.request(app)
                .post('/videos/details')
                .send(
                    {
                        'course': 'does_not_exists',
                        'video' : 1,
                        'title': 'test title',
                        'description': 'this is just a video for testing',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        })
    });

    describe('Unsuccessful Assign details to an uploaded video (Invalid video ID)', () => {
        it('Should NOT assign details to an video and return 403', (done) => {
            chai.request(app)
                .post('/videos/details')
                .send(
                    {
                        'course': 1,
                        'video' : 'does_not_exists',
                        'title': 'test video',
                        'description': 'this is just a video for testing',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(403);
                    done();
                })
        })
    });

    describe('Unsuccessful Assign details to an uploaded video (Params too long)', () => {
        it('Should NOT assign details to a video and return 500', (done) => {
            chai.request(app)
                .post('/videos/details')
                .send(
                    {
                        'course': 1,
                        'video' : 1,
                        'title': 'LONGLONGLONGLONGLONGLONGLLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONGLONG',
                        'description': 'this is just a video for testing',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(500);
                    done();
                })
        })
    });

    describe('Successful Rate a video', () => {
        it('Should rate a video and return 201 with the rate number', (done) => {
            chai.request(app)
                .post('/videos/rate')
                .send(
                    {
                        'uuid': UUID,
                        'video' : 1,
                        'rate': 4,
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('rate').to.be.equal(4);
                    done();
                })
        })
    });

    describe('Successful Rate a video again', () => {
        it('Should update the rate of a video and return 201 with the rate number', (done) => {
            chai.request(app)
                .post('/videos/rate')
                .send(
                    {
                        'uuid': UUID,
                        'video' : 1,
                        'rate': 5,
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('rate').to.be.equal(5);
                    done();
                })
        })
    });

    describe('Unsuccessful Rate a video (invalid uuid)', () => {
        it('Should NOT update the rate of a video and return 404', (done) => {
            chai.request(app)
                .post('/videos/rate')
                .send(
                    {
                        'uuid': 'lololo',
                        'video' : 1,
                        'rate': 4124124,
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                })
        })
    });

    describe('Unsuccessful Rate a video (invalid video)', () => {
        it('Should NOT update the rate of a video and return 404', (done) => {
            chai.request(app)
                .post('/videos/rate')
                .send(
                    {
                        'uuid': UUID,
                        'video' : 'lalala',
                        'rate': 4124124,
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                })
        })
    });

    describe('Successful get the course rate', () => {
        it('Should get the updated course rate', (done) => {
            chai.request(app)
                .post('/courses/get_info')
                .send(
                    {
                        'id': 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('rate').to.be.equal(5);
                    done();
                })
        })
    });

    describe('Successful get the user rate', () => {
        it('Should get the updated user rate', (done) => {
            chai.request(app)
                .post('/users/get_user')
                .send(
                    {
                        'username': 'integration_user_mod'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('rate').to.be.equal(5);
                    done();
                })
        })
    });

    describe('Successful Get Videos of a course (1)', () => {
            it('Should get 1 video and return 200', (done) => {
                chai.request(app)
                    .post('/courses/get_videos')
                    .send(
                        {
                            'id': 1
                        }
                    )
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        done();
                    })
            })
        });

    describe('Successful get all videos', () => {
        it('Should get all videos and return 200', (done) => {
            chai.request(app)
                .post('/videos/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(1);
                    done();
                })
        })
    });

    describe('Successful Comment a video', () => {
        it('Should comment a video and return 201', (done) => {
            chai.request(app)
                .post('/videos/comment')
                .send(
                    {
                        'uuid': UUID,
                        'video' : 1,
                        'comment': 'nice video guy',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(201);
                    done();
                })
        })
    });

    describe('Unsuccessful Comment a video', () => {
        it('Should NOT comment a video and return 404 (invalid user)', (done) => {
            chai.request(app)
                .post('/videos/comment')
                .send(
                    {
                        'uuid': 'lelele',
                        'video' : 1,
                        'comment': 'nice video guy',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                })
        })
    });

    describe('Unsuccessful Comment a video', () => {
        it('Should NOT comment a video and return 404 (invalid video)', (done) => {
            chai.request(app)
                .post('/videos/comment')
                .send(
                    {
                        'uuid': UUID,
                        'video' : 'lililili',
                        'comment': 'nice video guy',
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                })
        })
    });
    
   describe('Successful get one video information', () => {
        it('Should get the video and return 200', (done) => {
            chai.request(app)
                .post('/videos/get_video')
                .send({'id': 1})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('title').to.be.equal('test title');
                    expect(res.body).to.have.property('description').to.be.equal('this is just a video for testing');
                    expect(res.body).to.have.property('owner').to.be.equal('integration_user_mod');
                    expect(res.body).to.have.property('rate').to.be.equal(5);
                    expect(res.body.comments).to.have.length(1);
                    done();
                })
        })
    });

    describe('Unsuccessful get one video information', () => {
        it('Should NOT get the video and return 404', (done) => {
            chai.request(app)
                .post('/videos/get_video')
                .send(
                    {
                        'id': 1241209
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                })
        })
    });

    describe('Successful Course Search (All categories)', () => {
        it('Should get the course and return 200', (done) => {
            chai.request(app)
                .post('/courses/search')
                .send(
                    {
                        'textToSearch': 'test',
                        'category' : ''
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body[0]).to.have.deep.property('id');
                    expect(res.body[0]).to.have.deep.property('coursename');
                    expect(res.body[0]).to.have.deep.property('description');
                    expect(res.body[0]).to.have.deep.property('category');
                    expect(res.body).to.have.length(1);
                    done();
                })
        })
    });

    describe('Successful Course Search (Using category field)', () => {
        it('Should get the course and return 200', (done) => {
            chai.request(app)
                .post('/courses/search')
                .send(
                    {
                        'textToSearch': 'test',
                        'category' : 'Software'
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body[0]).to.have.deep.property('id');
                    expect(res.body[0]).to.have.deep.property('coursename');
                    expect(res.body[0]).to.have.deep.property('description');
                    expect(res.body[0]).to.have.deep.property('category');
                    expect(res.body).to.have.length(1);
                    done();
                })
        })
    });

    describe('Successful Course Subscribe', () => {
        it('Should subscribe the user to the course and return 204', (done) => {
            chai.request(app)
                .post('/courses/subscribe')
                .send(
                    {
                        'id_user': UUID,
                        'id_course' : 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(204);
                    done();
                })
        })
    });

    describe('Unsuccessful Course Subscribe (Already subscribed)', () => {
        it('Should not subscribe the user to the course and return 409 (already subscribed)', (done) => {
            chai.request(app)
                .post('/courses/subscribe')
                .send(
                    {
                        'id_user': UUID,
                        'id_course' : 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(409);
                    done();
                })
        })
    });

    describe('Unsuccessful Course Subscribe (Invalid user)', () => {
        it('Should not subscribe the user to the course and return 400 (user does not exist)', (done) => {
            chai.request(app)
                .post('/courses/subscribe')
                .send(
                    {
                        'id_user': 'invaliduser',
                        'id_course' : 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                })
        })
    });

    describe('Unsuccessful Course Subscribe (Invalid course)', () => {
        it('Should not subscribe the user to the course and return 400 (course does not exist)', (done) => {
            chai.request(app)
                .post('/courses/subscribe')
                .send(
                    {
                        'id_user': UUID,
                        'id_course' : 99999
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                })
        })
    });

    describe('Successful Course Unsubscribe', () => {
        it('Should unsubscribe the user from the course and return 204', (done) => {
            chai.request(app)
                .post('/courses/unsubscribe')
                .send(
                    {
                        'id_user': UUID,
                        'id_course' : 1
                    }
                )
                .end(function(err, res) {
                    expect(res).to.have.status(204);
                    done();
                })
        })
    });

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

    describe('Successful Get Videos', () => {
        it('Should get ALL the videos (0) and return 200', (done) => {
            chai.request(app)
                .post('/videos/get_list')
                .send()
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.length(0);
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
