var _ = require('lodash');
var express = require('express');
var tasks = express.Router()
// Task API
/**
 * Create
 */
app.post('/', isAuthenticated, function (req, res) {
    var newTask = new Task(req.body);
    newTask.save(function (err) {
        if (err) {
            res.json({
                info: 'error during task create',
                error: err
            });
        };
        res.json({
            info: 'Task created successfully'
        });
    });
});

/**
 * Read
 */
app.get('/', isAuthenticated, function (req, res) {
    Task.find(function (err, tasks) {
        if (err) {
            res.json({
                info: 'error during find task',
                error: err
            });
        };
        res.json({
            info: 'tasks found successfully',
            data: tasks
        });
    });
});

app.get('/:id', isAuthenticated, function (req, res) {
    Task.findById(req.params.id, function (err, task) {
        if (err) {
            res.json({
                info: 'error during find task',
                error: err
            });
        };
        if (task) {
            res.json({
                info: 'task found successfully',
                data: task
            });
        } else {
            res.json({
                info: 'task not found'
            });
        }
    });
});

/**
 * Update
 */
app.put('/:id', isAuthenticated, function (req, res) {
    Task.findById(req.params.id, function (err, task) {
        if (err) {
            res.json({
                info: 'error during find task',
                error: err
            });
        };
        if (task) {
            _.merge(task, req.body);
            task.save(function (err) {
                if (err) {
                    res.json({
                        info: 'error during task update',
                        error: err
                    });
                };
                res.json({
                    info: 'task updated successfully'
                });
            });
        } else {
            res.json({
                info: 'task not found'
            });
        }
    });
});

/**
 * Delete
 */
app.delete('/:id', isAuthenticated, function (req, res) {
    Task.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.json({
                info: 'error during remove task',
                error: err
            });
        };
        res.json({
            info: 'task removed successfully'
        });
    });
});

module.exports = tasks;