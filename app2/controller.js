function controller($scope, $http, $window) {
  // scopes
  $scope.todos = [];
  $scope.today = new Date().toISOString().slice(0, 10);
  $scope.userId = "";
  $scope.student = {
    firstName: "John",
    lastName: "Doe",
    age: 33,
    marks: {
      math: 33,
    },
  };
  // data fetching
  $scope.getUsersTodos = function (userId) {
    $http
      .get(`https://jsonplaceholder.typicode.com/user/${userId}/todos`)
      .success(function (data, status, headers, config) {
        $scope.todos = data;
      });
  };
}
