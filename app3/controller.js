function controller($scope, $http, $window) {
  $scope.data = null;
  $scope.dataColumns = [];

  $scope.hasControlPermission = function (m) {
    return m.permission === "CONTROL";
  };

  function getAllMachineWithControlPermission() {
    return ($scope.data || []).filter($scope.hasControlPermission);
  }

  $scope.usePublisher = {
    isAllSelected: false,
    toggleSelect: function (m) {
      // select all
      if (!m) {
        angular.forEach(getAllMachineWithControlPermission(), (m) => {
          m.isSelected = this.isAllSelected;
        });
      }
      // select row
      else {
        if (!m.isSelected) {
          this.isAllSelected = false;
        } else {
          this.isAllSelected = getAllMachineWithControlPermission().every(
            (m) => {
              return m.isSelected;
            },
          );
        }
      }
    },

    isPopupOpen: false,
    isPublisherDisabled: function () {
      return this.isPopupOpen || !($scope.data || []).some((m) => m.isSelected);
    },
    toggleIsPopupOpen: function () {
      this.isPopupOpen = !this.isPopupOpen;
    },

    commandTypes: ["UPGRADE", "RESTART", "SHUTDOWN"],
    commandType: "UPGRADE",

    command: "",

    publish: function () {
      try {
        JSON.parse(this.command);
      } catch (error) {
        alert("Invalid json format of command: " + error.message);
        return;
      }

      let machineIds = getAllMachineWithControlPermission()
        .filter((m) => m.isSelected)
        .map((m) => m.id);

      // call some POST API
      console.log(machineIds, this.command, this.commandType);
    },
  };

  $scope.filters = {
    withControlPermissionOnly: null,
  };

  $scope.customFilter = function (m) {
    let flag = true;

    let filterByWithControlPermissionOnly = JSON.parse(
      $scope.filters.withControlPermissionOnly,
    );

    if (
      filterByWithControlPermissionOnly !== null &&
      !$scope.hasControlPermission(m)
    ) {
      flag = false;
    }

    return flag;
  };

  $scope.refresh = function () {
    $http.get("./data.json").success(function (data, status, headers, config) {
      $scope.data = data.data;
      $scope.dataColumns = data.dataColumns;
    });
  };

  $scope.refresh();
}
