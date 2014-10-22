"use strict";
angular.module("archuploadApp", ["ngCookies", "ngResource", "ngSanitize", "btford.socket-io", "ui.router", "ui.bootstrap", "ngAnimate", "angular-redactor", "angularFileUpload", "ui.bootstrap", "ngSVGAttributes", "restangular", "xeditable"]).config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", function(a, b, c, d) {
    b.otherwise("/"), c.html5Mode({
        enabled: !0,
        requireBase: !0
    }), d.interceptors.push("authInterceptor")
}]).factory("authInterceptor", ["$rootScope", "$q", "$cookieStore", "$location", function(a, b, c, d) {
    return {
        request: function(a) {
            return console.log(a.url), a.url.startsWith("https://archusyd.s3-ap-southeast-2.amazonaws.com") ? a : (a.headers = a.headers || {}, c.get("token") && (a.headers.Authorization = "Bearer " + c.get("token")), a)
        },
        responseError: function(a) {
            return 401 === a.status ? (d.path("/login"), c.remove("token"), b.reject(a)) : b.reject(a)
        }
    }
}]).run(["$rootScope", "$location", "Auth", "editableOptions", function(a, b, c, d) {
    d.theme = "bs3", a.$on("$stateChangeStart", function(a, d) {
        c.isLoggedInAsync(function(a) {
            d.authenticate && !a && b.path("/login")
        })
    })
}]), angular.module("archuploadApp").config(["$stateProvider", function(a) {
    a.state("login", {
        url: "/login",
        templateUrl: "app/account/login/login.html",
        controller: "LoginCtrl"
    }).state("signup", {
        url: "/signup",
        templateUrl: "app/account/signup/signup.html",
        controller: "SignupCtrl"
    }).state("settings", {
        url: "/settings",
        templateUrl: "app/account/settings/settings.html",
        controller: "SettingsCtrl",
        authenticate: !0
    })
}]), angular.module("archuploadApp").controller("LoginCtrl", ["$scope", "Auth", "$location", "$window", function(a, b, c, d) {
    a.user = {}, a.errors = {}, a.login = function(d) {
        a.submitted = !0, d.$valid && b.login({
            email: a.user.email,
            password: a.user.password
        }).then(function() {
            c.path("/")
        }).catch(function(b) {
            a.errors.other = b.message
        })
    }, a.loginOauth = function(a) {
        d.location.href = "/auth/" + a
    }
}]), angular.module("archuploadApp").controller("SettingsCtrl", ["$scope", "User", "Auth", function(a, b, c) {
    a.errors = {}, a.changePassword = function(b) {
        a.submitted = !0, b.$valid && c.changePassword(a.user.oldPassword, a.user.newPassword).then(function() {
            a.message = "Password successfully changed."
        }).catch(function() {
            b.password.$setValidity("mongoose", !1), a.errors.other = "Incorrect password", a.message = ""
        })
    }
}]), angular.module("archuploadApp").controller("SignupCtrl", ["$scope", "Auth", "$location", "$window", function(a, b, c, d) {
    a.user = {}, a.errors = {}, a.register = function(d) {
        a.submitted = !0, d.$valid && b.createUser({
            name: a.user.name,
            email: a.user.email,
            password: a.user.password
        }).then(function() {
            c.path("/")
        }).catch(function(b) {
            b = b.data, a.errors = {}, angular.forEach(b.errors, function(b, c) {
                d[c].$setValidity("mongoose", !1), a.errors[c] = b.message
            })
        })
    }, a.loginOauth = function(a) {
        d.location.href = "/auth/" + a
    }
}]), angular.module("archuploadApp").controller("AdminCtrl", ["$scope", "$http", "Auth", "User", "Unikey", "transformRequestAsFormPost", "ProjectServices", "$upload", function(a, b, c, d, e, f, g, h) {
    a.users = d.query(), a.allStudents = e.query(), a.files = [], a.imageUploads = [], g.getStudios().then(function(b) {
        a.allStudios = b.plain()
    }), a.uploadFile = function(a) {
        var c = new FormData;
        c.append("file", a[0]), console.log(a[0]), b.post("api/unikeys/upload", c, {
            headers: {
                "Content-Type": void 0
            },
            transformRequest: angular.identity
        }).success(console.log("yay")).error(console.log("damn!"))
    }, a.delete = function(b) {
        d.remove({
            id: b._id
        }), angular.forEach(a.users, function(c, d) {
            c === b && a.users.splice(d, 1)
        })
    }, a.createStudio = function() {
        for (var b = a.newStudio, c = [], d = a.files.length - 1; d >= 0; d--) c.push(a.files[d].uploadData);
        b.files = c, console.log(b), g.createStudio(b).then(function(a) {
            console.log(a)
        })
    }, a.removeFile = function(b) {
        a.files.splice(b, 1)
    }, a.uploadFile = function(c) {
        var d = c;
        b.get("/api/aws/s3Policy?mimeType=" + c.type).success(function(b) {
            var e = b;
            console.log(e), h.upload({
                url: "https://archusyd.s3-ap-southeast-2.amazonaws.com/",
                method: "POST",
                data: {
                    key: "architecture/2014Exhibition/studioImages/" + Math.round(1e4 * Math.random()) + "$$" + c.name,
                    acl: "public-read",
                    "Content-Type": c.type,
                    AWSAccessKeyId: "AKIAIRT6MA7UDDLPWPVA",
                    success_action_status: "201",
                    Policy: e.s3Policy,
                    Signature: e.s3Signature
                },
                file: c
            }).then(function(b) {
                if (c.progress = parseInt(100), 201 === b.status) {
                    var e, f = xml2json.parser(b.data);
                    e = {
                        location: f.postresponse.location,
                        bucket: f.postresponse.bucket,
                        key: f.postresponse.key,
                        etag: f.postresponse.etag,
                        type: 0
                    }, d.uploadData = e, a.formFileInvalid = !1
                } else alert("Upload Failed")
            }, null, function(a) {
                c.progress = parseInt(100 * a.loaded / a.total)
            })
        })
    }, a.onFileSelect = function(b) {
        a.upload = [];
        for (var c = 0, d = 0; d < b.length; d++) {
            a.files.push(b[d]), a.formFileInvalid = !0;
            var e = b[d];
            e.id = "fileId" + c, c++, e.progress = parseInt(0)
        }
    }
}]), angular.module("archuploadApp").config(["$stateProvider", function(a) {
    a.state("admin", {
        url: "/admin",
        templateUrl: "app/admin/admin.html",
        controller: "AdminCtrl"
    })
}]), angular.module("archuploadApp").controller("CatalogueCtrl", ["$scope", "$http", "socket", "$stateParams", "ProjectServices", "$location", function(a, b, c, d, e) {
    a.studio = [], console.log(d), e.getStudio(d.id).then(function(b) {
        a.studio = b.plain()
    }), e.getProjectsByStudio(d.id).then(function(b) {
        a.projects = b.plain()
    })
}]), angular.module("archuploadApp").config(["$stateProvider", function(a) {
    a.state("catalogue", {
        url: "/catalogue/:id",
        templateUrl: "/app/catalogue/catalogue.html",
        controller: "CatalogueCtrl",
        controllerAs: "Catalogue"
    })
}]), angular.module("archuploadApp").controller("MainCtrl", ["$scope", "$http", "socket", "ProjectServices", function(a, b, c, d) {
    a.awesomeThings = [], d.getStudios().then(function(b) {
        a.allStudios = b.plain()
    }), b.get("/api/things").success(function(b) {
        a.awesomeThings = b, c.syncUpdates("thing", a.awesomeThings)
    }), a.addThing = function() {
        "" !== a.newThing && (b.post("/api/things", {
            name: a.newThing
        }), a.newThing = "")
    }, a.deleteThing = function(a) {
        b.delete("/api/things/" + a._id)
    }, a.$on("$destroy", function() {
        c.unsyncUpdates("thing")
    })
}]), angular.module("archuploadApp").config(["$stateProvider", function(a) {
    a.state("main", {
        url: "/",
        templateUrl: "app/main/main.html",
        controller: "MainCtrl"
    })
}]), angular.module("archuploadApp").controller("ProjectCtrl", ["$scope", "$http", "socket", "$stateParams", "ProjectServices", function(a, b, c, d, e) {
    a.awesomeThings = [], e.get(d.id).then(function(b) {
        a.project = b.plain()
    })
}]), angular.module("archuploadApp").config(["$stateProvider", function(a) {
    a.state("project", {
        url: "/project/:id",
        templateUrl: "app/project/project.html",
        controller: "ProjectCtrl"
    })
}]), angular.module("archuploadApp").controller("UploadCtrl", ["$scope", "$http", "socket", "$upload", "$timeout", "ProjectServices", function(a, b, c, d, e, f) {
    a.uniKeyList = [], a.currentStudent, a.hideform = !1, a.noStudent = !0, a.hideMain = !0, a.hideAddProject = !0, a.hideEditProject = !0, a.imageUploads = [], a.form = {}, a.files = [], a.currentQuestion = 0, b.get("/api/unikeys").success(function(b) {
        a.uniKeyList = b
    }), a.selected = void 0, f.getStudios().then(function(b) {
        console.log(b.plain()), a.states = _.map(b.plain(), "name")
    }), a.getProject = function(b) {
        f.get(b._id).then(function(b) {
            a.selectedProject = b.plain(), a.regenerateRedactor()
        }), a.hideMain = !0, a.hideEditProject = !1
    }, a.submitForm = function(c) {
        if (c) {
            var d = {
                unikey: a.studentLoginForm.unikey,
                studentNo: a.studentLoginForm.studentNo
            };
            b.post("/api/unikeys/check", d).success(function(b) {
                a.currentStudent = b, console.log(a.currentStudent), f.getProjectsByUnikey(a.currentStudent.unikey).then(function(b) {
                    a.projects = b
                }), a.noStudent = !1, a.hideMain = !1, e(function() {
                    a.hideform = !0
                }, 500)
            }).error(function(b) {
                a.noStudent = !0, a.error = b
            })
        }
    }, a.validate = function() {
        return 0 === a.currentQuestion ? a.addProjectForm.projectName.$invalid === !1 && a.addProjectForm.projectName.$pristine === !1 ? !0 : !1 : 1 === a.currentQuestion ? a.addProjectForm.projectStudio.$valid === !0 && a.addProjectForm.projectStudio.$pristine === !1 ? !0 : !1 : 2 === a.currentQuestion ? !0 : 3 === a.currentQuestion ? !0 : 4 === a.currentQuestion ? !0 : !1
    }, a.createProject = function() {
        for (var b = a.project, c = [], d = a.files.length - 1; d >= 0; d--) c.push(a.files[d].uploadData);
        b.unikey = a.currentStudent.unikey, b.files = c, b.author = a.currentStudent._id, f.create(b).then(function() {
            f.getProjectsByUnikey(a.currentStudent.unikey).then(function(b) {
                a.projects = b.plain(), a.hideMain = !1, a.hideAddProject = !0
            })
        })
    }, a.nextQuestion = function() {
        a.currentQuestion++
    }, a.updateProject = function() {
        f.update(a.selectedProject._id, a.selectedProject).then(function(b) {
            a.selectedProject = b.plain()
        })
    }, a.lastQuestion = function() {
        a.currentQuestion--
    }, a.openAddProject = function() {
        a.hideMain = !0, a.hideAddProject = !1, a.files.length = 0, a.project.name = "", a.project.studio = "", a.project.summary = "", a.project.detail = ""
    }, a.closeWindow = function() {
        f.getProjectsByUnikey(a.currentStudent.unikey).then(function(b) {
            a.projects = b.plain(), a.hideAddProject = !0, a.hideEditProject = !0, a.hideMain = !1, a.currentQuestion = 0, a.selectedProject = ""
        })
    }, a.removeFile = function(b) {
        a.files.splice(b, 1)
    }, a.uploadFile = function(c) {
        var e = c;
        b.get("/api/aws/s3Policy?mimeType=" + c.type).success(function(b) {
            var f = b;
            console.log(f), d.upload({
                url: "https://archusyd.s3-ap-southeast-2.amazonaws.com/",
                method: "POST",
                data: {
                    key: "architecture/2014Exhibition/" + a.currentStudent.unikey + "/" + Math.round(1e4 * Math.random()) + "$$" + c.name,
                    acl: "public-read",
                    "Content-Type": c.type,
                    AWSAccessKeyId: "AKIAIRT6MA7UDDLPWPVA",
                    success_action_status: "201",
                    Policy: f.s3Policy,
                    Signature: f.s3Signature
                },
                file: c
            }).then(function(b) {
                if (c.progress = parseInt(100), 201 === b.status) {
                    var d, f = xml2json.parser(b.data);
                    d = {
                        location: f.postresponse.location,
                        bucket: f.postresponse.bucket,
                        key: f.postresponse.key,
                        etag: f.postresponse.etag,
                        type: 0
                    }, e.uploadData = d, a.formFileInvalid = !1
                } else alert("Upload Failed")
            }, null, function(a) {
                c.progress = parseInt(100 * a.loaded / a.total)
            })
        })
    }, a.onFileSelect = function(b) {
        a.upload = [];
        for (var c = 0, d = 0; d < b.length; d++) {
            a.files.push(b[d]), a.formFileInvalid = !0;
            var e = b[d];
            e.id = "fileId" + c, c++, e.progress = parseInt(0)
        }
    }
}]).directive("iconic", function() {
    return {
        restrict: "A",
        link: function(a, b) {
            console.log("iconic injected"), IconicJS().inject(b)
        }
    }
}), angular.module("archuploadApp").config(["$stateProvider", function(a) {
    a.state("upload", {
        url: "/upload",
        templateUrl: "app/upload/upload.html",
        controller: "UploadCtrl"
    })
}]), angular.module("archuploadApp").factory("Auth", ["$location", "$rootScope", "$http", "User", "$cookieStore", "$q", function(a, b, c, d, e, f) {
    var g = {};
    return e.get("token") && (g = d.get()), {
        login: function(a, b) {
            var h = b || angular.noop,
                i = f.defer();
            return c.post("/auth/local", {
                email: a.email,
                password: a.password
            }).success(function(a) {
                return e.put("token", a.token), g = d.get(), i.resolve(a), h()
            }).error(function(a) {
                return this.logout(), i.reject(a), h(a)
            }.bind(this)), i.promise
        },
        logout: function() {
            e.remove("token"), g = {}
        },
        createUser: function(a, b) {
            var c = b || angular.noop;
            return d.save(a, function(b) {
                return e.put("token", b.token), g = d.get(), c(a)
            }, function(a) {
                return this.logout(), c(a)
            }.bind(this)).$promise
        },
        changePassword: function(a, b, c) {
            var e = c || angular.noop;
            return d.changePassword({
                id: g._id
            }, {
                oldPassword: a,
                newPassword: b
            }, function(a) {
                return e(a)
            }, function(a) {
                return e(a)
            }).$promise
        },
        getCurrentUser: function() {
            return g
        },
        isLoggedIn: function() {
            return g.hasOwnProperty("role")
        },
        isLoggedInAsync: function(a) {
            g.hasOwnProperty("$promise") ? g.$promise.then(function() {
                a(!0)
            }).catch(function() {
                a(!1)
            }) : a(g.hasOwnProperty("role") ? !0 : !1)
        },
        isAdmin: function() {
            return "admin" === g.role
        },
        getToken: function() {
            return e.get("token")
        }
    }
}]), angular.module("archuploadApp").service("ProjectServices", ["Restangular", "$state", function(a) {
    var b = a.all("api");
    return {
        create: function(a) {
            return b.all("projects").post(a)
        },
        getProjectsByUnikey: function(a) {
            return b.all("projects").one("unikey", a).getList()
        },
        getProjectsByStudio: function(a) {
            return b.all("projects").one("studio", a).getList()
        },
        get: function(a) {
            return b.one("projects", a).get()
        },
        update: function(a, c) {
            return b.one("projects", a).customPUT(c)
        },
        getStudio: function(a) {
            return b.one("studios", a).get()
        },
        getStudios: function() {
            return b.all("studios").getList()
        },
        createStudio: function(a) {
            return b.all("studios").post(a)
        }
    }
}]), angular.module("archuploadApp").factory("Unikey", ["$resource", function(a) {
    return a("/api/unikeys/:id/:controller", {
        id: "@_id"
    }, {
        changePassword: {
            method: "PUT",
            params: {
                controller: "password"
            }
        },
        get: {
            method: "GET",
            params: {
                id: "me"
            }
        }
    })
}]), angular.module("archuploadApp").factory("User", ["$resource", function(a) {
    return a("/api/users/:id/:controller", {
        id: "@_id"
    }, {
        changePassword: {
            method: "PUT",
            params: {
                controller: "password"
            }
        },
        get: {
            method: "GET",
            params: {
                id: "me"
            }
        }
    })
}]), angular.module("archuploadApp").directive("fileread", [function() {
    return {
        scope: {
            fileread: "="
        },
        link: function(a, b) {
            b.bind("change", function(b) {
                var c = new FileReader;
                c.onload = function(b) {
                    a.$apply(function() {
                        a.fileread = b.target.result
                    })
                }, c.readAsDataURL(b.target.files[0])
            })
        }
    }
}]), angular.module("archuploadApp").factory("transformRequestAsFormPost", function() {
    function a(a, c) {
        var d = c();
        return d["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8", b(a)
    }

    function b(a) {
        if (!angular.isObject(a)) return null == a ? "" : a.toString();
        var b = [];
        for (var c in a)
            if (a.hasOwnProperty(c)) {
                var d = a[c];
                b.push(encodeURIComponent(c) + "=" + encodeURIComponent(null == d ? "" : d))
            }
        var e = b.join("&").replace(/%20/g, "+");
        return e
    }
    return a
}), angular.module("archuploadApp").factory("Modal", ["$rootScope", "$modal", function(a, b) {
    function c(c, d) {
        var e = a.$new();
        return c = c || {}, d = d || "modal-default", angular.extend(e, c), b.open({
            templateUrl: "components/modal/modal.html",
            windowClass: d,
            scope: e
        })
    }
    return {
        confirm: {
            "delete": function(a) {
                return a = a || angular.noop,
                    function() {
                        var b, d = Array.prototype.slice.call(arguments),
                            e = d.shift();
                        b = c({
                            modal: {
                                dismissable: !0,
                                title: "Confirm Delete",
                                html: "<p>Are you sure you want to delete <strong>" + e + "</strong> ?</p>",
                                buttons: [{
                                    classes: "btn-danger",
                                    text: "Delete",
                                    click: function(a) {
                                        b.close(a)
                                    }
                                }, {
                                    classes: "btn-default",
                                    text: "Cancel",
                                    click: function(a) {
                                        b.dismiss(a)
                                    }
                                }]
                            }
                        }, "modal-danger"), b.result.then(function(b) {
                            a.apply(b, d)
                        })
                    }
            }
        }
    }
}]), angular.module("archuploadApp").directive("mongooseError", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(a, b, c, d) {
            b.on("keydown", function() {
                return d.$setValidity("mongoose", !0)
            })
        }
    }
}), angular.module("archuploadApp").controller("NavbarCtrl", ["$scope", "$location", "Auth", function(a, b, c) {
    a.menu = [{
        title: "Home",
        link: "/"
    }], a.isCollapsed = !0, a.isLoggedIn = c.isLoggedIn, a.isAdmin = c.isAdmin, a.getCurrentUser = c.getCurrentUser, a.logout = function() {
        c.logout(), b.path("/login")
    }, a.isActive = function(a) {
        return a === b.path()
    }
}]), angular.module("archuploadApp").directive("redactorClick", ["$timeout", function(a) {
    return {
        restrict: "EA",
        require: "ngModel",
        templateUrl: "components/redactor/redactor-click.html",
        scope: {
            ngModel: "="
        },
        link: function(b, c, d, e) {
            b.redactorSaveHidden = !0, a(function() {
                b.content = e.$viewValue
            });
            var f, g = function(a) {
                    b.$apply(function() {
                        e.$setViewValue(a)
                    })
                },
                h = {
                    changeCallback: g
                },
                i = d.redactor ? b.$eval(d.redactor) : {},
                j = angular.element(c).find("#redactor");
            angular.extend(h, i), b.loadRedactor = function() {
                b.redactorSaveHidden = !1, j.redactor({
                    iframe: !0,
                    minHeight: 100
                }), e.$render()
            }, b.$parent.regenerateRedactor = function() {
                a(function() {
                    b.content = e.$viewValue
                })
            }, b.saveRedactor = function() {
                var c = j.redactor("get");
                a(function() {
                    b.$apply(function() {
                        e.$setViewValue(c), b.$parent.updateProject()
                    })
                }), j.redactor("destroy"), b.redactorSaveHidden = !0
            }, e.$render = function() {
                angular.isDefined(f) && a(function() {
                    j.redactor("set", e.$viewValue || "")
                })
            }
        }
    }
}]), angular.module("archuploadApp").directive("fullHeight", ["$window", function(a) {
    return {
        restrict: "EA",
        link: function(b, c) {
            var d = 29;
            b.initializeWindowSize = function() {
                $(c).css("min-height", a.innerHeight - d)
            }, b.initializeWindowSize(), angular.element(a).bind("resize", function() {
                b.initializeWindowSize()
            })
        }
    }
}]).directive("fill", ["$window", function(a) {
    return {
        restrict: "EA",
        link: function(b, c) {
            b.initializeWindowSize = function() {
                $(c).css("min-height", $(window).height() - $(c).offset().top - 29)
            }, b.initializeWindowSize(), angular.element(a).bind("resize", function() {
                b.initializeWindowSize()
            })
        }
    }
}]), String.prototype.startsWith = function(a, b) {
    return 0 == (b ? this.toUpperCase() : this).indexOf(b ? a.toUpperCase() : a)
}, angular.module("archuploadApp").factory("socket", ["socketFactory", function(a) {
    var b = io("", {
            path: "/socket.io-client"
        }),
        c = a({
            ioSocket: b
        });
    return {
        socket: c,
        syncUpdates: function(a, b, d) {
            d = d || angular.noop, c.on(a + ":save", function(a) {
                var c = _.find(b, {
                        _id: a._id
                    }),
                    e = b.indexOf(c),
                    f = "created";
                c ? (b.splice(e, 1, a), f = "updated") : b.push(a), d(f, a, b)
            }), c.on(a + ":remove", function(a) {
                var c = "deleted";
                _.remove(b, {
                    _id: a._id
                }), d(c, a, b)
            })
        },
        unsyncUpdates: function(a) {
            c.removeAllListeners(a + ":save"), c.removeAllListeners(a + ":remove")
        }
    }
}]), angular.module("archuploadApp").directive("stepform", function() {
    return {
        templateUrl: "components/stepform/stepform.html",
        restrict: "EA",
        replace: !0,
        controller: "UploadCtrl",
        transclude: !0,
        link: function(a) {
            a.currentQuestion = 0
        }
    }
}).directive("step", ["$timeout", function() {
    return {
        templateUrl: "components/stepform/step.html",
        restrict: "EA",
        require: "^stepform",
        transclude: !0,
        replace: !0,
        scope: {
            question: "@",
            type: "@",
            stepType: "@",
            model: "@",
            tq: "@",
            action: "@",
            index: "@"
        },
        link: function(a, b, c) {
            a.question = c.question, a.type = c.type, a.mod = c.mod, a.action = c.action, a.tq = c.tq, a.steptype = c.steptype, a.nextQuestion = function() {
                a.$parent.$parent.currentQuestion = a.$parent.$parent.currentQuestion + 1
            }, a.lastQuestion = function() {
                a.$parent.$parent.currentQuestion = a.$parent.$parent.currentQuestion - 1
            }, a.submit = function() {
                console.log(a.$parent.$parent.$parent.submitForm())
            }
        }
    }
}]).directive("ngBindModel", ["$compile", function(a) {
    return {
        link: function(b, c, d) {
            c[0].removeAttribute("ng-bind-model"), c[0].setAttribute("ng-model", b.$eval(d.ngBindModel)), a(c[0])(b)
        }
    }
}]).directive("ngBindAction", ["$compile", function(a) {
    return {
        link: function(b, c, d) {
            c[0].removeAttribute("ng-bind-action"), c[0].setAttribute("ng-click", b.$eval(d.ngBindAction)), a(c[0])(b)
        }
    }
}]), angular.module("archuploadApp").directive("randomClass", function() {
    return {
        restrict: "EA",
        replace: !1,
        link: function(a, b) {
            b.addClass("pop-open-colour-" + Math.floor(18 * Math.random() + 1))
        }
    }
}), angular.module("archuploadApp").run(["$templateCache", function(a) {
    a.put("app/account/login/login.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@test.com</code> / <code>test</code></p><p>Admin account is <code>admin@admin.com</code> / <code>admin</code></p></div><div class=col-sm-12><form class=form name=form ng-submit=login(form) novalidate><div class=form-group><label>Email</label><input type=email name=email class=form-control ng-model=user.email required></div><div class=form-group><label>Password</label><input type=password name=password class=form-control ng-model=user.password required></div><div class="form-group has-error"><p class=help-block ng-show="form.email.$error.required && form.password.$error.required && submitted">Please enter your email and password.</p><p class=help-block ng-show="form.email.$error.email && submitted">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Login</button> <a class="btn btn-default btn-lg btn-register" href=/signup>Register</a></div><hr><div><a class="btn btn-facebook" href="" ng-click="loginOauth(\'facebook\')"><i class="fa fa-facebook"></i> Connect with Facebook</a> <a class="btn btn-google-plus" href="" ng-click="loginOauth(\'google\')"><i class="fa fa-google-plus"></i> Connect with Google+</a> <a class="btn btn-twitter" href="" ng-click="loginOauth(\'twitter\')"><i class="fa fa-twitter"></i> Connect with Twitter</a></div></form></div></div><hr></div>'), a.put("app/account/settings/settings.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class="btn btn-lg btn-primary" type=submit>Save changes</button></form></div></div></div>'), a.put("app/account/signup/signup.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class="{ \'has-success\': form.name.$valid && submitted,\n                                            \'has-error\': form.name.$invalid && submitted }"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show="form.name.$error.required && submitted">A name is required</p></div><div class=form-group ng-class="{ \'has-success\': form.email.$valid && submitted,\n                                            \'has-error\': form.email.$invalid && submitted }"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show="form.email.$error.email && submitted">Doesn\'t look like a valid email.</p><p class=help-block ng-show="form.email.$error.required && submitted">What\'s your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class="{ \'has-success\': form.password.$valid && submitted,\n                                            \'has-error\': form.password.$invalid && submitted }"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show="(form.password.$error.minlength || form.password.$error.required) && submitted">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Sign up</button> <a class="btn btn-default btn-lg btn-register" href=/login>Login</a></div><hr><div><a class="btn btn-facebook" href="" ng-click="loginOauth(\'facebook\')"><i class="fa fa-facebook"></i> Connect with Facebook</a> <a class="btn btn-google-plus" href="" ng-click="loginOauth(\'google\')"><i class="fa fa-google-plus"></i> Connect with Google+</a> <a class="btn btn-twitter" href="" ng-click="loginOauth(\'twitter\')"><i class="fa fa-twitter"></i> Connect with Twitter</a></div></form></div></div><hr></div>'), a.put("app/admin/admin.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><h1>Admin</h1><ul class=list-group><li class=list-group-item ng-repeat="user in users"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul><h1>Upload Student List</h1><form><input type=file name=file onchange="angular.element(this).scope().uploadFile(this.files)"></form><h1>Student List</h1><ul class=list-group><li class=list-group-item ng-repeat="user in allStudents"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <span class=text-muted>{{user.unikey}}</span> <span class=text-muted>{{user.studentNo}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul><h1>Studio List</h1><li class=list-group-item ng-repeat="studio in allStudios"><strong>{{studio.name}}</strong><br><a ng-click=deleteStudio(studio) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li><div class=newStudio><h1>Create new Studio</h1><form role=form><div class=form-group><label for=studioName>Studio Name</label><input ng-model=newStudio.name class=form-control id=studioName name=studioName placeholder="Enter studio name"></div><div class=form-group><label for=studioInfo>Studio Information</label><textarea ng-model=newStudio.description class=form-control id=studioInfo name=studioInfo placeholder="Enter details about studio"></textarea></div><div class=form-group><label for=exampleInputFile>Studio Images</label><button ng-file-select=onFileSelect($files) data-multiple=true class="btn btn-default">Upload</button><table class=list><thead><tr><th>Name</th><th>Size</th><th>Progress</th><th>Actions</th></tr></thead><tbody><tr class=file ng-repeat="file in files"><td>{{file.name}}</td><td>{{file.size}}</td><td>{{file.progress}}</td><td><button ng-click=uploadFile(file)><img iconic data-src=assets/icons/circle-check.svg class=iconic><p>Upload</p></button> <button><img iconic data-src=assets/icons/circle-x.svg class=iconic><p>Cancel</p></button> <button ng-click=removeFile($index)><img iconic data-src=assets/icons/trash.svg class=iconic><p>Remove</p></button></td></tr></tbody></table></div><button ng-click=createStudio() class="btn btn-default">Submit</button></form></div></div>'), a.put("app/catalogue/catalogue.html", '<header class=topBar><div ng-repeat="files in studio.files | limitTo:2 " class=halfTop style=background:url({{files.location}});background-size:cover></div></header><div class=projects fill><div class=studioInfo><h1>{{studio.name}}</h1><p>{{studio.description}}</p></div><div class=g><a href=/project/{{project._id}} ng-repeat="project in projects" class=project><div class=image style=background-image:url({{project.files[0].location}})></div><p>{{project.name}}</p><p>{{project.author.name}}</p></a></div></div><footer class=footer><div class=container><p>Angular Fullstack v2.0.13 | <a href=https://twitter.com/tyhenkel>@tyhenkel</a> | <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a></p></div></footer>'), a.put("app/main/main.html", '<!-- <div ng-include="\'components/navbar/navbar.html\'"></div>\n --><div class=wrapper><header class=container id=main><h2 class=text-center>University of Sydney</h2><h1 class=text-center>Architecture Graduate Exhibtion</h1><div class=logo><img src=assets/images/logos/e61a135c.amaze.png alt=""><p>2011<br>aMaze</p></div><div class=logo><img src=assets/images/logos/adb3c5eb.transform.png alt=""><p>2012<br>Transform</p></div><div class=logo><img src=assets/images/logos/2a7f6a1d.analogue.png alt=""><p>2013<br>Analogue</p></div><div class="logo active"><img src=assets/images/82ab0738.logo.png alt=""><p>2014<br>Aura</p></div></header><div class=exhibitionInformation fill><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam voluptas velit dolorem necessitatibus excepturi dolore nisi quos laboriosam, quidem sit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti obcaecati alias porro atque fuga numquam incidunt quod quo accusamus corporis!</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque, cum. Numquam nesciunt, voluptate in a eum provident ut nam dicta.</p><a ng-repeat="studio in allStudios" href=/catalogue/{{studio._id}}>{{studio.name}}</a></div><footer class=footer><div class=container><p>Angular Fullstack v2.0.13 | <a href=https://twitter.com/tyhenkel>@tyhenkel</a> | <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a></p></div></footer></div>'), a.put("app/project/project.html", '<header class=topBar><div ng-repeat="files in project.files | limitTo:1 " class=fullTop style=background:url({{files.location}});background-size:cover></div></header><div class=projects fill><div class=studioInfo><h1>{{project.name}}</h1><h3>By {{project.author.name}}</h3><div ng-bind-html=project.summary></div></div><div class=g><a href=/project/{{project._id}} ng-repeat="project in projects" class=project><div class=image style=background-image:url({{project.files[0].location}})></div><p>{{project.name}}</p><p>{{project.author.name}}</p></a></div></div><footer class=footer><div class=container><p>Angular Fullstack v2.0.13 | <a href=https://twitter.com/tyhenkel>@tyhenkel</a> | <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a></p></div></footer>'), a.put("app/upload/upload.html", '<div class="background upload"><div class="container upload"><h4><a href=/upload><span ng-hide=noStudent>Hi, {{currentStudent.name}}! Welcome to</span>The Deposit Box</a></h4><!-- Login Section --><form ng-hide=hideform novalidate name=studentLoginForm action="" class=box ng-submit=submitForm(studentLoginForm.$valid)><div class=group ng-class="{\'animation-step-out\':!noStudent}"><input placeholder=Unikey ng-model=studentLoginForm.unikey name=uUnikey ng-required=true ng-minlength=8 ng-maxlength=8> <input placeholder="Student No." ng-model=studentLoginForm.studentNo name=uStudentNo type=password ng-required=true><p ng-show=studentLoginForm.uUnikey.$error.minlength class=help-block>Your Unikey is too short.</p><p ng-show=studentLoginForm.uUnikey.$error.maxlength class=help-block>Your Unikey is too long.</p></div><button ng-class="{\'animation-bounce-out\':!noStudent}" type=submit ng-disabled=studentLoginForm.$invalid><span>Login</span></button></form><!-- Test Section --><!-- Main Section --><section class=popups ng-hide=hideMain><div class=button random-class ng-class="{\'pop-open\':!hideMain}" ng-click=openAddProject()><img iconic data-src=assets/icons/plus.svg class=iconic alt=plus> <span>Add a project</span></div><div class=button random-class ng-class="{\'pop-open\':!hideMain}"><img iconic data-src=assets/icons/settings.svg class=iconic alt=settings> <span>Edit your profile</span></div><div class=button ng-click=getProject(project) random-class ng-class="{\'pop-open\':!hideMain}" ng-repeat="project in projects"><div style=background-image:url({{project.files[0].location}}) class=bkImg></div><span>{{project.name}}</span></div></section><!-- Create Project Section --><section class=addProject ng-hide=hideAddProject><form action="" name=addProjectForm><div class=close ng-click=closeWindow()><img iconic data-src=assets/icons/circle-x.svg class="iconic iconic-sm" alt=settings></div><div class=question ng-show="currentQuestion===0"><label for="">What is your project called?</label><input autofocus ng-model=project.name name=projectName ng-minlength=2><div class=next ng-click=nextQuestion() ng-class={valid:validate()}><p>Next</p></div></div><div class=question ng-show="currentQuestion===1"><label for="">Which Studio?</label><input ng-model=project.studio typeahead="state for state in states | filter:$viewValue | limitTo:8" typeahead-editable=false name=projectStudio><p ng-show=addProjectForm.projectStudio.$invalid class=help-block>You must select a studio from the list.</p><div class=next ng-click=nextQuestion() ng-class={valid:validate()}><p>Next</p></div><div class=last ng-click=lastQuestion() ng-class={valid:validate()}><p>Go Back</p></div></div><div class=question ng-show="currentQuestion===2"><label for="">Project Summary</label><textarea ng-model=project.summary redactor="{minHeight: 100}"></textarea><p class=help-block>Max 100 words.</p><div class=next ng-click=nextQuestion() ng-class={valid:validate()}><p>Next</p></div><div class=last ng-click=lastQuestion() ng-class={valid:validate()}><p>Go Back</p></div></div><div class=question ng-show="currentQuestion===3"><label for="">Project Detail</label><textarea ng-model=project.detail redactor="{minHeight: 100}"></textarea><p class=help-block>Max 250 words.</p><div class=next ng-click=nextQuestion() ng-class={valid:validate()}><p>Next</p></div><div class=last ng-click=lastQuestion() ng-class={valid:validate()}><p>Go Back</p></div></div><div class=question ng-show="currentQuestion===4"><label for="">Upload Images</label><div class="button upld" ng-file-select=onFileSelect($files) data-multiple=true><img iconic data-src=assets/icons/plus.svg class=iconic></div><table class=list ng-show=files.length><thead><tr><th>Name</th><th>Size</th><th>Progress</th><th>Actions</th></tr></thead><tbody><tr class=file ng-repeat="file in files"><td>{{file.name}}</td><td>{{file.size}}</td><td>{{file.progress}}</td><td><button ng-click=uploadFile(file)><img iconic data-src=assets/icons/circle-check.svg class=iconic><p>Upload</p></button> <button><img iconic data-src=assets/icons/circle-x.svg class=iconic><p>Cancel</p></button> <button ng-click=removeFile($index)><img iconic data-src=assets/icons/trash.svg class=iconic><p>Remove</p></button></td></tr></tbody></table><div class=next ng-click=nextQuestion() ng-class={valid:validate()}><p>Next</p></div><div class=last ng-click=lastQuestion() ng-class={valid:validate()}><p>Go Back</p></div></div><div class=question ng-show="currentQuestion===5"><p>Confirm your project\'s details.</p><table style="width:100%;margin:46px 0"><tbody><tr><td>Project Name:</td><td>{{project.name}}</td></tr><tr><td>Project Studio:</td><td>{{project.studio}}</td></tr><tr><td>Project Summary:</td><td>{{project.summary}}</td></tr><tr><td>Project Detail:</td><td>{{project.detail}}</td></tr></tbody></table><div><h6>Images</h6><img style=max-width:45px ng-repeat="file in files" src={{file.uploadData.location}} alt=""></div><div class=flip-container class=create ng-click=confirmProject() ng-class={valid:validate()}><div class=flipper><div class=front><p>Confirm Project</p></div><div ng-click=createProject() class=back><p>Submit</p></div></div></div><div class=last ng-click=lastQuestion() ng-class={valid:validate()}><p>Go Back</p></div></div></form></section><!-- Edit Project Section --><section class=editProject ng-hide=hideEditProject><div class=close ng-click=closeWindow()><img iconic data-src=assets/icons/circle-x.svg class="iconic iconic-sm" alt=settings></div><label for="">Project Name</label><p editable-text=selectedProject.name onaftersave=updateProject()>{{selectedProject.name}}</p><label for="">Project Studio</label><p editable-text=selectedProject.studio e-typeahead="state for state in states | filter:$viewValue | limitTo:8" onaftersave=updateProject()>{{selectedProject.studio}}</p><p ng-bind-html=""></p><label for="">Project Summary</label><redactor-click ng-model=selectedProject.summary></redactor-click><label for="">Project Details</label><redactor-click ng-model=selectedProject.detail></redactor-click><label for="">Images</label></section><!-- <form action="" >\r\n 	  <input type="text" ng-model="myModelObj">\r\n 	  <input type="file" ng-file-select="onFileSelect($files)" multiple>\r\n 	 \r\n 	\r\n 	  <button ng-click="upload.abort()">Cancel Upload</button>\r\n </form> --></div></div>'), a.put("components/modal/modal.html", '<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'), a.put("components/navbar/navbar.html", '<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>archupload</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isAdmin() ng-class="{active: isActive(\'/admin\')}"><a href=/admin>Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-class="{active: isActive(\'/upload\')}"><a href=/upload>Upload</a></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/login\')}"><a href=/login>Login</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/settings\')}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/logout\')}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div></div>'), a.put("components/redactor/redactor-click.html", "<div><p id=btn-save ng-hide=redactorSaveHidden><button class=save ng-click=saveRedactor()>Save</button></p><div class=editable-click id=redactor ng-click=loadRedactor() ng-bind-html=ngModel></div></div>"), a.put("components/stepform/step.html", '<div class=step ng-model=form><h1>{{question}}</h1><input ng-if="steptype===\'input\'" ng-bind-model=model type={{type}}> <button ng-if="steptype===\'button\'" ng-bind-action=action>Check</button> <button ng-show="index!=0" ng-click=lastQuestion()>Back</button> <button ng-hide="tq===index" ng-click=nextQuestion()>Next</button></div>'), a.put("components/stepform/stepform.html", '<form action="" class=steps><div ng-transclude></div></form>')
}]);
