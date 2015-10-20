angular.module('AngularJSObserverPattern', []);

angular.module('AngularJSObserverPattern').factory('UserSelectSubject', function () {
    return {
        observers: [],
        registerObserver: function (observer) {
            var index = this.observers.indexOf(observer);
            if (index < 0) {
                this.observers.push(observer);
            }
        },
        notifyUserHasBeenSelected: function (selectedUser) {
            this.observers.forEach(function (observer) {
                observer.notifyUserHasBeenSelected(selectedUser);
            });
        }
    };
});

angular.module('AngularJSObserverPattern').factory('UserSelectObserver', function () {
    return function UserSelectObserver() {
        this.notifyUserHasBeenSelected = function () {
            console.error('UserSelectObserver.notifyUserHasBeenSelected not implemented.');
        };
    };
});

angular.module('AngularJSObserverPattern').controller('UserListController', function ($scope, UserSelectSubject) {
    $scope.users = [
        {
            name: 'Sergio Mattarella',
            email: 'sergio.mattarella@gmail.com'
        },
        {
            name: 'Giorgio Napolitano',
            email: 'giorgio.napolitano@yahoo.com'
        },
        {
            name: 'Carlo Azelio Ciampi',
            email: 'carlo.azelio.ciampi@hotmail.com'
        }
    ];

    $scope.selectUser = function (user) {
        // We tell the Subject to notify the Observers that a user has been selected.
        UserSelectSubject.notifyUserHasBeenSelected(user);
    };
});

angular.module('AngularJSObserverPattern').controller('UserDetailController', function ($scope, $timeout, UserSelectSubject, UserSelectObserver) {
    // Initially no user is selected.
    $scope.user = null;

    // We create a new instance of UserSelectObserver
    // and we define the notifyUserHasBeenSelected method.
    var observer = new UserSelectObserver();
    observer.notifyUserHasBeenSelected = function (selectedUser) {
        $scope.user = selectedUser;
        // Calling the $scope.apply method in a $timeout function is fundamental.
        // This will prevent the "$apply already in progress" error.
        $timeout($scope.apply);
    };

    // We subscribe our observer to the Subject.
    UserSelectSubject.registerObserver(observer);
});
