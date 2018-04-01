angular
  .module("todoApp", ["ngResource"])
  .constant("baseURL", "http://localhost:9000/todoApp/")

  // ----------- TaskService for REST API calls ---------------
  // since factory and controller are small functions here, thats why on same file

  .factory("TaskService", function($resource, baseURL) {
    var data = $resource(
      baseURL + "tasks/:id",
      { id: "@id" },
      {
        update: {
          method: "PUT"
        },
        delete: {
            method: "DELETE"
        }
      }
    );
    return data;
  })

  // --------------- controller -------------------------------
  .controller("todoController", function($scope, TaskService, $http) {

    // initiailize form data
    $scope.formData = {
      todo: "",
      status: ""
    };

    // submit form function. Proper form validation not implemented due to time constraints
    $scope.submitForm = function() {
      if (
        $scope.formData.todo !== "" &&
        $scope.formData.todo !== undefined &&
        $scope.formData.todo !== null &&
        $scope.formData.status !== "" &&
        $scope.formData.status !== undefined &&
        $scope.formData.status !== null
      ) {
        $scope.addTask($scope.formData);
        resetFormData();
      }
    };

    // resets form on submission
    function resetFormData() {
      $scope.formData = {
        todo: "",
        status: ""
      };
    }

    // initialize angularJS application
    $scope.init = function init() {
      $scope.tasks = TaskService.query();
      console.log($scope.tasks);
    };

    //  http rest call to fetch task list
    $scope.addTask = function addTask(task) {
      TaskService.save(task, $scope.init);
    };

    // rest call to update status "PENDING " <----> "COMPLETE"
    $scope.updateStatus = function updateStatus(id, task) {
      if (task.status == "PENDING") {
        task.status = "COMPLETED";
      } else if (task.status == "COMPLETED") {
        task.status = "PENDING";
      }
      TaskService.update({ id: id }, task, $scope.init);
    };

    // rest call to remove task from server
    $scope.removeTask = function removeTask(id) {
      TaskService.delete({ id: id}, function callback(data) {
          $scope.init();
      });
    };
  });
