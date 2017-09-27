(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('TaskCtrl', TaskCtrl);
    
    TaskCtrl.$inject = ['TaskAPI'];
    
    function TaskCtrl(TaskAPI) {
        var vm = this;

        vm.newTask = {
            subject: ''
        }
        vm.tasks = [];
        vm.editedTask = null;

        vm.create = create;
        vm.destroy = destroy;
        vm.update = update;
        vm.editTask = editTask;
        vm.saveEdits = saveEdits;
        vm.revertEdits = revertEdits;
        vm.editForm = editForm;
        
        activate();
        
        function activate(){
            TaskAPI.task().success(function(response) {
                console.log(response);
                vm.tasks = response.data;
            });
        }

        function create() {
            TaskAPI
                .create(vm.newTask.subject)
                .success(function(response) {
                    console.log(response);
                    vm.newTask.subject = '';
                    vm.tasks.push(response.data);
                })
        }

        function destroy(index) {
            TaskAPI
                .destroy(vm.tasks[index]._id)
                .success(function(response) {
                    console.log(response);
                    vm.tasks.splice(index, 1);
                })
        }

        function update(index) {
            vm.tasks[index].completed = !!vm.tasks[index].completed;
            console.log('i will update: ', vm.tasks[index]);
            TaskAPI
                .update(vm.tasks[index])
                .success(function(response) {
                    console.log(response);
                })
        }

        function editTask(task) {
            console.log('dblclick!');
            vm.editedTask = task;
            task.edit = true;

			// Clone the original todo to restore it on demand.
            vm.originalTask = angular.extend({}, task);
            console.log(vm.originalTask);
        }

        function revertEdits(task) {
            console.log('revert edits', task, vm.tasks[vm.tasks.indexOf(task)], vm.originalTask);
            vm.tasks[vm.tasks.indexOf(task)] = vm.originalTask;
			vm.editedTask = null;
			vm.originalTask = null;
            vm.reverted = true;
            task.edit = false;
        }

        function saveEdits() {
            console.log('save Edits');
        }

        function editForm(index, event) {
            if(event.keyCode == 27) {
                console.log('revert edits', vm.tasks[index]);
                vm.tasks[index] = vm.originalTask;
                vm.editedTask = null;
                vm.originalTask = null;
                vm.reverted = true;
                vm.tasks[index].edit = false;
            }
            if(event.keyCode == 13) {
                update(index);
                vm.editedTask = null;
                vm.originalTask = null;
                vm.reverted = true;
                vm.tasks[index].edit = false;
            }
        }
    }
    
})();